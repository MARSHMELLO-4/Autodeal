import { useState } from "react";
import { ArrowRight, Bike, Calendar, Gauge, MessageCircle } from "lucide-react";
import type { VehicleModel } from "../models/vehicleModel";
import { formatKm, formatPrice } from "../utils/formatter";
import { buildWhatsAppUrl } from "../utils/whatsapp";
import { useLanguage } from "../i18n/useLanguage";

interface VehicleCardProps {
  vehicle: VehicleModel;
  onOpen: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/90 text-white",
  RESERVED: "bg-amber-400/90 text-black",
  SOLD: "bg-gray-900/90 text-white",
};

const VehicleCard = ({ vehicle, onOpen }: VehicleCardProps) => {
  const { language, t } = useLanguage();
  const [imgReady, setImgReady] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(
    vehicle.title,
    vehicle.manufactureYear,
    vehicle.price,
    language,
  );

  const showImage = Boolean(vehicle.thumbnailUrl) && !imgFailed;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_-26px_rgba(28,25,23,0.35)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_-24px_rgba(153,27,27,0.34)] hover:ring-maroon-200/80 active:scale-[0.99]">
      {/* Top gradient accent revealed on hover */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-maroon-800 via-maroon-600 to-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* IMAGE */}
      <button
        type="button"
        onClick={() => onOpen(vehicle.id.toString())}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left cursor-pointer"
      >
        {showImage ? (
          <>
            <div
              className={`skeleton-shimmer absolute inset-0 transition-opacity duration-500 ${
                imgReady ? "opacity-0" : "opacity-100"
              }`}
              aria-hidden="true"
            />
            <img
              src={vehicle.thumbnailUrl ?? undefined}
              alt={vehicle.title}
              loading="lazy"
              onLoad={() => setImgReady(true)}
              onError={() => setImgFailed(true)}
              className={`relative h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                imgReady ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Bike size={44} className="text-slate-400" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Status */}
        <div
          className={`absolute left-3 top-3 flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur ${statusStyles[vehicle.status]}`}
        >
          {vehicle.status === "AVAILABLE" && (
            <span className="relative mr-1.5 inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-white" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          )}
          {vehicle.status}
        </div>

        {/* Category */}
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-ink shadow-sm backdrop-blur">
          {vehicle.category.name}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/70">
            {t("priceLabel")}
          </p>

          <p className="text-base sm:text-xl font-black text-white drop-shadow-md">
            {formatPrice(vehicle.price)}
          </p>
        </div>
      </button>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        {/* Bike name */}
        <h2 className="truncate text-sm sm:text-lg font-bold leading-tight text-ink">
          {vehicle.title}
        </h2>

        {/* Brand / model */}
        <p className="mt-0.5 sm:mt-1 truncate text-xs text-moss">
          {vehicle.brand} • {vehicle.modelName}
        </p>

        {/* Key Specs Micro-Chips */}
        <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px] font-medium text-slate-600">
          <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700 transition-colors group-hover:bg-maroon-50 group-hover:text-maroon-700">
            <Calendar size={11} className="text-slate-400 shrink-0" />
            {vehicle.manufactureYear}
          </span>

          <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700 transition-colors group-hover:bg-maroon-50 group-hover:text-maroon-700">
            <Gauge size={11} className="text-slate-400 shrink-0" />
            {formatKm(vehicle.kilometersDriven)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
          <button
            type="button"
            aria-label="View Details"
            onClick={() => onOpen(vehicle.id.toString())}
            className="btn-spring group/button flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-maroon-600 to-maroon-800 py-2 sm:py-2.5 text-xs font-bold text-white shadow-sm shadow-maroon-900/20 cursor-pointer"
          >
            <span>{t("viewDetails")}</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover/button:translate-x-1"
            />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-spring flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/80 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
            title="Chat on WhatsApp"
            aria-label="Chat about this bike on WhatsApp"
          >
            <MessageCircle size={15} className="text-emerald-600" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;