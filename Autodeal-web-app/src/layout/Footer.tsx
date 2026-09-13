import {
  ShieldCheck,
  BadgeCheck,
  IndianRupee,
  Clock3,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const WhyUs = () => {
  const { language, t } = useLanguage();

  const features = [
    {
      icon: <ShieldCheck size={26} />,
      title: language === "hi" ? "100% जांची गई बाइक्स" : "100% Verified Vehicles",
      description: language === "hi" ? "हर बाइक को सूचीबद्ध करने से पहले पूरी जांच की जाती है।" : "Every motorcycle undergoes inspection before being listed.",
    },
    {
      icon: <BadgeCheck size={26} />,
      title: language === "hi" ? "विश्वसनीय डीलरशिप" : "Trusted Dealership",
      description: language === "hi" ? "सैकड़ों संतुष्ट ग्राहकों को पारदर्शी मूल्य के साथ सेवा।" : "Serving hundreds of satisfied customers with transparent pricing.",
    },
    {
      icon: <IndianRupee size={26} />,
      title: language === "hi" ? "सर्वोत्तम बाजार मूल्य" : "Best Market Price",
      description: language === "hi" ? "उचित दाम और आसान फाइनेंस सुविधा उपलब्ध।" : "Competitive pricing with financing assistance available.",
    },
    {
      icon: <Clock3 size={26} />,
      title: language === "hi" ? "त्वरित कागजी कार्यवाही" : "Quick Documentation",
      description: language === "hi" ? "फास्ट आरसी ट्रांसफर और परेशानी मुक्त स्वामित्व प्रक्रिया।" : "Fast RC transfer and hassle-free ownership process.",
    },
  ];

  return (
    <section id="why-us" className="mx-auto max-w-7xl px-3.5 py-10 sm:px-6 sm:py-16">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* WHY US */}
        <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-sm border border-slate-200/80">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[var(--maroon)]">
            {t("whyChooseUs")}
          </span>

          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
            {t("buyWithConfidence")}
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {t("whyUsDesc")}
          </p>

          <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 transition hover:shadow-xs"
              >
                <div className="mb-3 inline-flex rounded-xl bg-red-50 p-2.5 text-[var(--maroon)]">
                  {item.icon}
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-500 font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Inquiry */}
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-50/60 to-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-50 p-2.5 text-[var(--maroon)]">
                <Mail size={20} />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--ink)]">
                  {t("haveInquiry")}
                </h3>

                <p className="text-xs text-slate-500 font-medium">
                  {t("inquirySub")}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2.5">
              <a
                href="mailto:contact@shreeganeshautodeal.com"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all hover:border-[var(--maroon)] hover:shadow-xs"
              >
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">{t("emailUs")}</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    contact@shreeganeshautodeal.com
                  </p>
                </div>
                <Mail className="text-[var(--maroon)] shrink-0" size={18} />
              </a>

              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/30 px-4 py-3 transition-all hover:border-emerald-500 hover:shadow-xs"
              >
                <div>
                  <p className="text-[11px] text-emerald-700 font-medium">{t("instantSupport")}</p>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-900">
                    WhatsApp (+91 8982883521)
                  </p>
                </div>
                <MessageCircle className="text-emerald-600 shrink-0" size={18} />
              </a>

              <a
                href="tel:+918982883521"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all hover:border-blue-500 hover:shadow-xs"
              >
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">{t("preferTalking")}</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    +91 8982883521
                  </p>
                </div>
                <Phone className="text-blue-600 shrink-0" size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* CONTACT SHOWROOM */}
        <div
          id="contact"
          className="flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--maroon)] to-[var(--maroon-dark)] p-5 sm:p-8 text-white shadow-lg"
        >
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-200">
              {t("visitShowroom")}
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">{t("visitUsIndore")}</h2>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-red-100">
              {t("showroomDesc")}
            </p>

            <div className="mt-6 space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-red-200" size={18} />
                <div>
                  <h3 className="font-bold text-white">{t("showroomAddress")}</h3>
                  <p className="text-red-100 font-medium">
                    {t("showroomAddressVal")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 shrink-0 text-red-200" size={18} />
                <div>
                  <h3 className="font-bold text-white">{t("directPhone")}</h3>
                  <a href="tel:+918982883521" className="text-red-100 hover:text-white font-medium">
                    +91 8982883521
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 shrink-0 text-red-200" size={18} />
                <div>
                  <h3 className="font-bold text-white">{t("emailAddress")}</h3>
                  <p className="text-red-100 font-medium">contact@shreeganeshautodeal.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Embed Container */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xs shadow-md">
            <div className="border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <MapPin size={14} className="text-red-200" />
                <span>{t("mapTitle")}</span>
              </div>
              <span className="text-[10px] text-red-200 font-medium">{t("openDays")}</span>
            </div>

            <iframe
              title="Shree Ganesh Autodeal Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d909.727039228699!2d75.86124467744685!3d22.6965886390598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd561b024195%3A0xb742d7c1af0fe8bc!2sShree%20Ganesh%20AutoDeal!5e1!3m2!1sen!2sin!4v1784008031385!5m2!1sen!2sin"
              className="h-[200px] w-full sm:h-[260px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="tel:+918982883521"
              className="flex-1 sm:flex-none text-center rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[var(--maroon)] shadow-sm transition hover:bg-red-50 active:scale-95"
            >
              {t("callNow")}
            </a>

            <a
              href="https://wa.me/918982883521"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-white/80 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-white/10 active:scale-95"
            >
              <MessageCircle size={16} />
              <span>{t("whatsApp")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
