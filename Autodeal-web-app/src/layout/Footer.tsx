import {
  ShieldCheck,
  BadgeCheck,
  IndianRupee,
  Clock3,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { useReveal } from "../hooks/useReveal";

const WhyUs = () => {
  const { language, t } = useLanguage();
  const revealRef = useReveal<HTMLDivElement>();

  const delay = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);

  const features = [
    {
      icon: <ShieldCheck size={24} />,
      title: language === "hi" ? "100% जांची गई बाइक्स" : "100% Verified Vehicles",
      description: language === "hi" ? "हर बाइक को सूचीबद्ध करने से पहले पूरी जांच की जाती है।" : "Every motorcycle undergoes inspection before being listed.",
    },
    {
      icon: <BadgeCheck size={24} />,
      title: language === "hi" ? "विश्वसनीय डीलरशिप" : "Trusted Dealership",
      description: language === "hi" ? "सैकड़ों संतुष्ट ग्राहकों को पारदर्शी मूल्य के साथ सेवा।" : "Serving hundreds of satisfied customers with transparent pricing.",
    },
    {
      icon: <IndianRupee size={24} />,
      title: language === "hi" ? "सर्वोत्तम बाजार मूल्य" : "Best Market Price",
      description: language === "hi" ? "उचित दाम और आसान फाइनेंस सुविधा उपलब्ध।" : "Competitive pricing with financing assistance available.",
    },
    {
      icon: <Clock3 size={24} />,
      title: language === "hi" ? "त्वरित कागजी कार्यवाही" : "Quick Documentation",
      description: language === "hi" ? "फास्ट आरसी ट्रांसफर और परेशानी मुक्त स्वामित्व प्रक्रिया।" : "Fast RC transfer and hassle-free ownership process.",
    },
  ];

  return (
    <section
      id="why-us"
      ref={revealRef}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* WHY US */}
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-hairedge sm:p-8">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-maroon-700">
            {t("whyChooseUs")}
          </span>

          <h2 className="font-display mt-2 text-2xl sm:text-3xl font-extrabold text-ink">
            {t("buyWithConfidence")}
          </h2>

          <p className="mt-2.5 text-sm text-moss leading-relaxed font-medium">
            {t("whyUsDesc")}
          </p>

          <div className="mt-6 sm:mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((item) => (
              <div
                key={item.title}
                className="lift group rounded-2xl bg-paper p-4 border border-hairedge/80 hover:border-maroon-200 hover:bg-white hover:shadow-md"
              >
                <div className="mb-3 inline-flex rounded-xl bg-maroon-50 p-2.5 text-maroon-600 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  {item.icon}
                </div>

                <h3 className="font-display font-bold text-sm text-ink">{item.title}</h3>

                <p className="mt-1 text-xs leading-relaxed text-moss font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Inquiry */}
          <div className="mt-6 rounded-3xl border border-hairedge/80 bg-gradient-to-br from-paper to-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-maroon-50 p-3 text-maroon-600">
                <Mail size={20} />
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  {t("haveInquiry")}
                </h3>

                <p className="text-xs text-moss font-medium">
                  {t("inquirySub")}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2.5">
              <a
                href="mailto:contact@shreeganeshautodeal.com"
                className="btn-spring flex items-center justify-between rounded-2xl border border-hairedge bg-white px-4 py-3 hover:border-maroon-200 hover:shadow-md cursor-pointer"
              >
                <div>
                  <p className="text-[11px] text-moss font-medium">{t("emailUs")}</p>
                  <p className="text-sm font-semibold text-ink">
                    contact@shreeganeshautodeal.com
                  </p>
                </div>
                <ArrowUpRight className="text-maroon-600 shrink-0" size={18} />
              </a>

              <a
                href="https://wa.me/918982883521"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-spring flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/40 px-4 py-3 hover:border-emerald-400 hover:shadow-md cursor-pointer"
              >
                <div>
                  <p className="text-[11px] text-emerald-700 font-medium">{t("instantSupport")}</p>
                  <p className="text-sm font-semibold text-emerald-900">
                    WhatsApp (+91 8982883521)
                  </p>
                </div>
                <MessageCircle className="text-emerald-600 shrink-0" size={18} />
              </a>

              <a
                href="tel:+918982883521"
                className="btn-spring flex items-center justify-between rounded-2xl border border-hairedge bg-white px-4 py-3 hover:border-maroon-200 hover:shadow-md cursor-pointer"
              >
                <div>
                  <p className="text-[11px] text-moss font-medium">{t("preferTalking")}</p>
                  <p className="text-sm font-semibold text-ink">
                    +91 8982883521
                  </p>
                </div>
                <Phone className="text-maroon-600 shrink-0" size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* CONTACT SHOWROOM */}
        <div
          id="contact"
          className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-maroon-800 to-maroon-900 p-5 sm:p-8 text-white shadow-lg"
          style={delay(120)}
        >
          {/* Ambient animated glows */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-maroon-400/20 blur-3xl animate-floaty2" />
            <div className="absolute right-10 top-1/3 h-24 w-24 rounded-full bg-amber-300/10 blur-2xl animate-floaty" />
          </div>

          <div className="relative">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-200">
              {t("visitShowroom")}
            </span>

            <h2 className="font-display mt-2 text-2xl sm:text-3xl font-extrabold">
              {t("visitUsIndore")}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-red-100">
              {t("showroomDesc")}
            </p>

            <div className="relative mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3 lift rounded-2xl p-2 -m-2 hover:bg-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs">
                  <MapPin className="text-red-100" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{t("showroomAddress")}</h3>
                  <p className="text-red-100 font-medium">
                    {t("showroomAddressVal")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 lift rounded-2xl p-2 -m-2 hover:bg-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs">
                  <Phone className="text-red-100" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{t("directPhone")}</h3>
                  <a href="tel:+918982883521" className="text-red-100 hover:text-white font-medium">
                    +91 8982883521
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 lift rounded-2xl p-2 -m-2 hover:bg-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs">
                  <Mail className="text-red-100" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{t("emailAddress")}</h3>
                  <p className="text-red-100 font-medium">contact@shreeganeshautodeal.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Embed Container */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xs shadow-md ring-1 ring-white/10">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <MapPin size={14} className="text-red-100" />
                <span>{t("mapTitle")}</span>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-red-100">
                {t("openDays")}
              </span>
            </div>

            <iframe
              title="Shree Ganesh Autodeal Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d909.727039228699!2d75.86124467744685!3d22.6965886390598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd561b024195%3A0xb742d7c1af0fe8bc!2sShree%20Ganesh%20AutoDeal!5e1!3m2!1sen!2sin!4v1784008031385!5m2!1sen!2sin"
              className="h-44 w-full sm:h-56"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="tel:+918982883521"
              className="btn-spring flex-1 text-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-maroon-800 shadow-md hover:bg-red-50 cursor-pointer"
            >
              {t("callNow")}
            </a>

            <a
              href="https://wa.me/918982883521"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spring flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-white/80 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 cursor-pointer"
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