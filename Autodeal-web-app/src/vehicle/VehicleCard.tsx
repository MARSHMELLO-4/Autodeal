import {
  ArrowRight,
  Bike,
  Calendar,
  Gauge,
  MapPin,
} from "lucide-react";
import type { VehicleModel } from "../models/vehicleModel";
import { formatKm, formatPrice } from "../utils/formatter";

interface VehicleCardProps {
  vehicle: VehicleModel;
  onOpen: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  AVAILABLE:
    "bg-emerald-500/90 text-white border border-emerald-400",
  RESERVED:
    "bg-amber-400/90 text-black border border-amber-300",
  SOLD:
    "bg-gray-900/90 text-white border border-gray-700",
};

const VehicleCard = ({ vehicle, onOpen }: VehicleCardProps) => {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      {/* IMAGE */}
      <button
        type="button"
        onClick={() => onOpen(vehicle.id.toString())}
        className="relative block h-72 overflow-hidden"
      >
        {vehicle.thumbnailUrl ? (
          <img
            src={vehicle.thumbnailUrl}
            alt={vehicle.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Bike
              size={70}
              className="text-slate-400"
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Status */}
        <div
          className={`absolute left-5 top-5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur ${statusStyles[vehicle.status]}`}
        >
          {vehicle.status}
        </div>

        {/* Category */}
        <div className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold text-[var(--ink)] shadow backdrop-blur">
          {vehicle.category.name}
        </div>

        {/* Price */}
        <div className="absolute bottom-5 left-5">
          <div className="rounded-2xl bg-white/95 px-5 py-3 shadow-xl backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-[var(--moss)]">
              Starting Price
            </p>

            <h3 className="font-mono text-2xl font-black text-[var(--maroon)]">
              {formatPrice(vehicle.price)}
            </h3>
          </div>
        </div>
      </button>

      {/* CONTENT */}
      <div className="space-y-6 p-6">

        {/* Title */}
        <div>
          <h2 className="line-clamp-1 text-2xl font-bold text-[var(--ink)]">
            {vehicle.title}
          </h2>

          <p className="mt-1 text-sm text-[var(--moss)]">
            {vehicle.brand} • {vehicle.modelName}
          </p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--moss)]">
              <Gauge size={15} />
              Mileage
            </div>

            <p className="font-semibold text-[var(--ink)]">
              {formatKm(vehicle.kilometersDriven)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--moss)]">
              <Calendar size={15} />
              Year
            </div>

            <p className="font-semibold text-[var(--ink)]">
              {vehicle.manufactureYear}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--moss)]">
              <Bike size={15} />
              Fuel
            </div>

            <p className="font-semibold text-[var(--ink)]">
              {vehicle.fuelType}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--moss)]">
              <MapPin size={15} />
              City
            </div>

            <p className="truncate font-semibold text-[var(--ink)]">
              {vehicle.location}
            </p>
          </div>

        </div>

        {/* Button */}
        <button
          onClick={() => onOpen(vehicle.id.toString())}
          className="group/button flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--maroon)] to-[var(--maroon-dark)] py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          View Complete Details

          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover/button:translate-x-1"
          />
        </button>

      </div>
    </article>
  );
};

export default VehicleCard;