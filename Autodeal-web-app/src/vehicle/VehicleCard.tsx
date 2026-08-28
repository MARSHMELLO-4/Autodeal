import { ArrowRight, Bike } from "lucide-react";
import type { VehicleModel } from "../models/vehicleModel";
import { formatPrice } from "../utils/formatter";

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
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* IMAGE */}

      <button
        type="button"
        onClick={() => onOpen(vehicle.id.toString())}
        className="relative block h-56 w-full overflow-hidden"
      >
        {vehicle.thumbnailUrl ? (
          <img
            src={vehicle.thumbnailUrl}
            alt={vehicle.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Bike
              size={55}
              className="text-slate-400"
            />
          </div>
        )}

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />


        {/* Status */}

        <div
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur ${statusStyles[vehicle.status]}`}
        >
          {vehicle.status}
        </div>


        {/* Category */}

        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-[var(--ink)] shadow-sm backdrop-blur">
          {vehicle.category.name}
        </div>


        {/* Price */}

        <div className="absolute bottom-3 left-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/70">
            Price
          </p>

          <p className="text-xl font-black text-white">
            {formatPrice(vehicle.price)}
          </p>
        </div>
      </button>


      {/* CONTENT */}

      <div className="p-4">

        {/* Bike name */}

        <h2 className="truncate text-lg font-bold leading-tight text-[var(--ink)]">
          {vehicle.title}
        </h2>

        {/* Brand / model */}

        <p className="mt-1 truncate text-xs text-[var(--moss)]">
          {vehicle.brand} • {vehicle.modelName}
        </p>


        {/* Button */}

        <button
          type="button"
          onClick={() => onOpen(vehicle.id.toString())}
          className="group/button mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--maroon)] py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-[var(--maroon-dark)]"
        >
          View Details

          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover/button:translate-x-1"
          />
        </button>

      </div>

    </article>
  );
};

export default VehicleCard;
