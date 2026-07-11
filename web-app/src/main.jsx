import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bike,
  Gauge,
  IndianRupee,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { getCategories, getVehicle, getVehicles } from "./api";
import "./styles.css";
import VehicleCard from "./vechicle/VehicleCard";
import VehicleDrawer from "./vechicle/VehicleDrawer";
import CategoryRail from "./filters/CategoryRail";
import Header from "./layout/Header";
import FilterPanel from "./filters/FilterPanel";

const statusOptions = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Reserved" },
  { value: "SOLD", label: "Sold" },
  { value: "ALL", label: "All" },
];

function formatPrice(value) {
  if (value === null || value === undefined) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatKm(value) {
  return `${new Intl.NumberFormat("en-IN").format(value || 0)} km`;
}

function App() {
  const [categories, setCategories] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "AVAILABLE",
  });
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    getVehicles(filters)
      .then((page) => {
        setVehicles(page.content || []);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === filters.category),
    [categories, filters.category],
  );

  function openVehicle(id) {
    setDetailLoading(true);
    getVehicle(id)
      .then(setSelectedVehicle)
      .catch((err) => setError(err.message))
      .finally(() => setDetailLoading(false));
  }

  return (
    <main className="shell">
      <Header />
      <FilterPanel
        filters={filters}
        categories={categories}
        onChange={setFilters}
      />

      <section className="content-grid">

        <CategoryRail
          categories={categories}
          setFilters={setFilters}
          filters={filters}
        />

        <section className="inventory">
          <div className="section-title">
            <div>
              <span>
                {activeCategory ? activeCategory.name : "Current inventory"}
              </span>
              <strong>{vehicles.length} bikes found</strong>
            </div>
          </div>

          {error && <div className="notice">{error}</div>}
          {loading && (
            <div className="loading-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          )}

          {!loading && vehicles.length === 0 && (
            <div className="empty-state">
              <Bike size={40} />
              <strong>No bikes match this search.</strong>
              <span>Try another model name, category, or status.</span>
            </div>
          )}

          {!loading && vehicles.length > 0 && (
            <div className="vehicle-grid">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onOpen={openVehicle}
                />
              ))}
            </div>
          )}
        </section>
      </section>

      {(selectedVehicle || detailLoading) && (
        <VehicleDrawer
          vehicle={selectedVehicle}
          loading={detailLoading}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </main>
  );
}

function VehicleDetails({ vehicle }) {
  const gallery = vehicle.images?.length
    ? vehicle.images
    : [{ imageUrl: vehicle.thumbnailUrl, altText: vehicle.title }];
  return (
    <>
      <div className="detail-gallery">
        {gallery
          .filter((image) => image.imageUrl)
          .slice(0, 4)
          .map((image, index) => (
            <img
              src={image.imageUrl}
              alt={image.altText || vehicle.title}
              key={`${image.imageUrl}-${index}`}
            />
          ))}
      </div>
      <div className="detail-content">
        <span className={`status status-${vehicle.status.toLowerCase()}`}>
          {vehicle.status}
        </span>
        <h2>{vehicle.title}</h2>
        <strong className="detail-price">
          <IndianRupee size={22} />
          {formatPrice(vehicle.price).replace("₹", "")}
        </strong>
        <p>
          {vehicle.description ||
            "Well maintained two-wheeler available at Shree Ganesh Autodeal."}
        </p>
        <div className="detail-specs">
          <span>
            Brand<strong>{vehicle.brand}</strong>
          </span>
          <span>
            Model<strong>{vehicle.modelName}</strong>
          </span>
          <span>
            Year<strong>{vehicle.manufactureYear}</strong>
          </span>
          <span>
            Kilometers<strong>{formatKm(vehicle.kilometersDriven)}</strong>
          </span>
          <span>
            Fuel<strong>{vehicle.fuelType}</strong>
          </span>
          <span>
            Owner
            <strong>
              {vehicle.ownerSerial ? `${vehicle.ownerSerial} owner` : "N/A"}
            </strong>
          </span>
          <span>
            Color<strong>{vehicle.color || "N/A"}</strong>
          </span>
          <span>
            Category<strong>{vehicle.category?.name || "Bike"}</strong>
          </span>
        </div>
        {vehicle.location && (
          <p className="location">
            <MapPin size={16} />
            {vehicle.location}
          </p>
        )}
        <a className="primary-action" href="tel:+910000000000">
          Call for this bike
        </a>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
