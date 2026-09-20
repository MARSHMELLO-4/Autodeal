import {
  ShieldCheck,
  FileCheck,
  IndianRupee,
  Sparkles,
  MessageCircle,
  Phone,
  ArrowDown,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";

const HeroBanner = () => {
  const { t } = useLanguage();

  const delay = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);

  return (
    <section className="relative overflow-hidden">
      {/* =====================================================
          IMMERSIVE STAGE: layered warm gradient + grid + grain
      ===================================================== */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#fdecec_0%,#fff6ef_38%,#faf8f4_70%)]" />
        <div className="bg-grid-soft absolute inset-0" />
        <div className="bg-noise absolute inset-0 opacity-[0.24]" />

        {/* Drifting glow orbs */}
        <div className="orb -right-24 -top-24 h-72 w-72 bg-maroon-100/80 sm:h-96 sm:w-96" />
        <div
          className="orb -left-28 top-24 h-80 w-80 bg-amber-100/70"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="orb bottom-0 left-1/3 h-64 w-64 bg-emerald-100/60"
          style={{ animationDelay: "-9s" }}
        />

        {/* Occasional light sweep */}
        <div className="hero-sweep hidden lg:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-2 pt-5 sm:px-6 sm:pb-4 sm:pt-9">
        {/* =====================================================
            MAIN HERO PANEL
        ===================================================== */}
        <div className="relative overflow-hidden rounded-3xl border border-maroon-100/80 bg-paper-soft/85 p-5 shadow-[0_24px_70px_-34px_rgba(153,27,27,0.38)] backdrop-blur-xl sm:rounded-[32px] sm:p-9 lg:p-11">
          {/* Panel inner glows */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-maroon-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />

          {/* Floating accent chips (desktop only) */}
          <div
            className="pointer-events-none absolute right-7 top-10 hidden lg:block"
            aria-hidden="true"
          >
            <div className="animate-floaty flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-white/90 px-4 py-2.5 shadow-lg shadow-emerald-900/5 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-emerald-500" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>
              <span className="text-xs font-bold text-emerald-800">
                {t("verified")}
              </span>
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-14 right-14 hidden lg:block"
            aria-hidden="true"
          >
            <div
              className="animate-floaty2 flex items-center gap-2 rounded-2xl border border-maroon-200/70 bg-white/90 px-4 py-2.5 shadow-lg shadow-maroon-900/5 backdrop-blur-sm"
            >
              <span className="text-maroon-600">
                <IndianRupee size={15} />
              </span>
              <span className="text-xs font-bold text-maroon-800">
                {t("priceBadgeTitle")}
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-start gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              {/* Trust Tag + rotating dashed ring */}
              <div className="relative inline-flex anim-pop" style={delay(0)}>
                <div className="pointer-events-none absolute -inset-2.5 sm:-inset-3">
                  <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-maroon-300/60" />
                </div>
                <div className="relative inline-flex items-center gap-1.5 rounded-full border border-maroon-200/70 bg-white px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-maroon-700 shadow-sm">
                  <Sparkles size={13} className="text-maroon-600" />
                  <span>{t("heroHubTag")}</span>
                </div>
              </div>

              <h1 className="font-display mt-4 text-[27px] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-[38px] sm:leading-[1.08] lg:text-[46px]">
                <span className="anim-rise block" style={delay(120)}>
                  {t("heroTitle1")}
                </span>
                <span
                  className="anim-rise text-gradient-maroon mt-1 block"
                  style={delay(260)}
                >
                  {t("heroTitle2")}
                </span>
                <span
                  className="grow-line mt-3 block h-1.5 w-24 rounded-full bg-gradient-to-r from-maroon-700 to-red-500 sm:w-36"
                  style={delay(560)}
                  aria-hidden="true"
                />
              </h1>

              <p
                className="anim-rise-soft mt-3 max-w-lg text-sm leading-relaxed font-medium text-moss sm:text-base"
                style={delay(420)}
              >
                {t("heroSubtitle")}
              </p>
            </div>

            {/* Quick Mobile Action Chips */}
            <div
              className="anim-rise flex w-full flex-row gap-2.5 pt-0.5 sm:w-auto lg:flex-col lg:gap-3 lg:pt-0"
              style={delay(540)}
            >
              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-spring pulse-ring flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-500/70 bg-white px-4 py-3.5 text-xs text-emerald-700 shadow-sm sm:flex-none sm:text-sm"
              >
                <MessageCircle size={17} className="shrink-0 text-emerald-600" />
                <span className="font-bold">{t("chatWhatsApp")}</span>
              </a>

              <a
                href="tel:+918982883521"
                className="btn-spring flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-maroon-600 to-maroon-800 px-4 py-3.5 text-xs text-white shadow-lg shadow-maroon-900/25 sm:flex-none sm:text-sm"
              >
                <Phone size={16} className="shrink-0" />
                <span className="font-bold">{t("callDealer")}</span>
              </a>
            </div>
          </div>

          {/* Key Value Props Bar */}
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-hairedge/80 pt-4 sm:mt-8 sm:pt-6">
            <div
              className="anim-pop lift flex items-center gap-2 rounded-2xl p-1.5 hover:bg-emerald-50/60 sm:gap-2.5 sm:p-2"
              style={delay(680)}
            >
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-ink sm:text-sm">
                  {t("inspectedBadgeTitle")}
                </p>
                <p className="hidden text-[11px] text-moss sm:block">
                  {t("inspectedBadgeSub")}
                </p>
              </div>
            </div>

            <div
              className="anim-pop lift flex items-center gap-2 rounded-2xl p-1.5 hover:bg-blue-50/60 sm:gap-2.5 sm:p-2"
              style={delay(800)}
            >
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileCheck size={17} />
              </div>
              <div>
                <p className="text-xs font-bold text-ink sm:text-sm">
                  {t("rcBadgeTitle")}
                </p>
                <p className="hidden text-[11px] text-moss sm:block">
                  {t("rcBadgeSub")}
                </p>
              </div>
            </div>

            <div
              className="anim-pop lift flex items-center gap-2 rounded-2xl p-1.5 hover:bg-maroon-50/60 sm:gap-2.5 sm:p-2"
              style={delay(920)}
            >
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-maroon-50 text-maroon-700">
                <IndianRupee size={17} />
              </div>
              <div>
                <p className="text-xs font-bold text-ink sm:text-sm">
                  {t("priceBadgeTitle")}
                </p>
                <p className="hidden text-[11px] text-moss sm:block">
                  {t("priceBadgeSub")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="anim-rise-soft mt-6 hidden justify-center sm:flex"
          style={delay(1200)}
        >
          <div className="flex flex-col items-center text-[10px] font-bold uppercase tracking-[0.25em] text-moss">
            <span>{t("inventory")}</span>
            <ArrowDown size={16} className="animate-cue mt-1.5 text-maroon-600" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;