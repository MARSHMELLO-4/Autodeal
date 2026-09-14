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

  const whatsappUrl = buildWhatsAppUrl(
    vehicle.title,
    vehicle.manufactureYear,
    vehicle.price,
    language,
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]">
      {/* IMAGE */}
      <button
        type="button"
        onClick={() => onOpen(vehicle.id.toString())}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left cursor-pointer"
      >
        {vehicle.thumbnailUrl ? (
          <img
            src={vehicle.thumbnailUrl}
            alt={vehicle.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Bike
              size={44}
              className="text-slate-400"
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Status */}
        <div
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur ${statusStyles[vehicle.status]}`}
        >
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

          <p className="text-base sm:text-xl font-black text-white">
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
          <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
            <Calendar size={11} className="text-slate-400 shrink-0" />
            {vehicle.manufactureYear}
          </span>

          <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
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
            className="group/button flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-maroon-700 py-2 sm:py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-maroon-800 active:scale-95 cursor-pointer shadow-xs"
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
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/80 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 active:scale-95 cursor-pointer"
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