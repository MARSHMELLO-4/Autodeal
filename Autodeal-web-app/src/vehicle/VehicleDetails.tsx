import {
  Calendar,
  Fuel,
  IndianRupee,
  MapPin,
  Palette,
  Phone,
  Tag,
  User,
  MessageCircle,
  ShieldCheck,
  Gauge,
} from "lucide-react";
import type { SingleVehicleModel } from "../models/singleVehicleModel";
import { formatKm, formatPrice } from "../utils/formatter";

interface VehicleDetailsProps {
  vehicle: SingleVehicleModel;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
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

  return (
    <div className="space-y-8">

      {/* Gallery */}

      <div>
        <img
          src={gallery[0]?.imageUrl}
          alt={vehicle.title}
          className="h-80 w-full rounded-3xl object-cover shadow-lg"
        />

        {gallery.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image.imageUrl}
                alt={image.altText}
                className="h-24 w-full cursor-pointer rounded-xl object-cover transition hover:opacity-80"
              />
            ))}
          </div>
        )}
      </div>

      {/* Header */}

      <div className="space-y-4">

        <div className="flex flex-wrap items-center gap-3">

          <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
            {vehicle.status}
          </span>

          <span className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            <ShieldCheck size={16} />
            Verified Vehicle
          </span>

        </div>

        <h2 className="text-4xl font-bold text-gray-900">
          {vehicle.title}
        </h2>

        <div className="flex items-center gap-2 text-3xl font-extrabold text-emerald-700">
          <IndianRupee size={28} />
          {formatPrice(vehicle.price).replace("₹", "")}
        </div>

      </div>

      {/* Description */}

      <div className="rounded-2xl bg-gray-50 p-5">

        <h3 className="mb-3 text-lg font-semibold">
          Description
        </h3>

        <p className="leading-7 text-gray-600">
          {vehicle.description ||
            "This vehicle has been inspected and maintained by Shree Ganesh Autodeal. Contact us to know more or schedule a visit."}
        </p>

      </div>

      {/* Specifications */}

      <div>

        <h3 className="mb-5 text-xl font-bold">
          Specifications
        </h3>

        <div className="grid grid-cols-2 gap-4">

          <Spec
            icon={<Tag size={18} />}
            label="Brand"
            value={vehicle.brand}
          />

          <Spec
            icon={<Tag size={18} />}
            label="Model"
            value={vehicle.modelName}
          />

          <Spec
            icon={<Calendar size={18} />}
            label="Year"
            value={vehicle.manufactureYear}
          />

          <Spec
            icon={<Gauge size={18} />}
            label="Kilometers"
            value={formatKm(vehicle.kilometersDriven)}
          />

          <Spec
            icon={<Fuel size={18} />}
            label="Fuel"
            value={vehicle.fuelType}
          />

          <Spec
            icon={<User size={18} />}
            label="Owner"
            value={`${vehicle.ownerSerial} Owner`}
          />

          <Spec
            icon={<Palette size={18} />}
            label="Color"
            value={vehicle.color}
          />

          <Spec
            icon={<Tag size={18} />}
            label="Category"
            value={vehicle.category.name}
          />

        </div>

      </div>

      {/* Location */}

      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700">

        <MapPin size={22} />

        <span>{vehicle.location}</span>

      </div>

      {/* Actions */}

      <div className="grid grid-cols-2 gap-4">

        <a
          href="tel:+919999999999"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-4 font-semibold text-white transition hover:bg-emerald-800"
        >
          <Phone size={18} />
          Call Dealer
        </a>

        <a
          href="https://wa.me/919999999999"
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-700 py-4 font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>

      </div>

    </div>
  );
};

interface SpecProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const Spec = ({ icon, label, value }: SpecProps) => (
  <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
      {icon}
    </div>

    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default VehicleDetails;
