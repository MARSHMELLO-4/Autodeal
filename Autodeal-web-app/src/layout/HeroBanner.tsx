import { ShieldCheck, FileCheck, IndianRupee, Sparkles, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";

const HeroBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#fdecec_0%,#fff7f2_35%,#faf8f4_60%)] pb-2 pt-4 sm:pb-6 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-maroon-100/80 bg-paper-soft/90 p-5 shadow-sm sm:rounded-[28px] sm:p-8">
          {/* Decorative background glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-maroon-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-amber-100/50 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-maroon-200/70 bg-white px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-maroon-700 shadow-xs">
                <Sparkles size={13} className="text-amber-500" />
                <span>{t("heroHubTag")}</span>
              </div>

              <h1 className="font-display mt-3 text-[26px] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[44px]">
                {t("heroTitle1")} <br className="hidden sm:inline" />
                <span className="text-maroon-700">{t("heroTitle2")}</span>
              </h1>

              <p className="mt-2 max-w-lg text-sm leading-relaxed font-medium text-moss sm:text-base">
                {t("heroSubtitle")}
              </p>
            </div>

            {/* Quick Mobile Action Chips */}
            <div className="flex w-full flex-row gap-2.5 sm:w-auto shrink-0 pt-0.5 md:pt-0">
              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-2xl border border-emerald-500/70 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-emerald-700 shadow-xs transition-all hover:bg-emerald-50 active:scale-95"
              >
                <MessageCircle size={17} className="text-emerald-600 shrink-0" />
                <span>{t("chatWhatsApp")}</span>
              </a>

              <a
                href="tel:+918982883521"
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-2xl bg-maroon-700 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-maroon-800 active:scale-95"
              >
                <Phone size={16} className="shrink-0" />
                <span>{t("callDealer")}</span>
              </a>
            </div>
          </div>

          {/* Key Value Props Bar */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-hairedge/80 pt-4 sm:mt-7 sm:pt-5">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-ink">{t("inspectedBadgeTitle")}</p>
                <p className="hidden text-[11px] text-moss sm:block">{t("inspectedBadgeSub")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileCheck size={17} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-ink">{t("rcBadgeTitle")}</p>
                <p className="hidden text-[11px] text-moss sm:block">{t("rcBadgeSub")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <IndianRupee size={17} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-ink">{t("priceBadgeTitle")}</p>
                <p className="hidden text-[11px] text-moss sm:block">{t("priceBadgeSub")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;