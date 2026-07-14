import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Loader2, X } from "lucide-react";
import VehicleDetails from "./VehicleDetails";
import type { SingleVehicleModel } from "../models/singleVehicleModel";

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
          md:h-[92vh]
          md:max-w-6xl
          md:rounded-3xl
        "
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/90 px-6 py-4 backdrop-blur-lg">

          <div>
            <h2 className="text-lg font-bold text-[var(--ink)]">
              Vehicle Details
            </h2>

            <p className="text-sm text-[var(--moss)]">
              Verified Pre-Owned Motorcycle
            </p>
          </div>

          <button
            onClick={() => setSelectedVehicle(null)}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-slate-100
              transition-all
              duration-300
              hover:rotate-90
              hover:bg-red-50
              hover:text-red-600
            "
          >
            <X size={22} />
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