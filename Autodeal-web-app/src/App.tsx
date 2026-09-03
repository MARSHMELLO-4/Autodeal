import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Bike } from "lucide-react";

import { getCategories, getVehicle, getVehicles } from "./api/api-client";

import Header from "./layout/Header";
import FilterPanel from "./filters/FilterPanel";
import VehicleCard from "./vehicle/VehicleCard";
import VehicleDrawer from "./vehicle/VehicleDrawer";
import WhyUs from "./layout/Footer";

import type { categoryModel } from "./models/categoryModel";
import type { filterModel } from "./models/fIltersModels";
import type { VehicleModel } from "./models/vehicleModel";
import type { SingleVehicleModel } from "./models/singleVehicleModel";
import SubscribeForm from "./layout/SubscribeForm";

function App() {
  const [categories, setCategories] = useState<categoryModel[]>([]);
  const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<SingleVehicleModel | null>(null);

  const [showSubscribe, setShowSubscribe] = useState(false);

  const [filters, setFilters] = useState<filterModel>({
    search: "",
    category: "",
    status: "AVAILABLE",
  });

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  /* -----------------------------------------------------------
     LOAD CATEGORIES
  ----------------------------------------------------------- */

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  /* -----------------------------------------------------------
     LOAD VEHICLES
  ----------------------------------------------------------- */

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

  /* -----------------------------------------------------------
     ACTIVE CATEGORY
  ----------------------------------------------------------- */

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === filters.category),
    [categories, filters.category],
  );

  /* -----------------------------------------------------------
     OPEN VEHICLE
  ----------------------------------------------------------- */

  function openVehicle(id: string) {
    setDetailLoading(true);

    getVehicle(id)
      .then(setSelectedVehicle)
      .catch((err: any) => setError(err.message))
      .finally(() => setDetailLoading(false));
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      {showSubscribe && <SubscribeForm onClose={() => setShowSubscribe(false)} />}
      <div className="sticky top-0 z-50 border-b border-black/5 bg-white relative">
        <Header />

        <div className="absolute right-6 top-1/2 z-[100] flex -translate-y-1/2 items-center gap-3">
          <button
            className="rounded-xl border-2 border-[var(--maroon)] bg-[var(--maroon)] px-4 py-2 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg"

            onClick = {() => {
              setShowSubscribe(true)
            }}
          >
            Subscribe
          </button>
        </div>
      </div>

      <section id="inventory" className="mx-auto max-w-7xl px-6 py-8 md:py-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Our Collection
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {activeCategory ? activeCategory.name : "Featured Motorcycles"}
              </h1>

              <span className="font-display text-sm italic tracking-wide text-[var(--maroon)]/70">
                Carefully selected · Thoroughly inspected · Ready to ride.
              </span>
            </div>
          </div>

          <div className="shrink-0 rounded-full bg-[var(--maroon)] px-4 py-2 text-sm font-bold text-white">
            {vehicles.length} Bikes
          </div>
        </div>

        <div className="mb-7">
          <FilterPanel
            filters={filters}
            categories={categories}
            setFilters={setFilters}
          />
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] animate-pulse rounded-3xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {!loading && vehicles.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
            <Bike size={44} className="mx-auto mb-5 text-gray-300" />

            <h3 className="text-xl font-bold">No motorcycles found</h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Try changing your search or selecting another category.
            </p>

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  category: "",
                  status: "AVAILABLE",
                })
              }
              className="mt-6 rounded-xl bg-[var(--maroon)] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* =====================================================
            VEHICLE GRID
        ===================================================== */}

        {!loading && vehicles.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {/* =======================================================
          WHY US
      ======================================================= */}

      <section className="border-t border-black/5 bg-white">
        <WhyUs />
      </section>

      {/* =======================================================
          VEHICLE DRAWER
      ======================================================= */}

      {(selectedVehicle || detailLoading) && (
        <VehicleDrawer
          vehicle={selectedVehicle}
          loading={detailLoading}
          setSelectedVehicle={setSelectedVehicle}
        />
      )}
    </main>
  );
}

export default App;
