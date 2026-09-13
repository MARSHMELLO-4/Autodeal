import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Bike, MessageCircle, Phone } from "lucide-react";

import { getCategories, getVehicle } from "./api/api-client";

import Header from "./layout/Header";
import HeroBanner from "./layout/HeroBanner";
import FilterPanel from "./filters/FilterPanel";
import VehicleCard from "./vehicle/VehicleCard";
import VehicleDrawer from "./vehicle/VehicleDrawer";
import WhyUs from "./layout/Footer";

import type { categoryModel } from "./models/categoryModel";
import type { filterModel } from "./models/fIltersModels";
import type { SingleVehicleModel } from "./models/singleVehicleModel";
import SubscribeForm from "./layout/SubscribeForm";
import { useVehicles } from "./hooks/useVehicles";
import { useInventoryWebSocket } from "./hooks/useInventoryWebSocket";
import Alert from "@mui/material/Alert";

function App() {
  const [categories, setCategories] = useState<categoryModel[]>([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<SingleVehicleModel | null>(null);

  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showVehicleAddedAlert, setShowVehicleAddedAlert] = useState(false);

  const [filters, setFilters] = useState<filterModel>({
    search: "",
    category: "",
    status: "AVAILABLE",
  });

  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const { vehicles, loading, error: vehicleError } = useVehicles(filters);

  useInventoryWebSocket(filters, setShowVehicleAddedAlert);

  /* -----------------------------------------------------------
     LOAD CATEGORIES
  ----------------------------------------------------------- */

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

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

  //automatically hiding the notification of the vehicle added 
  useEffect(() => {
    if(!showVehicleAddedAlert) return; 

    //else for the timer of the 3 seconds 
    const timer = setTimeout(() => {
      setShowVehicleAddedAlert(false)
    }, 3000);

    return () => clearTimeout(timer);

  }, [showVehicleAddedAlert])

  return (
    <main className="min-h-screen bg-[var(--paper)] pb-16 sm:pb-0">
      {showSubscribe && (
        <SubscribeForm onClose={() => setShowSubscribe(false)} />
      )}

      {/* Sticky Header with integrated Subscribe trigger */}
      <Header onOpenSubscribe={() => setShowSubscribe(true)} />

      {/* Real-time Inventory Alert Toast */}
      {showVehicleAddedAlert && (
        <Alert
          severity="success"
          onClose={() => setShowVehicleAddedAlert(false)}
          className="fixed right-4 top-20 z-[9999] max-w-sm shadow-xl rounded-2xl border border-emerald-200"
        >
          A new vehicle has just been added to the inventory!
        </Alert>
      )}

      {/* Hero & Trust Banner */}
      <HeroBanner />

      {/* Inventory Section */}
      <section id="inventory" className="mx-auto max-w-7xl px-3.5 py-6 sm:px-6 sm:py-10">
        {/* Section Header */}
        <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between sm:mb-7">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Verified Inventory
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
                {activeCategory ? activeCategory.name : "Featured Motorcycles"}
              </h1>

              <span className="text-xs sm:text-sm font-medium text-slate-500">
                • Inspected & Ready for Delivery
              </span>
            </div>
          </div>

          <div className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-bold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--maroon)]" />
            <span>{vehicles.length} Bikes</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterPanel
            filters={filters}
            categories={categories}
            setFilters={setFilters}
          />
        </div>

        {/* Error Notification */}
        {(error || vehicleError) && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm font-medium text-red-600">
            {error || vehicleError}
          </div>
        )}

        {/* Loading Skeletons in 2-Column Mobile Grid */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-xs animate-pulse"
              >
                <div className="aspect-[4/3] w-full rounded-xl bg-slate-200" />
                <div className="mt-3 h-3 w-3/4 rounded-md bg-slate-200" />
                <div className="mt-1.5 h-2.5 w-1/2 rounded-md bg-slate-100" />
                <div className="mt-3 flex gap-1.5">
                  <div className="h-4 w-12 rounded-md bg-slate-100" />
                  <div className="h-4 w-14 rounded-md bg-slate-100" />
                </div>
                <div className="mt-3 h-4 w-1/3 rounded-md bg-slate-200" />
                <div className="mt-3 h-8 w-full rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && vehicles.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-16 text-center sm:px-6 sm:py-20 shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[var(--maroon)]">
              <Bike size={32} />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              No motorcycles found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs sm:text-sm text-slate-500">
              Try adjusting your search terms or select another category above.
            </p>

            <button
              type="button"
              onClick={() =>
                setFilters({
                  search: "",
                  category: "",
                  status: "AVAILABLE",
                })
              }
              className="mt-5 rounded-xl bg-[var(--maroon)] px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[var(--maroon-dark)] active:scale-95 cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* =====================================================
            VEHICLE GRID: 2-COLUMN ON MOBILE, RESPONSIVE UPWARDS
        ===================================================== */}
        {!loading && vehicles.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
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
          WHY US & TRUST
      ======================================================= */}
      <section className="border-t border-slate-200/80 bg-white">
        <WhyUs />
      </section>

      {/* =======================================================
          VEHICLE DETAILS DRAWER / SHEET
      ======================================================= */}
      {(selectedVehicle || detailLoading) && (
        <VehicleDrawer
          vehicle={selectedVehicle}
          loading={detailLoading}
          setSelectedVehicle={setSelectedVehicle}
        />
      )}

      {/* =======================================================
          STICKY MOBILE QUICK CONTACT BAR (Thumb-friendly bottom bar)
      ======================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-between border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-md sm:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Showroom</span>
          <span className="text-xs font-black text-slate-800">Shree Ganesh Autodeal</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/918982883521"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 active:scale-95"
          >
            <MessageCircle size={15} className="text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <a
            href="tel:+918982883521"
            className="flex items-center gap-1.5 rounded-xl bg-[var(--maroon)] px-3.5 py-2 text-xs font-bold text-white shadow-xs active:scale-95"
          >
            <Phone size={14} />
            <span>Call</span>
          </a>
        </div>
      </div>
    </main>
  );
}

export default App;
