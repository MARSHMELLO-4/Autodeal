import { ArrowRight, Bike, Calendar, Gauge, MessageCircle, ShieldCheck } from "lucide-react";
import type { VehicleModel } from "../models/vehicleModel";
import { formatKm, formatPrice } from "../utils/formatter";

interface VehicleCardProps {
  vehicle: VehicleModel;
  onOpen: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-emerald-600 text-white",
  RESERVED: "bg-amber-500 text-white",
  SOLD: "bg-slate-700 text-white",
};

const VehicleCard = ({ vehicle, onOpen }: VehicleCardProps) => {
  const whatsappUrl = `https://wa.me/918982883521?text=${encodeURIComponent(
    `Hi, I'm interested in the ${vehicle.title} (${vehicle.manufactureYear}) listed for ${formatPrice(
      vehicle.price
    )} on Shree Ganesh Autodeal. Is it still available?`
  )}`;

  return (
    <article
      onClick={() => onOpen(vehicle.id.toString())}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] cursor-pointer"
    >
      {/* Top Image Section */}
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          {vehicle.thumbnailUrl ? (
            <img
              src={vehicle.thumbnailUrl}
              alt={vehicle.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <Bike size={36} className="text-slate-400" />
            </div>
          )}

          {/* Vignette Overlay for Badges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />

          {/* Floating Badges */}
          <div className="absolute left-2 top-2 flex items-center gap-1">
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow-xs backdrop-blur-xs ${
                statusStyles[vehicle.status] || "bg-slate-700 text-white"
              }`}
            >
              {vehicle.status}
            </span>
          </div>

          <div className="absolute right-2 top-2">
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-slate-700 shadow-xs backdrop-blur-xs">
              {vehicle.category.name}
            </span>
          </div>

          {/* Verified pill overlay on bottom left */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-2.5 sm:p-3.5">
          {/* Title & Subtitle */}
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-[var(--maroon)] transition-colors">
            {vehicle.title}
          </h2>

          <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 line-clamp-1">
            {vehicle.brand} • {vehicle.modelName}
          </p>

          {/* Key Specs Micro-Chips */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-slate-600">
            <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
              <Calendar size={11} className="text-slate-400 shrink-0" />
              {vehicle.manufactureYear}
            </span>

            <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
              <Gauge size={11} className="text-slate-400 shrink-0" />
              {formatKm(vehicle.kilometersDriven)}
            </span>
          </div>

          {/* Price */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-sm sm:text-base font-extrabold text-[var(--ink)]">
              {formatPrice(vehicle.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-2.5 pb-2.5 sm:px-3.5 sm:pb-3.5 pt-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(vehicle.id.toString());
            }}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[var(--maroon)] py-2 text-[11px] sm:text-xs font-bold text-white transition-all duration-200 hover:bg-[var(--maroon-dark)] active:scale-95 cursor-pointer shadow-xs"
          >
            <span>View</span>
            <ArrowRight size={13} />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-xl border border-emerald-500/70 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 active:scale-95 cursor-pointer"
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
