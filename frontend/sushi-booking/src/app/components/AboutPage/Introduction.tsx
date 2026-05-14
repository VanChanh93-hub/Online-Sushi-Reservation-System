"use client";

import { motion, type Variants } from "framer-motion";
import { Heart, Award, Users } from "lucide-react";
import { useTranslation } from "../../lib/i18n/client";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom, ease: "easeOut" },
  }),
};

export default function Introduction() {
  const { t } = useTranslation("introduction");

  const coreValues = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: t("values.fresh.title"),
      description: t("values.fresh.description"),
      delay: 0.4,
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t("values.art.title"),
      description: t("values.art.description"),
      delay: 0.5,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t("values.space.title"),
      description: t("values.space.description"),
      delay: 0.6,
    },
  ];

  return (
    <section className="relative py-[60] px-6 lg:px-20 bg-[#F8F1E9] overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #AF763E 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      <motion.div
        className="container mx-auto max-w-6xl text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide mb-6 pb-2 bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent"
          variants={fadeInUp}
          custom={0}
        >
          {t("title")}
        </motion.h2>

        <motion.p
          className="text-[#AF763E]/90 text-lg sm:text-xl leading-relaxed max-w-5xl mx-auto font-light"
          variants={fadeInUp}
          custom={0.2}
        >
          {t("intro")}
        </motion.p>

        <motion.p
          className="text-[#AF763E]/70 text-base sm:text-lg leading-relaxed max-w-5xl mx-auto mb-12"
          variants={fadeInUp}
          custom={0.3}
        >
          {t("description")}
        </motion.p>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {coreValues.map((item, index) => (
            <motion.div
              key={index}
              className="relative bg-white/80 backdrop-blur-sm shadow-md rounded-2xl p-6 border border-[#AF763E]/10"
              variants={fadeInUp}
              custom={item.delay}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="inline-flex p-3 bg-gradient-to-br from-[#AF763E] to-[#8B5A2B] rounded-xl text-white mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent mb-2">
                {item.title}
              </h3>
              <p className="text-[#AF763E]/80 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
