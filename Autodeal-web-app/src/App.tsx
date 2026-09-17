import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Bike, MessageCircle, Phone, ArrowUp } from "lucide-react";

import { getCategories, getVehicle } from "./api/api-client";

import Header from "./layout/Header";
import HeroBanner from "./layout/HeroBanner";
import TrustTicker from "./layout/TrustTicker";
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
import { useReveal } from "./hooks/useReveal";
import Alert from "@mui/material/Alert";
import { useLanguage } from "./i18n/useLanguage";

function App() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<categoryModel[]>([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<SingleVehicleModel | null>(null);

  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showVehicleAddedAlert, setShowVehicleAddedAlert] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const [filters, setFilters] = useState<filterModel>({
    search: "",
    category: "",
    status: "AVAILABLE",
  });

  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const { vehicles, loading, error: vehicleError } = useVehicles(filters);

  useInventoryWebSocket(filters, setShowVehicleAddedAlert);

  const headerReveal = useReveal<HTMLDivElement>();
  const filtersReveal = useReveal<HTMLDivElement>();

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
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load vehicle"),
      )
      .finally(() => setDetailLoading(false));
  }

  //automatically hiding the notification of the vehicle added
  useEffect(() => {
    if (!showVehicleAddedAlert) return;

    //else for the timer of the 3 seconds
    const timer = setTimeout(() => {
      setShowVehicleAddedAlert(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showVehicleAddedAlert]);

  /* -----------------------------------------------------------
     BACK TO TOP VISIBILITY
  ----------------------------------------------------------- */

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--paper)] pb-24 sm:pb-0">
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
          className="anim-slide-down fixed right-4 top-20 z-[9999] max-w-sm shadow-xl rounded-2xl border border-emerald-200"
        >
          {t("vehicleAddedAlert")}
        </Alert>
      )}

      {/* Hero & Trust Banner */}
      <HeroBanner />

      {/* Trust marquee ticker */}
      <TrustTicker />

      {/* Inventory Section */}
      <section id="inventory" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Section Header */}
        <div
          ref={headerReveal}
          className="reveal mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between sm:mb-7"
        >
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-emerald-500" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-moss">
                {t("verifiedInventory")}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                {activeCategory ? activeCategory.name : t("featuredMotorcycles")}
              </h1>

              <span className="text-xs sm:text-sm font-medium text-moss">
                {t("readyForDelivery")}
              </span>
            </div>
          </div>

          <div className="anim-pop self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-ink ring-1 ring-hairedge shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-maroon-600" />
            <span>
              {vehicles.length} {t("bikesCount")}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div
          ref={filtersReveal}
          className="reveal mb-6"
          style={{ "--d": "90ms" } as React.CSSProperties}
        >
          <FilterPanel
            filters={filters}
            categories={categories}
            setFilters={setFilters}
          />
        </div>

        {/* Error Notification */}
        {(error || vehicleError) && (
          <div className="anim-rise-soft mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error || vehicleError}
          </div>
        )}

        {/* Loading Skeletons in 2-Column Mobile Grid */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-hairedge bg-white p-2.5 sm:p-3 shadow-xs"
              >
                <div className="skeleton-shimmer aspect-[4/3] w-full rounded-xl" />
                <div className="mt-3 h-3 w-3/4 rounded-md bg-slate-200/80" />
                <div className="mt-1.5 h-2.5 w-1/2 rounded-md bg-slate-100" />
                <div className="mt-3 flex gap-1.5">
                  <div className="h-4 w-12 rounded-md bg-slate-100" />
                  <div className="h-4 w-14 rounded-md bg-slate-100" />
                </div>
                <div className="mt-3 h-4 w-1/3 rounded-md bg-slate-200/80" />
                <div className="mt-3 h-8 w-full rounded-xl bg-slate-200/80" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && vehicles.length === 0 && (
          <div className="rounded-3xl border border-dashed border-hairedge bg-white px-4 py-16 text-center sm:px-6 sm:py-20 shadow-xs">
            <div className="anim-pop mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-600">
              <Bike size={32} />
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
              {t("noBikesFound")}
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-moss">
              {t("noBikesSub")}
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
              className="btn-spring mt-5 rounded-xl bg-gradient-to-br from-maroon-600 to-maroon-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-maroon-900/20 cursor-pointer"
            >
              {t("resetAll")}
            </button>
          </div>
        )}

        {/* =====================================================
            VEHICLE GRID: 2-COLUMN ON MOBILE, RESPONSIVE UPWARDS
        ===================================================== */}
        {!loading && vehicles.length > 0 && (
          <div
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
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

      {/* =======================================================
          WHY US & TRUST
      ======================================================= */}
      <section className="border-t border-hairedge bg-paper-soft">
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
          BACK TO TOP (desktop / tablet — clear of the mobile bar)
      ======================================================= */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="anim-pop btn-spring fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon-600 to-maroon-800 text-white shadow-lg shadow-maroon-900/30 cursor-pointer sm:bottom-6 sm:right-6"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* =======================================================
          STICKY MOBILE QUICK CONTACT BAR (Thumb-friendly bottom bar)
      ======================================================= */}
      <div
        className="anim-slide-up fixed bottom-0 inset-x-0 z-30 flex items-center justify-between rounded-t-2xl border-t border-hairedge bg-paper-soft/95 px-4 pt-2.5 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md sm:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-moss">{t("showroom")}</span>
          <span className="flex items-center gap-1.5 text-xs font-black text-ink">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-emerald-500" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
            </span>
            Shree Ganesh Autodeal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/918982883521"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-spring pulse-ring flex items-center gap-1.5 rounded-xl border border-emerald-400 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700"
          >
            <MessageCircle size={15} className="text-emerald-600" />
            <span>{t("whatsApp")}</span>
          </a>

          <a
            href="tel:+918982883521"
            className="btn-spring flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-maroon-600 to-maroon-800 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-maroon-900/25"
          >
            <Phone size={14} />
            <span>{t("call")}</span>
          </a>
        </div>
      </div>
    </main>
  );
}

export default App;