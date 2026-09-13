import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Plus,
  Minus,
  RotateCcw,
  ShieldCheck,
  Tag,
  User,
  X,
} from "lucide-react";

import type { SingleVehicleModel } from "../models/singleVehicleModel";
import { formatKm, formatPrice } from "../utils/formatter";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useLanguage } from "../i18n/LanguageContext";

interface VehicleDetailsProps {
  vehicle: SingleVehicleModel;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const gallery =
    vehicle.images.length > 0
      ? vehicle.images
      : vehicle.thumbnailUrl
        ? [
            {
              imageUrl: vehicle.thumbnailUrl,
              altText: vehicle.title,
            },
          ]
        : [];

  /* =========================================================
     IMAGE NAVIGATION
  ========================================================= */

  const previousImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );

    setZoom(1);
  };

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    );

    setZoom(1);
  };

  /* =========================================================
     OPEN LIGHTBOX
  ========================================================= */

  const openLightbox = (index = currentImage) => {
    setCurrentImage(index);
    setZoom(1);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
  };

  /* =========================================================
     ZOOM
  ========================================================= */

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  /* =========================================================
     MOUSE WHEEL ZOOM
  ========================================================= */

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!lightboxOpen) return;

    event.preventDefault();

    if (event.deltaY < 0) {
      setZoom((prev) => Math.min(prev + 0.1, 3));
    } else {
      setZoom((prev) => Math.max(prev - 0.1, 1));
    }
  };

  /* =========================================================
     KEYBOARD CONTROLS
  ========================================================= */

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "+" || event.key === "=") {
        zoomIn();
      }

      if (event.key === "-") {
        zoomOut();
      }

      if (event.key === "0") {
        resetZoom();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, gallery.length]);

  /* =========================================================
     SWIPE
  ========================================================= */

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: previousImage,
    trackMouse: true,
  });

  const { language, t } = useLanguage();

  const whatsappMessage =
    language === "hi"
      ? `नमस्ते, मैं श्री गणेश ऑटोडील पर सूचीबद्ध ${vehicle.title} (${vehicle.manufactureYear}) में रुचि रखता हूँ, जिसका मूल्य ${formatPrice(
          vehicle.price
        )} है। क्या यह उपलब्ध है?`
      : `Hi, I'm interested in the ${vehicle.title} (${vehicle.manufactureYear}) listed for ${formatPrice(
          vehicle.price
        )} on Shree Ganesh Autodeal. Is it still available?`;

  const whatsappUrl = `https://wa.me/918982883521?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <div className="space-y-6 pb-2">
        {/* =====================================================
            MAIN IMAGE CONTAINER
        ===================================================== */}
        <div {...handlers} className="relative overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => openLightbox()}
            className="group relative flex aspect-[4/3] sm:aspect-[16/9] w-full cursor-zoom-in items-center justify-center overflow-hidden bg-slate-100"
          >
            <img
              src={gallery[currentImage]?.imageUrl}
              alt={gallery[currentImage]?.altText || vehicle.title}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
            />

            {/* Bottom Gradient for Contrast */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Click to Enlarge Badge */}
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
              {t("tapToEnlarge")}
            </div>
          </button>

          {/* Status & Verified Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
              {vehicle.status}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-xs backdrop-blur-xs">
              <ShieldCheck size={12} className="text-emerald-600" />
              {t("verified")}
            </span>
          </div>

          {/* Previous / Next Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm backdrop-blur-xs transition hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm backdrop-blur-xs transition hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-3 left-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
              {t("listedPrice")}
            </p>
            <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-xs">
              {formatPrice(vehicle.price)}
            </p>
          </div>
        </div>

        {/* Gallery Mobile Dots & Thumbnails */}
        {gallery.length > 1 && (
          <div className="space-y-2">
            {/* Dots */}
            <div className="flex justify-center gap-1.5 sm:hidden">
              {gallery.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    currentImage === index ? "w-5 bg-[var(--maroon)]" : "w-1.5 bg-slate-300"
                  }`}
                />
              ))}
            </div>

            {/* Thumbnail Row */}
            <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className={`h-14 w-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                    currentImage === index
                      ? "border-[var(--maroon)] ring-2 ring-red-100"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText || `Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            TITLE & BASIC INFO
        ===================================================== */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[var(--maroon)]">
              {vehicle.category.name}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {vehicle.location}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            {vehicle.title}
          </h1>

          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            {vehicle.brand} • {vehicle.modelName}
          </p>
        </div>

        {/* =====================================================
            KEY HIGHLIGHTS GRID (2 cols on mobile, 4 on desktop)
        ===================================================== */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <InfoCard
            icon={<Gauge size={18} />}
            label={t("kilometers")}
            value={formatKm(vehicle.kilometersDriven)}
          />

          <InfoCard
            icon={<Calendar size={18} />}
            label={t("manufactureYear")}
            value={vehicle.manufactureYear}
          />

          <InfoCard
            icon={<Fuel size={18} />}
            label={t("fuelType")}
            value={vehicle.fuelType}
          />

          <InfoCard
            icon={<User size={18} />}
            label={t("ownership")}
            value={`${vehicle.ownerSerial} ${t("ownerSerial")}`}
          />
        </div>

        {/* =====================================================
            DESCRIPTION
        ===================================================== */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <h3 className="mb-2 text-sm sm:text-base font-bold text-[var(--ink)]">
            {t("aboutMotorcycle")}
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
            {vehicle.description || t("defaultDescription")}
          </p>
        </section>

        {/* =====================================================
            SPECIFICATIONS TABLE
        ===================================================== */}
        <section>
          <h3 className="mb-2 text-sm sm:text-base font-bold text-[var(--ink)]">
            {t("specifications")}
          </h3>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <SpecRow
              icon={<Tag size={16} />}
              label={t("brand")}
              value={vehicle.brand}
            />

            <SpecRow
              icon={<Tag size={16} />}
              label={t("model")}
              value={vehicle.modelName}
            />

            <SpecRow
              icon={<Palette size={16} />}
              label={t("color")}
              value={vehicle.color}
            />

            <SpecRow
              icon={<Tag size={16} />}
              label={t("categoryLabel")}
              value={vehicle.category.name}
            />

            <SpecRow
              icon={<Calendar size={16} />}
              label={t("manufactureYear")}
              value={vehicle.manufactureYear}
            />

            <SpecRow
              icon={<MapPin size={16} />}
              label={t("location")}
              value={vehicle.location}
            />
          </div>
        </section>

        {/* =====================================================
            STICKY BOTTOM CONTACT ACTIONS
        ===================================================== */}
        <div className="sticky bottom-0 z-20 grid grid-cols-2 gap-2.5 border-t border-slate-200 bg-white/95 py-3 backdrop-blur-md">
          <a
            href="tel:+918982883521"
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--maroon)] py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[var(--maroon-dark)] active:scale-95 cursor-pointer"
          >
            <Phone size={16} />
            <span>{t("callDealer")}</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50 py-3 text-xs sm:text-sm font-bold text-emerald-700 shadow-xs transition hover:bg-emerald-100 active:scale-95 cursor-pointer"
          >
            <MessageCircle size={16} className="text-emerald-600" />
            <span>{t("whatsApp")}</span>
          </a>
        </div>
      </div>


      {/* =======================================================
          FULLSCREEN IMAGE LIGHTBOX
      ======================================================= */}

      {lightboxOpen && gallery.length > 0 && (

        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
          onClick={closeLightbox}
          onWheel={handleWheel}
        >

          {/* ===================================================
              TOP BAR
          =================================================== */}

          <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between">

            <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              {currentImage + 1} / {gallery.length}
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X size={22} />
            </button>

          </div>


          {/* ===================================================
              IMAGE
          =================================================== */}

          <div
            className="flex h-full w-full items-center justify-center overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >

            <img
              src={gallery[currentImage]?.imageUrl}
              alt={gallery[currentImage]?.altText}
              draggable={false}
              className="max-h-[85vh] max-w-[90vw] select-none object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom})`,
                cursor: zoom > 1 ? "grab" : "zoom-in",
              }}
              onDoubleClick={() =>
                setZoom((prev) => (prev === 1 ? 2 : 1))
              }
            />

          </div>


          {/* ===================================================
              PREVIOUS
          =================================================== */}

          {gallery.length > 1 && (

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronLeft size={26} />
            </button>

          )}


          {/* ===================================================
              NEXT
          =================================================== */}

          {gallery.length > 1 && (

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronRight size={26} />
            </button>

          )}


          {/* ===================================================
              ZOOM CONTROLS
          =================================================== */}

          <div
            className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-white/10 p-1.5 backdrop-blur"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 1}
              className="rounded-xl p-2.5 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={18} />
            </button>

            <span className="min-w-[55px] text-center text-xs font-semibold text-white">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= 3}
              className="rounded-xl p-2.5 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={18} />
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className="rounded-xl p-2.5 text-white transition hover:bg-white/15"
            >
              <RotateCcw size={17} />
            </button>

          </div>


          {/* ===================================================
              THUMBNAILS
          =================================================== */}

          {gallery.length > 1 && (

            <div
              className="absolute bottom-5 right-5 hidden max-w-[40vw] gap-2 overflow-x-auto rounded-2xl bg-white/10 p-2 backdrop-blur md:flex"
              onClick={(event) => event.stopPropagation()}
            >

              {gallery.map((image, index) => (

                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setCurrentImage(index);
                    setZoom(1);
                  }}
                  className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    currentImage === index
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >

                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="h-full w-full object-cover"
                  />

                </button>

              ))}

            </div>

          )}

        </div>

      )}

    </>
  );
};


/* =============================================================
   INFO CARD
============================================================= */

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoCard = ({
  icon,
  label,
  value,
}: InfoCardProps) => (
  <div className="flex items-center gap-3 border-b border-r border-black/5 p-3 md:border-b-0">

    <div className="shrink-0 text-[var(--maroon)]">
      {icon}
    </div>

    <div className="min-w-0">

      <p className="text-[9px] font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="truncate text-xs font-bold text-[var(--ink)]">
        {value}
      </p>

    </div>

  </div>
);


/* =============================================================
   SPEC ROW
============================================================= */

interface SpecRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const SpecRow = ({
  icon,
  label,
  value,
}: SpecRowProps) => (
  <div className="flex items-center justify-between gap-4 px-4 py-3">

    <div className="flex items-center gap-2.5 text-gray-400">

      <span className="text-[var(--maroon)]">
        {icon}
      </span>

      <span className="text-xs font-medium">
        {label}
      </span>

    </div>

    <span className="text-right text-xs font-semibold text-[var(--ink)]">
      {value}
    </span>

  </div>
);

export default VehicleDetails;
