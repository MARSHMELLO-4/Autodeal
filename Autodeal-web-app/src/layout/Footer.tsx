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

const features = [
  {
    icon: <ShieldCheck size={26} />,
    title: "100% Verified Vehicles",
    description: "Every motorcycle undergoes inspection before being listed.",
  },
  {
    icon: <BadgeCheck size={26} />,
    title: "Trusted Dealership",
    description:
      "Serving hundreds of satisfied customers with transparent pricing.",
  },
  {
    icon: <IndianRupee size={26} />,
    title: "Best Market Price",
    description: "Competitive pricing with financing assistance available.",
  },
  {
    icon: <Clock3 size={26} />,
    title: "Quick Documentation",
    description: "Fast RC transfer and hassle-free ownership process.",
  },
];

const WhyUs = () => {
  return (
    <section id="why-us" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* WHY US */}

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--maroon)]">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-4xl font-black text-[var(--ink)]">
            Buy With Confidence
          </h2>

          <p className="mt-4 text-[var(--moss)] leading-8">
            We believe buying a pre-owned motorcycle should be simple,
            transparent and trustworthy. Every bike is inspected before reaching
            our showroom.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-slate-50 p-5 transition hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[var(--maroon)]/10 p-3 text-[var(--maroon)]">
                  {item.icon}
                </div>

                <h3 className="font-bold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-[var(--moss)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          {/* Quick Inquiry */}

<div className="mt-10 rounded-3xl border border-[var(--border)] bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm">

  <div className="flex items-center gap-3">

    <div className="rounded-2xl bg-[var(--maroon)]/10 p-3 text-[var(--maroon)]">
      <Mail size={22} />
    </div>

    <div>
      <h3 className="text-xl font-bold text-[var(--ink)]">
        Have an Inquiry?
      </h3>

      <p className="text-sm text-[var(--moss)]">
        We'd be happy to answer your questions.
      </p>
    </div>

  </div>

  <div className="mt-6 grid gap-4">

    <a
      href="mailto:contact@shreeganeshautodeal.com"
      className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition-all duration-300 hover:border-[var(--maroon)] hover:shadow-md"
    >
      <div>

        <p className="text-sm text-[var(--moss)]">
          Email Us
        </p>

        <p className="font-semibold text-[var(--ink)]">
          contact@shreeganeshautodeal.com
        </p>

      </div>

      <Mail className="text-[var(--maroon)]" />
    </a>

    <a
      href="https://wa.me/919999999999"
      className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition-all duration-300 hover:border-green-500 hover:shadow-md"
    >
      <div>

        <p className="text-sm text-[var(--moss)]">
          Instant Support
        </p>

        <p className="font-semibold text-[var(--ink)]">
          WhatsApp Inquiry
        </p>

      </div>

      <MessageCircle className="text-green-600" />
    </a>

    <a
      href="tel:+919999999999"
      className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition-all duration-300 hover:border-blue-500 hover:shadow-md"
    >
      <div>

        <p className="text-sm text-[var(--moss)]">
          Prefer talking?
        </p>

        <p className="font-semibold text-[var(--ink)]">
          +91 99999 99999
        </p>

      </div>

      <Phone className="text-blue-600" />
    </a>

  </div>

</div>
        </div>
        

        {/* CONTACT */}

        <div
          id="contact"
          className="rounded-3xl bg-gradient-to-br from-[var(--maroon)] to-[var(--maroon-dark)] p-8 text-white shadow-xl"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            Contact Us
          </span>

          <h2 className="mt-3 text-4xl font-black">Visit Our Showroom</h2>

          <p className="mt-4 leading-8 text-white/80">
            We'd love to help you find your next motorcycle. Contact us or visit
            our showroom for a test ride.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1" />
              <div>
                <h3 className="font-semibold">Address</h3>

                <p className="text-white/80">
                  Shree Ganesh Autodeal
                  <br />
                  Indore, Madhya Pradesh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-1" />
              <div>
                <h3 className="font-semibold">Phone</h3>

                <a
                  href="tel:+919999999999"
                  className="text-white/80 hover:text-white"
                >
                  +91 99999 99999
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="mt-1" />
              <div>
                <h3 className="font-semibold">Email</h3>

                <p className="text-white/80">contact@shreeganeshautodeal.com</p>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
            <div className="border-b border-white/10 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                📍 Visit Our Showroom
              </h3>
              <p className="mt-1 text-sm text-white/70">
                Tap the map to get directions.
              </p>
            </div>

            <iframe
              title="Shree Ganesh Autodeal Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d909.727039228699!2d75.86124467744685!3d22.6965886390598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd561b024195%3A0xb742d7c1af0fe8bc!2sShree%20Ganesh%20AutoDeal!5e1!3m2!1sen!2sin!4v1784008031385!5m2!1sen!2sin"
              className="h-[280px] w-full md:h-[350px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="tel:+919999999999"
              className="rounded-full bg-white px-6 py-3 font-semibold text-[var(--maroon)] transition hover:scale-105"
            >
              Call Now
            </a>

            <a
              href="https://wa.me/919999999999"
              className="flex items-center gap-2 rounded-full border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-[var(--maroon)]"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
