import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Loader2, X } from "lucide-react";
import VehicleDetails from "./VehicleDetails";
import type { SingleVehicleModel } from "../models/singleVehicleModel";

interface VehicleDrawerProps {
  vehicle: SingleVehicleModel | null;
  loading: boolean;
  setSelectedVehicle: Dispatch<
    SetStateAction<SingleVehicleModel | null>
  >;
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
      className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={() => setSelectedVehicle(null)}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full overflow-y-auto bg-white shadow-2xl animate-in slide-in-from-right duration-300 md:w-[700px] xl:w-[850px]"
      >
        {/* Close */}

        <button
          onClick={() => setSelectedVehicle(null)}
          className="absolute right-5 top-5 z-20 rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-100"
        >
          <X size={22} />
        </button>

        {/* Loading */}

        {loading && (
          <div className="flex h-full flex-col items-center justify-center gap-5">
            <Loader2
              className="animate-spin text-emerald-700"
              size={42}
            />

            <p className="text-lg font-medium text-gray-600">
              Loading vehicle details...
            </p>
          </div>
        )}

        {/* Content */}

        {!loading && vehicle && (
          <div className="p-8">
            <VehicleDetails vehicle={vehicle} />
          </div>
        )}
      </aside>
    </div>
  );
};

export default VehicleDrawer;
