"use client";

import { motion } from "framer-motion";
import { Clock, Award, Users, Heart } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../../lib/i18n/client";

export default function History() {
  const { t } = useTranslation("history");

  const milestones = [
    {
      year: "1995",
      location: t("milestones.1995.location"),
      title: t("milestones.1995.title"),
      description: t("milestones.1995.description"),
    },
    {
      year: "2015",
      location: t("milestones.2015.location"),
      title: t("milestones.2015.title"),
      description: t("milestones.2015.description"),
    },
    {
      year: "2024",
      location: t("milestones.2024.location"),
      title: t("milestones.2024.title"),
      description: t("milestones.2024.description"),
    },
  ];

  const stats = [
    { icon: Award, num: "15+", label: t("stats.awards") },
    { icon: Users, num: "10K+", label: t("stats.customers") },
    { icon: Heart, num: "4.9★", label: t("stats.rating") },
  ];

  return (
    <section className="bg-white py-[60px] px-6 lg:px-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-20 h-4 bg-gradient-to-r from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-full"
          animate={{ scaleX: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-8 h-8 border-2 border-[#AF763E]/20 rounded-full bg-white/50"
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="absolute inset-2 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-full opacity-40" />
        </motion.div>
      </div>

      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-xl group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/img/history.jpg"
              alt={t("imageAlt")}
              width={600}
              height={500}
              className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div
              className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ y: 20 }}
              whileHover={{ y: 0 }}
            >
              <p className="font-semibold text-base">{t("badge.title")}</p>
              <p className="text-xs opacity-90">{t("badge.subtitle")}</p>
            </motion.div>
            <div className="absolute inset-0 border-4 border-[#AF763E]/30 rounded-3xl group-hover:border-[#AF763E]/60 transition-colors duration-500" />
          </motion.div>

          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] text-white rounded-2xl p-4 shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-xl font-bold">30+</div>
              <div className="text-xs opacity-90">{t("experience")}</div>
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
              <div className="text-xl font-bold text-[#AF763E]">2</div>
              <div className="text-xs text-[#AF763E]/70">{t("countries")}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide">
              <motion.span
                className="bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                {t("title")}
              </motion.span>
            </h3>
            <p className="text-[#AF763E]/80 leading-relaxed text-base sm:text-lg max-w-2xl">
              {t("description")}
            </p>
          </div>

          <div className="space-y-10">
            {milestones.map((item, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 p-4 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-2xl shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                        {item.year}
                      </span>
                      <span className="text-[#AF763E]/60 text-base">—</span>
                      <span className="text-base text-[#AF763E]/80 font-medium">
                        {item.location}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-[#AF763E] group-hover:text-[#8B5A2B] transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-[#AF763E]/70 leading-relaxed group-hover:text-[#AF763E]/90 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 pt-6 border-t border-[#AF763E]/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {stats.map((item, i) => (
              <div key={i} className="text-center group">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-lg">
                    <item.icon className="w-5 h-5 text-[#AF763E]" />
                  </div>
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
                  {item.num}
                </div>
                <div className="text-sm text-[#AF763E]/70">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
