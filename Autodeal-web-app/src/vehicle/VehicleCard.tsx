import {
  Bike,
  Gauge,
  Calendar,
  MapPin,
  ArrowRight,
} from "lucide-react";
import type { VehicleModel } from "../models/vehicleModel";
import { formatKm, formatPrice } from "../utils/formatter";

interface VehicleCardProps {
  vehicle: VehicleModel;
  onOpen: (id: string) => void;
}

const statusColors: Record<string, string> = {
  AVAILABLE:
    "bg-emerald-100 text-emerald-700 border border-emerald-200",
  RESERVED:
    "bg-amber-100 text-amber-700 border border-amber-200",
  SOLD:
    "bg-red-100 text-red-700 border border-red-200",
};

const VehicleCard = ({ vehicle, onOpen }: VehicleCardProps) => {
  return (
    <article
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl"
    >
      {/* Image */}

      <button
        type="button"
        onClick={() => onOpen(vehicle.id.toString())}
        className="relative block h-64 w-full overflow-hidden bg-gray-100"
      >
        {vehicle.thumbnailUrl ? (
          <img
            src={vehicle.thumbnailUrl}
            alt={vehicle.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-gray-100">
            <Bike
              className="text-emerald-700"
              size={64}
            />
          </div>
        )}

        <span
          className={`absolute left-4 top-4 rounded-full px-4 py-1 text-xs font-semibold ${
            statusColors[vehicle.status]
          }`}
        >
          {vehicle.status}
        </span>
      </button>

      {/* Body */}

      <div className="space-y-5 p-6">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {vehicle.title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {vehicle.brand} • {vehicle.modelName}
            </p>

          </div>

          <div className="text-right">

            <p className="text-2xl font-extrabold text-emerald-700">
              {formatPrice(vehicle.price)}
            </p>

          </div>

        </div>

        {/* Specs */}

        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-4 text-sm">

          <div className="flex items-center gap-2 text-gray-700">
            <Gauge
              size={18}
              className="text-emerald-700"
            />
            {formatKm(vehicle.kilometersDriven)}
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Bike
              size={18}
              className="text-emerald-700"
            />
            {vehicle.fuelType}
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Calendar
              size={18}
              className="text-emerald-700"
            />
            {vehicle.manufactureYear}
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin
              size={18}
              className="text-emerald-700"
            />
            {vehicle.location}
          </div>

        </div>

        {/* Category */}

        <div className="flex items-center justify-between">

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            {vehicle.category.name}
          </span>

          <button
            onClick={() => onOpen(vehicle.id.toString())}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
          >
            View Details
            <ArrowRight size={18} />
          </button>

        </div>
      </div>
    </article>
  );
};

export default VehicleCard;
