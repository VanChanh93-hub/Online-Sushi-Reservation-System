"use client";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ChevronRight } from "lucide-react";
import { useTranslation } from "../../lib/i18n/client";

export default function ContactInfo() {
  const { t } = useTranslation("contactInfo"); // namespace: contact

  const contacts = [
    {
      title: t("addressTitle"),
      icon: <MapPin className="w-6 h-6 text-[#AF763E]" />,
      content: t("addressContent"),
    },
    {
      title: t("hotlineTitle"),
      icon: <Phone className="w-6 h-6 text-[#AF763E]" />,
      content: t("hotlineContent"),
    },
    {
      title: t("emailTitle"),
      icon: <Mail className="w-6 h-6 text-[#AF763E]" />,
      content: t("emailContent"),
    },
  ];

  return (
    <section className="bg-[#FAF7F2] py-20 px-4">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 text-[#AF763E] mb-2">
          <MapPin className="w-5 h-5" />
          <span className="uppercase text-sm tracking-wide font-semibold">
            {t("sectionLabel")}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#4B3B2A]">
          {t("heading")}
        </h2>
        <p className="text-[#6D5F50] mt-3 max-w-xl mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {contacts.map((contact, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-white border border-[#E7DDD1] rounded-xl p-6 shadow-sm flex flex-col items-start text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              {contact.icon}
              <h4 className="text-lg font-semibold text-[#AF763E]">
                {contact.title}
              </h4>
            </div>
            <p className="text-[#5B4A3B] mb-6">{contact.content}</p>
            <button className="mt-auto inline-flex items-center gap-2 px-4 py-2 bg-[#AF763E] text-white rounded-full text-sm hover:shadow-md transition">
              {t("contactNow")} <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-16 text-center">
        <blockquote className="text-lg italic text-[#AF763E]/80 leading-relaxed mb-4">
          &quot;{t("quote")}&quot;
        </blockquote>
        <cite className="text-sm font-semibold text-[#AF763E] not-italic">
          — {t("quoteAuthor")}
        </cite>
      </div>
    </section>
  );
}
