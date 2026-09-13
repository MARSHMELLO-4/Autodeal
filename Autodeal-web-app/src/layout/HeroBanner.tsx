import { ShieldCheck, FileCheck, IndianRupee, Sparkles, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const HeroBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50/40 via-white to-transparent pb-4 pt-4 sm:pb-8 sm:pt-6">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6">
        {/* Main Hero Card */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-red-100/80 bg-gradient-to-br from-white via-red-50/20 to-amber-50/20 p-4 sm:p-8 shadow-sm">
          {/* Subtle Decorative Background Glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-100/40 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200/70 bg-white/90 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--maroon)] shadow-xs">
                <Sparkles size={12} className="text-amber-500" />
                <span>{t("heroHubTag")}</span>
              </div>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl leading-[1.15]">
                {t("heroTitle1")} <br className="hidden sm:inline" />
                <span className="text-[var(--maroon)]">{t("heroTitle2")}</span>
              </h1>

              <p className="mt-2 text-xs sm:text-base text-slate-600 leading-relaxed font-medium">
                {t("heroSubtitle")}
              </p>
            </div>

            {/* Quick Mobile Action Chips */}
            <div className="flex w-full flex-row gap-2 sm:w-auto sm:flex-col shrink-0 pt-1 md:pt-0">
              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-emerald-500/80 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-700 shadow-xs transition-all hover:bg-emerald-50 active:scale-95"
              >
                <MessageCircle size={16} className="text-emerald-600 shrink-0" />
                <span>{t("chatWhatsApp")}</span>
              </a>

              <a
                href="tel:+918982883521"
                className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-[var(--maroon)] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-[var(--maroon-dark)] active:scale-95"
              >
                <Phone size={15} className="shrink-0" />
                <span>{t("callDealer")}</span>
              </a>
            </div>
          </div>

          {/* Key Value Props Bar */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100/90 pt-3 sm:mt-6 sm:pt-5 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-800">{t("inspectedBadgeTitle")}</p>
                <p className="hidden text-[10px] text-slate-500 sm:block">{t("inspectedBadgeSub")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileCheck size={16} />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-800">{t("rcBadgeTitle")}</p>
                <p className="hidden text-[10px] text-slate-500 sm:block">{t("rcBadgeSub")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <IndianRupee size={15} />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-800">{t("priceBadgeTitle")}</p>
                <p className="hidden text-[10px] text-slate-500 sm:block">{t("priceBadgeSub")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
