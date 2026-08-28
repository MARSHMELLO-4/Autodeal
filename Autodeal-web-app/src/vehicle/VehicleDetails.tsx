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

  return (
    <>
      <div className="space-y-7">

        {/* =====================================================
            MAIN IMAGE
        ===================================================== */}

        <div {...handlers} className="relative overflow-hidden rounded-2xl bg-slate-100" > <button type="button" onClick={() => openLightbox()} className="group relative flex aspect-[16/9] w-full cursor-zoom-in items-center justify-center overflow-hidden bg-slate-100 md:aspect-[16/8]" > <img src={gallery[currentImage]?.imageUrl} alt={gallery[currentImage]?.altText} className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]" /> {/* Subtle background behind image */} <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 via-white to-slate-200" /> {/* Bottom gradient */} <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" /> {/* Click to zoom */} <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur"> Click to enlarge </div> </button> {/* Status */} <div className="absolute left-4 top-4 flex flex-wrap gap-2"> <span className="rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"> {vehicle.status} </span> <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[var(--ink)] shadow-sm backdrop-blur"> <ShieldCheck size={13} /> Verified </span> </div> {/* Navigation */} {gallery.length > 1 && ( <> <button type="button" onClick={previousImage} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white" > <ChevronLeft size={18} /> </button> <button type="button" onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white" > <ChevronRight size={18} /> </button> </> )} {/* Price */} <div className="absolute bottom-4 left-4"> <p className="text-[10px] font-medium uppercase tracking-widest text-white/70"> Price </p> <p className="text-2xl font-black text-white md:text-3xl"> {formatPrice(vehicle.price)} </p> </div> </div>  


        {/* =====================================================
            THUMBNAILS
        ===================================================== */}

        {gallery.length > 1 && (

          <div className="flex gap-2 overflow-x-auto pb-1">

            {gallery.map((image, index) => (

              <button
                key={index}
                type="button"
                onClick={() => openLightbox(index)}
                className={`h-16 min-w-[76px] overflow-hidden rounded-xl border-2 transition ${
                  currentImage === index
                    ? "border-[var(--maroon)]"
                    : "border-transparent opacity-70 hover:opacity-100"
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


        {/* =====================================================
            TITLE
        ===================================================== */}

        <div>

          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--maroon)]">
            {vehicle.category.name}
          </p>

          <h1 className="text-3xl font-black tracking-tight text-[var(--ink)] md:text-4xl">
            {vehicle.title}
          </h1>

          <p className="mt-1 text-sm text-[var(--moss)]">
            {vehicle.brand} • {vehicle.modelName}
          </p>

        </div>


        {/* =====================================================
            HIGHLIGHTS
        ===================================================== */}

        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-black/5 bg-white md:grid-cols-4">

          <InfoCard
            icon={<Gauge size={18} />}
            label="Kilometers"
            value={formatKm(vehicle.kilometersDriven)}
          />

          <InfoCard
            icon={<Calendar size={18} />}
            label="Year"
            value={vehicle.manufactureYear}
          />

          <InfoCard
            icon={<Fuel size={18} />}
            label="Fuel"
            value={vehicle.fuelType}
          />

          <InfoCard
            icon={<User size={18} />}
            label="Owner"
            value={`${vehicle.ownerSerial} Owner`}
          />

        </div>


        {/* =====================================================
            DESCRIPTION
        ===================================================== */}

        <section>

          <h3 className="mb-2 text-lg font-bold text-[var(--ink)]">
            About this motorcycle
          </h3>

          <p className="text-sm leading-7 text-[var(--moss)]">
            {vehicle.description ||
              "Every motorcycle at Shree Ganesh Autodeal goes through a complete inspection before being listed for sale. Contact us for a test ride or more information."}
          </p>

        </section>


        {/* =====================================================
            SPECIFICATIONS
        ===================================================== */}

        <section>

          <h3 className="mb-3 text-lg font-bold text-[var(--ink)]">
            Details
          </h3>

          <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">

            <SpecRow
              icon={<Tag size={16} />}
              label="Brand"
              value={vehicle.brand}
            />

            <SpecRow
              icon={<Tag size={16} />}
              label="Model"
              value={vehicle.modelName}
            />

            <SpecRow
              icon={<Palette size={16} />}
              label="Color"
              value={vehicle.color}
            />

            <SpecRow
              icon={<Tag size={16} />}
              label="Category"
              value={vehicle.category.name}
            />

            <SpecRow
              icon={<MapPin size={16} />}
              label="Location"
              value={vehicle.location}
            />

          </div>

        </section>


        {/* =====================================================
            CTA
        ===================================================== */}

        <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-2 border-t border-black/5 bg-white/95 py-3 backdrop-blur">

          <a
            href="tel:+918982883521"
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--maroon)] py-3 text-sm font-bold text-white transition hover:bg-[var(--maroon-dark)]"
          >
            <Phone size={17} />
            Call Dealer
          </a>

          <a
            href="https://wa.me/918982883521"
            className="flex items-center justify-center gap-2 rounded-xl border border-green-500 py-3 text-sm font-bold text-green-600 transition hover:bg-green-50"
          >
            <MessageCircle size={17} />
            WhatsApp
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
