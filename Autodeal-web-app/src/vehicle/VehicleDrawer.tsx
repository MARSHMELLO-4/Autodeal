import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Loader2, X, Phone, MessageCircle } from "lucide-react";
import VehicleDetails from "./VehicleDetails";
import type { SingleVehicleModel } from "../models/singleVehicleModel";
import { buildWhatsAppUrl } from "../utils/whatsapp";

import { useLanguage } from "../i18n/useLanguage";

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
  const { language, t } = useLanguage();

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
      className="fixed inset-0 z-[999] flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:p-8 animate-[fadeIn_.2s_ease]"
      onClick={() => setSelectedVehicle(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-paper shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] animate-[sheetUp_.34s_cubic-bezier(.2,.9,.3,1)] md:h-[88vh] md:rounded-3xl"
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="flex justify-center bg-paper-soft pt-2.5 pb-1 md:hidden">
          <div className="h-1.5 w-10 rounded-full bg-moss/30" />
        </div>

        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-hairedge/80 bg-paper-soft/95 px-4 py-3 sm:px-6 backdrop-blur-lg">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-ink">
              {t("vehicleDetailsTitle")}
            </h2>

            <p className="text-xs text-moss">
              {t("verifiedMotorcycleSub")}
            </p>
          </div>

          <button
            onClick={() => setSelectedVehicle(null)}
            className="btn-spring flex h-10 w-10 items-center justify-center rounded-full bg-paper text-moss hover:bg-maroon-50 hover:text-maroon-700 cursor-pointer"
            aria-label={t("closeDrawer")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-5 px-6">
              <Loader2
                size={44}
                className="animate-spin text-maroon-600"
              />

              <div className="text-center">
                <h3 className="font-display text-lg font-bold text-ink">
                  {t("vehicleDetailsTitle")}
                </h3>

                <p className="mt-1.5 text-sm text-moss">
                  {t("verifiedMotorcycleSub")}
                </p>
              </div>
            </div>
          )}

          {!loading && vehicle && (
            <div className="mx-auto max-w-6xl px-4 pb-6 pt-4 md:px-8">
              <VehicleDetails vehicle={vehicle} />
            </div>
          )}
        </div>

        {/* Fixed Bottom CTA Bar (mobile) */}
        {!loading && vehicle && (
          <div className="anim-slide-up border-t border-hairedge bg-paper-soft/95 px-4 pt-3 pb-safe backdrop-blur-md md:hidden">
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:+918982883521"
                className="btn-spring flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-maroon-600 to-maroon-800 py-3.5 text-sm font-bold text-white shadow-md shadow-maroon-900/25 cursor-pointer"
              >
                <Phone size={17} />
                <span>{t("callDealer")}</span>
              </a>

              <a
                href={
                  vehicle
                    ? buildWhatsAppUrl(
                        vehicle.title,
                        vehicle.manufactureYear,
                        vehicle.price,
                        language,
                      )
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-spring pulse-ring flex items-center justify-center gap-2 rounded-2xl border border-emerald-500 bg-emerald-50 py-3.5 text-sm font-bold text-emerald-700 cursor-pointer"
              >
                <MessageCircle size={17} className="text-emerald-600" />
                <span>{t("whatsApp")}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDrawer;