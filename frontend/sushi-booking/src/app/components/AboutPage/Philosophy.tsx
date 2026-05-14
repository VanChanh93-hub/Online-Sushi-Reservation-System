"use client";

import { motion } from "framer-motion";
import { Diamond, Palette, Smile, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../../lib/i18n/client";

export default function Philosophy() {
  const { t } = useTranslation("philosophy");

  const principles = [
    {
      icon: Diamond,
      title: t("principles.quality.title"),
      desc: t("principles.quality.desc"),
    },
    {
      icon: Palette,
      title: t("principles.aesthetics.title"),
      desc: t("principles.aesthetics.desc"),
    },
    {
      icon: Smile,
      title: t("principles.customer.title"),
      desc: t("principles.customer.desc"),
    },
  ];

  return (
    <section className="py-[60px] px-6 lg:px-28 bg-gradient-to-br from-[#FFFAF3] via-[#FFF8F0] to-[#FFFAF3] relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-16 left-16 w-16 h-4 bg-gradient-to-r from-[#AF763E]/15 to-[#8B5A2B]/15 rounded-full"
          animate={{ scaleX: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-10 h-10 border-2 border-[#AF763E]/20 rounded-full bg-[#FFFAF3]/50"
          animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <div className="absolute inset-2.5 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full opacity-50" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Text Content */}
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <h3 className="text-4xl lg:text-5xl font-bold">
              <span className="pb-2 bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent inline-block animate-gradient">
                {t("title")}
              </span>
            </h3>
            <p className="text-[#AF763E]/90 text-lg leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="space-y-6">
            {principles.map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-[#AF763E]/10 shadow-lg group hover:shadow-xl transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * i }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-xl text-white">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                      {item.title}
                    </h4>
                    <p className="text-[#AF763E]/80 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            className="bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 rounded-xl p-6 border-l-4 border-[#AF763E] text-[#AF763E]/80 italic"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            “{t("quote.text")}”
            <cite className="block mt-2 text-sm font-semibold text-[#AF763E] not-italic">
              — {t("quote.author")}
            </cite>
          </motion.blockquote>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/img/sushi-hokkaido-sachi.jpg"
              alt={t("imageAlt")}
              width={500}
              height={600}
              className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-lg font-semibold">{t("image.caption")}</p>
              <p className="text-sm opacity-90">{t("image.subcaption")}</p>
            </div>
            <div className="absolute inset-0 border-4 border-[#AF763E]/30 rounded-3xl group-hover:border-[#AF763E]/60 transition" />
          </motion.div>

          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] text-white rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs font-semibold">Premium</div>
              <div className="text-xs opacity-90">Quality</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4 bg-white border-4 border-[#AF763E]/20 rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-[#AF763E]">30+</div>
              <div className="text-xs text-[#AF763E]/70">
                {t("yearsExperience")}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
