import { useEffect, useMemo, useState } from "react";
import "./App.css";
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
import { getCategories, getVehicle, getVehicles } from "./api/api-client";
import Header from "./layout/Header";
import FilterPanel from "./filters/FilterPanel";
import CategoryRail from "./filters/CategoryRail";
import VehicleCard from "./vehicle/VehicleCard";
import VehicleDrawer from "./vehicle/VehicleDrawer";
import type { categoryModel } from "./models/categoryModel";
import type { filterModel } from "./models/fIltersModels";
import type { VehicleModel } from "./models/vehicleModel";
import type { SingleVehicleModel } from "./models/singleVehicleModel";

const statusOptions = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Reserved" },
  { value: "SOLD", label: "Sold" },
  { value: "ALL", label: "All" },
];
function App() {
  const [categories, setCategories] = useState<categoryModel[]>([]);
  const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<SingleVehicleModel | null>(null);
  const [filters, setFilters] = useState<filterModel>({
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
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === filters.category),
    [categories, filters.category],
  );

  function openVehicle(id: string) {
    setDetailLoading(true);
    getVehicle(id)
      .then(setSelectedVehicle)
      .catch((err: any) => setError(err.message))
      .finally(() => setDetailLoading(false));
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Header />
        <FilterPanel
          filters={filters}
          categories={categories}
          setFilters={setFilters}
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
                <Bike size={40} className="text-[var(--ink)]/20" />
                <strong className="font-display italic text-[var(--ink)]">
                  No bikes match this search.
                </strong>
                <span className="text-[var(--ink)]/50">
                  Try another model name, category, or status.
                </span>
              </div>
            )}
            {!loading && vehicles.length > 0 && (
              <div
                className="
            grid
            gap-8
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
          "
              >
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
            setSelectedVehicle={setSelectedVehicle}
          />
        )}
      </div>
    </main>
  );
}

export default App;
