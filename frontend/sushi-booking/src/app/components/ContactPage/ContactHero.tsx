"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "../../lib/i18n/client";

export default function ContactHero() {
  const { t } = useTranslation("contactHero");
  const MotionLink = motion(Link);

  return (
    <section className="relative bg-[url('/img/contact.jpg')] bg-cover bg-center min-h-[60vh] flex items-center justify-center text-center px-6">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm bg-[#AF763E]/20 text-white border border-[#AF763E]/40"
        >
          <span className="w-2 h-2 bg-[#AF763E] rounded-full animate-pulse"></span>
          {t("label")}
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {t("title")} <span className="text-[#FFD23F]">Sushi Takumi</span>
        </motion.h1>

        <motion.p
          className="text-white/90 max-w-xl mx-auto text-base md:text-lg drop-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MotionLink
            href="/dat-ban"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 text-white bg-[#AF763E] rounded-full font-semibold shadow hover:bg-[#8B5A2B] transition"
          >
            {t("button")}
          </MotionLink>
        </motion.div>

        <motion.div
          className="flex justify-center gap-6 text-white font-medium text-sm drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">📞</span>
            <span className="text-white">{t("phone")}</span>
          </div>
          <div className="w-1 h-1 bg-[#FFD23F] rounded-full"></div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span className="text-white">{t("address")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
