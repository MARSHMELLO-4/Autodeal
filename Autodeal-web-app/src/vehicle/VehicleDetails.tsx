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
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";
import type { SingleVehicleModel } from "../models/singleVehicleModel";
import { formatKm, formatPrice } from "../utils/formatter";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

interface VehicleDetailsProps {
  vehicle: SingleVehicleModel;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  const previousImage = () => {
    setCurrentImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: previousImage,
    trackMouse: true,
  });

  const gallery =
    vehicle.images.length > 0
      ? vehicle.images
      : vehicle.thumbnailUrl
        ? [{ imageUrl: vehicle.thumbnailUrl, altText: vehicle.title }]
        : [];

  return (
    <div className="space-y-10">
      {/* Hero Image */}
      <div className="relative overflow-hidden rounded-3xl">
        <div 
        {...handlers}
        className="relative overflow-hidden rounded-3xl">
          <img
            src={gallery[currentImage]?.imageUrl}
            alt={gallery[currentImage]?.altText}
            className="h-[340px] w-full object-cover md:h-[460px]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {gallery.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 backdrop-blur transition hover:bg-white"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 backdrop-blur transition hover:bg-white"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="absolute left-6 top-6 flex gap-3">
            <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-white">
              {vehicle.status}
            </span>

            <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold backdrop-blur">
              <ShieldCheck size={14} />
              Verified Vehicle
            </span>
          </div>

          <div className="absolute bottom-6 left-6">
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">
              Starting Price
            </p>

            <h1 className="mt-1 text-4xl font-black text-white">
              {formatPrice(vehicle.price)}
            </h1>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute left-6 top-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
            {vehicle.status}
          </span>

          <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold backdrop-blur">
            <ShieldCheck size={14} />
            Verified Vehicle
          </span>
        </div>

        <div className="absolute bottom-6 left-6">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            Starting Price
          </p>

          <h1 className="mt-1 text-4xl font-black text-white md:text-5xl">
            {formatPrice(vehicle.price)}
          </h1>
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 1 && (
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {gallery.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative h-24 min-w-[110px] overflow-hidden rounded-2xl border-2 transition ${
                currentImage === index
                  ? "border-[var(--maroon)]"
                  : "border-transparent"
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

      {/* Title */}
      <div>
        <h2 className="text-4xl font-black text-[var(--ink)]">
          {vehicle.title}
        </h2>

        <p className="mt-2 text-lg text-[var(--moss)]">
          {vehicle.brand} • {vehicle.modelName}
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <InfoCard
          icon={<Gauge size={22} />}
          label="Kilometers"
          value={formatKm(vehicle.kilometersDriven)}
        />

        <InfoCard
          icon={<Calendar size={22} />}
          label="Year"
          value={vehicle.manufactureYear}
        />

        <InfoCard
          icon={<Fuel size={22} />}
          label="Fuel"
          value={vehicle.fuelType}
        />

        <InfoCard
          icon={<User size={22} />}
          label="Owner"
          value={`${vehicle.ownerSerial} Owner`}
        />
      </div>

      {/* Description */}
      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5">
        <h3 className="mb-4 text-xl font-bold">Description</h3>

        <p className="leading-8 text-[var(--moss)]">
          {vehicle.description ||
            "Every motorcycle at Shree Ganesh Autodeal goes through a complete inspection before being listed for sale. Contact us for a test ride or more information."}
        </p>
      </section>

      {/* Specifications */}
      <section>
        <h3 className="mb-6 text-2xl font-bold">Specifications</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <SpecCard icon={<Tag />} label="Brand" value={vehicle.brand} />
          <SpecCard icon={<Tag />} label="Model" value={vehicle.modelName} />
          <SpecCard icon={<Palette />} label="Color" value={vehicle.color} />
          <SpecCard
            icon={<Tag />}
            label="Category"
            value={vehicle.category.name}
          />
          <SpecCard
            icon={<MapPin />}
            label="Location"
            value={vehicle.location}
          />
        </div>
      </section>

      {/* CTA */}
      <div className="sticky bottom-0 grid grid-cols-2 gap-4 rounded-3xl bg-white p-5 shadow-2xl">
        <a
          href="tel:+919999999999"
          className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--maroon)] to-[var(--maroon-dark)] py-4 text-base font-bold text-white transition hover:scale-[1.02]"
        >
          <Phone size={20} />
          Call Dealer
        </a>

        <a
          href="https://wa.me/919999999999"
          className="flex items-center justify-center gap-3 rounded-2xl border border-green-500 py-4 text-base font-bold text-green-600 transition hover:bg-green-50"
        >
          <MessageCircle size={20} />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
  <div className="rounded-3xl bg-slate-50 p-5 text-center">
    <div className="mb-3 flex justify-center text-[var(--maroon)]">{icon}</div>

    <p className="text-xs uppercase tracking-widest text-[var(--moss)]">
      {label}
    </p>

    <h4 className="mt-2 text-lg font-bold text-[var(--ink)]">{value}</h4>
  </div>
);

interface SpecCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const SpecCard = ({ icon, label, value }: SpecCardProps) => (
  <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
    <div className="rounded-xl bg-[var(--maroon)]/10 p-3 text-[var(--maroon)]">
      {icon}
    </div>

    <div>
      <p className="text-xs uppercase tracking-wider text-[var(--moss)]">
        {label}
      </p>

      <h4 className="font-semibold text-[var(--ink)]">{value}</h4>
    </div>
  </div>
);

export default VehicleDetails;
