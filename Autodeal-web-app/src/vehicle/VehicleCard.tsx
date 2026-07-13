import { Bike, Gauge, Calendar, MapPin, ArrowRight } from "lucide-react";
import type { VehicleModel } from "../models/vehicleModel";
import { formatKm, formatPrice } from "../utils/formatter";

interface VehicleCardProps {
  vehicle: VehicleModel;
  onOpen: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-[var(--moss)] text-white",
  RESERVED: "bg-[var(--marigold)] text-[var(--ink)]",
  SOLD: "bg-[var(--ink)]/70 text-white",
};

const VehicleCard = ({ vehicle, onOpen }: VehicleCardProps) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--ink)]/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={() => onOpen(vehicle.id.toString())}
        className="relative block h-56 w-full overflow-hidden bg-[var(--paper-soft)]"
      >
        {vehicle.thumbnailUrl ? (
          <img
            src={vehicle.thumbnailUrl}
            alt={vehicle.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Bike className="text-[var(--ink)]/20" size={56} />
          </div>
        )}

        <span className={`absolute left-4 top-4 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles[vehicle.status]}`}>
          {vehicle.status}
        </span>

        <div className="price-tag absolute -right-1 bottom-4 flex rotate-[-3deg] items-center bg-[var(--marigold)] py-1.5 pl-4 pr-3 shadow-md">
          <span className="font-mono text-sm font-semibold text-[var(--maroon-dark)]">
            {formatPrice(vehicle.price)}
          </span>
        </div>
      </button>

      <div className="space-y-4 p-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)]">{vehicle.title}</h2>
          <p className="mt-0.5 text-sm text-[var(--ink)]/50">{vehicle.brand} • {vehicle.modelName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[var(--ink)]/8 py-3 text-sm text-[var(--ink)]/70">
          <span className="flex items-center gap-1.5"><Gauge size={15} className="text-[var(--maroon)]" />{formatKm(vehicle.kilometersDriven)}</span>
          <span className="flex items-center gap-1.5"><Bike size={15} className="text-[var(--maroon)]" />{vehicle.fuelType}</span>
          <span className="flex items-center gap-1.5"><Calendar size={15} className="text-[var(--maroon)]" />{vehicle.manufactureYear}</span>
          <span className="flex items-center gap-1.5"><MapPin size={15} className="text-[var(--maroon)]" />{vehicle.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[var(--paper-soft)] px-3 py-1 text-sm font-medium text-[var(--ink)]/70">
            {vehicle.category.name}
          </span>
          <button
            onClick={() => onOpen(vehicle.id.toString())}
            className="flex items-center gap-2 rounded-full bg-[var(--maroon)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--maroon-dark)]"
          >
            View Details
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;