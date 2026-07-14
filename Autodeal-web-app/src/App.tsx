import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Bike, ShieldCheck, Sparkles, Star } from "lucide-react";
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
import WhyUs from "./layout/Footer";

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
    () => categories.find((c) => c.slug === filters.category),
    [categories, filters.category]
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

      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-[var(--maroon)] via-[var(--maroon-dark)] to-sky-900" />

        <div className="absolute inset-0 bg-black/25" />

        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-6 py-2 lg:py-6">

          {/* <span className="mb-5 flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            <Sparkles size={16} />
            Trusted Used Bike Dealer
          </span>

          <h1 className="max-w-3xl text-5xl font-black leading-tight text-white md:text-7xl">
            Find Your
            <span className="block text-sky-300">
              Perfect Ride.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80">
            Premium quality pre-owned motorcycles that are inspected,
            verified and ready for the road.
          </p> */}

          <div className="mt-10">
            <FilterPanel
              filters={filters}
              categories={categories}
              setFilters={setFilters}
            />
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-3 mb-5">

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <Bike className="mb-4 text-sky-300" />
              <h3 className="text-3xl font-bold text-white">
                {vehicles.length}+
              </h3>
              <p className="text-white/70">
                Available Bikes
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <ShieldCheck className="mb-4 text-sky-300" />
              <h3 className="text-3xl font-bold text-white">
                100%
              </h3>
              <p className="text-white/70">
                Verified Vehicles
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <Star className="mb-4 text-sky-300" />
              <h3 className="text-3xl font-bold text-white">
                4.9★
              </h3>
              <p className="text-white/70">
                Customer Rating
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto mt-20 max-w-7xl px-6" >

        {/* <div className="mb-8">

          <h2 className="text-3xl font-bold text-[var(--ink)]">
            Browse Categories
          </h2>

          <p className="mt-2 text-[var(--moss)]">
            Explore motorcycles by category.
          </p>

        </div> */}

        <CategoryRail
          categories={categories}
          filters={filters}
          setFilters={setFilters}
        />

      </section>

      {/* INVENTORY */}
      <section className="mx-auto mt-24 max-w-7xl px-6 pb-20" id="inventory">

        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <span className="text-sm font-semibold uppercase tracking-widest text-[var(--maroon)]">
              Inventory
            </span>

            <h2 className="mt-2 text-4xl font-black text-[var(--ink)]">
              {activeCategory
                ? activeCategory.name
                : "Featured Motorcycles"}
            </h2>

          </div>

          <div className="rounded-full bg-[var(--maroon)] px-5 py-3 text-sm font-semibold text-white shadow-lg">
            {vehicles.length} Bikes Found
          </div>

        </div>

        {error && (
          <div className="mb-10 rounded-2xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-3xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {!loading && vehicles.length === 0 && (
          <div className="rounded-3xl border border-dashed p-20 text-center">

            <Bike
              size={50}
              className="mx-auto mb-5 text-gray-300"
            />

            <h3 className="text-2xl font-bold">
              No bikes found
            </h3>

            <p className="mt-3 text-gray-500">
              Try changing your search filters.
            </p>

          </div>
        )}

        {!loading && vehicles.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

      {(selectedVehicle || detailLoading) && (
        <VehicleDrawer
          vehicle={selectedVehicle}
          loading={detailLoading}
          setSelectedVehicle={setSelectedVehicle}
        />
      )}

      <div className="#why-us">
        <WhyUs/>
      </div>
    </main>
  );
}

export default App;