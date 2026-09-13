import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Loader2, X } from "lucide-react";
import VehicleDetails from "./VehicleDetails";
import type { SingleVehicleModel } from "../models/singleVehicleModel";

import { useLanguage } from "../i18n/LanguageContext";

interface VehicleDrawerProps {
  vehicle: SingleVehicleModel | null;
  loading: boolean;
  setSelectedVehicle: Dispatch<SetStateAction<SingleVehicleModel | null>>;
}

const VehicleDrawer = ({
  vehicle,
  loading,
  setSelectedVehicle,
}: VehicleDrawerProps) => {
  const { t } = useLanguage();
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVehicle(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [setSelectedVehicle]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-0 backdrop-blur-md md:p-8"
      onClick={() => setSelectedVehicle(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          h-full
          w-full
          overflow-hidden
          bg-[var(--paper)]
          shadow-2xl
          animate-[fadeIn_.25s_ease]
          md:h-[90vh]
          md:max-w-5xl
          md:rounded-3xl
          flex
          flex-col
        "
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="flex justify-center pt-2.5 pb-1 bg-white md:hidden">
          <div className="h-1.5 w-10 rounded-full bg-slate-300" />
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 sm:px-6 sm:py-3.5 backdrop-blur-lg">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--ink)]">
              {t("vehicleDetailsTitle")}
            </h2>

            <p className="text-xs text-slate-500">
              {t("verifiedMotorcycleSub")}
            </p>
          </div>

          <button
            onClick={() => setSelectedVehicle(null)}
            className="
              flex
              h-9
              w-9
              sm:h-10
              sm:w-10
              items-center
              justify-center
              rounded-full
              bg-slate-100
              text-slate-600
              transition-all
              hover:bg-red-50
              hover:text-red-600
              active:scale-95
              cursor-pointer
            "
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-72px)] overflow-y-auto">

          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-6">

              <Loader2
                size={52}
                className="animate-spin text-[var(--maroon)]"
              />

              <div className="text-center">

                <h3 className="text-xl font-semibold text-[var(--ink)]">
                  Loading Vehicle
                </h3>

                <p className="mt-2 text-[var(--moss)]">
                  Please wait while we fetch the latest details...
                </p>

              </div>

            </div>
          )}

          {!loading && vehicle && (
            <div className="mx-auto max-w-6xl p-4 md:p-8">
              <VehicleDetails vehicle={vehicle} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VehicleDrawer;