"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, Bus } from "lucide-react";
import { useTranslation } from "../../lib/i18n/client";

export default function ContactMap() {
  const { t } = useTranslation("contactMap");

  const items = [
    {
      icon: <MapPin className="w-6 h-6 text-[#AF763E]" />,
      title: t("address_title"),
      text: t("address_text"),
    },
    {
      icon: <Clock className="w-6 h-6 text-[#AF763E]" />,
      title: t("hours_title"),
      text: t("hours_text"),
    },
    {
      icon: <Bus className="w-6 h-6 text-[#AF763E]" />,
      title: t("transport_title"),
      text: t("transport_text"),
    },
  ];

  return (
    <section className="bg-[#F8F1E9] py-16 px-6 border-b border-[#AF763E]/20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl overflow-hidden border border-[#AF763E]/30 shadow-sm"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d125402.99854153027!2d106.6795008!3d10.8232704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1747056252176!5m2!1svi!2s"
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="p-2 bg-[#AF763E]/10 rounded-md">{item.icon}</div>
              <div>
                <h4 className="text-[#AF763E] font-semibold text-lg mb-1">
                  {item.title}
                </h4>
                <p className="text-[#444] text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}

          {/* Quote */}
          <div className="mt-6 p-4 bg-white/50 rounded-md border border-[#AF763E]/20 text-[#444] italic text-sm shadow-sm">
            {t("quote")}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
