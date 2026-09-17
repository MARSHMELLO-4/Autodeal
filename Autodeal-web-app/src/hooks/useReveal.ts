import { useEffect, useRef, type RefObject } from "react";

function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const vh =
    window.innerHeight || document.documentElement.clientHeight || 0;
  return rect.top <= vh && rect.bottom >= 0;
}

/**
 * Adds the `is-visible` class to the referenced element the first time it
 * enters the viewport, unlocking CSS `.reveal` / `.reveal-stagger` transitions.
 *
 * Fail-safe: content is never left hidden — the element is revealed
 * immediately if it is already on screen, and a plain scroll listener backs up
 * the IntersectionObserver.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => element.classList.add("is-visible");

    const prefersReduced =
      typeof window.matchMedia !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof IntersectionObserver === "undefined" || prefersReduced || isInViewport(element)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
          window.removeEventListener("scroll", onScroll);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px", ...options },
    );

    const onScroll = () => {
      if (isInViewport(element)) {
        reveal();
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };

    observer.observe(element);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [options]);

  return ref;
}