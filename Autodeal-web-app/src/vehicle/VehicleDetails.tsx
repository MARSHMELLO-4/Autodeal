import { Calendar, Fuel, IndianRupee, MapPin, Palette, Phone, Tag, User, MessageCircle, ShieldCheck, Gauge } from "lucide-react";
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
      ? [{ imageUrl: vehicle.thumbnailUrl, altText: vehicle.title }]
      : [];

  return (
    <div className="space-y-8">
      <div className="relative">
        <img src={gallery[0]?.imageUrl} alt={vehicle.title} className="h-80 w-full rounded-2xl object-cover shadow-md" />
        <div className="price-tag absolute -bottom-4 left-6 flex rotate-[-2deg] items-center bg-[var(--marigold)] py-2 pl-5 pr-4 shadow-lg">
          <span className="font-mono text-lg font-bold text-[var(--maroon-dark)]">
            {formatPrice(vehicle.price)}
          </span>
        </div>

        {gallery.length > 1 && (
          <div className="mt-6 grid grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image.imageUrl}
                alt={image.altText}
                className="h-24 w-full cursor-pointer rounded-lg object-cover transition hover:opacity-80"
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[var(--moss)]/10 px-4 py-1 text-sm font-bold text-[var(--moss)]">
            {vehicle.status}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-dashed border-[var(--ink)]/25 px-4 py-1 text-sm font-medium text-[var(--ink)]/60">
            <ShieldCheck size={15} />
            Verified Vehicle
          </span>
        </div>
        <h2 className="font-display text-3xl italic text-[var(--ink)]">{vehicle.title}</h2>
      </div>

      <div className="rounded-xl bg-[var(--paper-soft)] p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--ink)]/60">Description</h3>
        <p className="leading-7 text-[var(--ink)]/75">
          {vehicle.description ||
            "This vehicle has been inspected and maintained by Shree Ganesh Autodeal. Contact us to know more or schedule a visit."}
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--ink)]/60">Specifications</h3>
        <div className="divide-y divide-[var(--ink)]/8 rounded-xl border border-[var(--ink)]/8">
          <SpecRow icon={<Tag size={16} />} label="Brand" value={vehicle.brand} />
          <SpecRow icon={<Tag size={16} />} label="Model" value={vehicle.modelName} />
          <SpecRow icon={<Calendar size={16} />} label="Year" value={vehicle.manufactureYear} />
          <SpecRow icon={<Gauge size={16} />} label="Kilometers" value={formatKm(vehicle.kilometersDriven)} />
          <SpecRow icon={<Fuel size={16} />} label="Fuel" value={vehicle.fuelType} />
          <SpecRow icon={<User size={16} />} label="Owner" value={`${vehicle.ownerSerial} Owner`} />
          <SpecRow icon={<Palette size={16} />} label="Color" value={vehicle.color} />
          <SpecRow icon={<Tag size={16} />} label="Category" value={vehicle.category.name} />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-[var(--maroon)]/6 p-4 text-[var(--maroon)]">
        <MapPin size={20} />
        <span className="font-medium">{vehicle.location}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a
          href="tel:+919999999999"
          className="flex items-center justify-center gap-2 rounded-full bg-[var(--maroon)] py-4 font-semibold text-white transition hover:bg-[var(--maroon-dark)]"
        >
          <Phone size={18} />
          Call Dealer
        </a>
        <a
          href="https://wa.me/919999999999"
          className="flex items-center justify-center gap-2 rounded-full border border-[var(--moss)] py-4 font-semibold text-[var(--moss)] transition hover:bg-[var(--moss)]/5"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

interface SpecRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const SpecRow = ({ icon, label, value }: SpecRowProps) => (
  <div className="flex items-center justify-between px-5 py-3.5">
    <span className="flex items-center gap-2.5 text-sm text-[var(--ink)]/55">
      {icon}
      {label}
    </span>
    <span className="font-mono text-sm font-semibold text-[var(--ink)]">{value}</span>
  </div>
);

export default VehicleDetails;