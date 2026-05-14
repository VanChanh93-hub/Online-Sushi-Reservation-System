"use client";

import {
  ChefHat,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  Mouse,
} from "lucide-react";
import { useTranslation } from "../../lib/i18n/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const floatingElements = [
  { emoji: "🍣", x: "10%", y: "20%" },
  { emoji: "🍱", x: "85%", y: "15%" },
  { emoji: "🥢", x: "20%", y: "80%" },
  { emoji: "🍜", x: "80%", y: "75%" },
];

export default function HomePage() {
  const { t, lang } = useTranslation("home");
  const pathname = usePathname();

  const stats = [
    {
      Icon: ChefHat,
      label: t("stats.experience.value"),
      desc: t("stats.experience.label"),
    },
    {
      Icon: Star,
      label: t("stats.rating.value"),
      desc: t("stats.rating.label"),
    },
    {
      Icon: Clock,
      label: t("stats.serving_time.value"),
      desc: t("stats.serving_time.label"),
    },
  ];

  const getLocalizedPath = (path: string) => {
    return `/${lang}${path}`;
  };

  return (
    <div className="overflow-x-hidden relative">
      {/* Floating Emojis */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className="absolute text-2xl opacity-10"
            style={{ left: element.x, top: element.y }}
          >
            {element.emoji}
          </div>
        ))}
      </div>

      <section className="relative bg-gradient-to-br from-[#FAF4EC] via-[#F8F1E9] to-[#F5EDE3] py-20 px-6 sm:px-12 lg:px-20 flex items-center">
        {/* Gradient Decor Circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#A68345]/10 to-[#BD944A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-[#BD944A]/10 to-[#A68345]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12 relative z-10">
          {/* Text Content */}
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F7F1E5] to-[#F4E7D2] border border-[#A68345]/30 rounded-full px-5 py-2 mb-6 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="text-[#A68345]" size={18} />
              <span className="text-[#A68345] text-sm font-medium">
                {t("badge")}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight text-[#2E2E2E]">
                <span className="block mb-1">{t("title.japanese")}</span>
                <span className="block text-transparent bg-gradient-to-r from-[#A68345] via-[#BD944A] to-[#A68345] bg-clip-text">
                  {t("title.english")}
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-[#555] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t("description")}
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex justify-center lg:justify-start gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {stats.map(({ Icon, label, desc }) => (
                <div key={label} className="text-center cursor-pointer">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#F4E7D2] to-[#F7F1E5] rounded-xl mb-2 mx-auto shadow-md">
                    <Icon className="text-[#A68345]" size={20} />
                  </div>
                  <div className="text-[#2E2E2E] font-semibold text-sm sm:text-base">
                    {label}
                  </div>
                  <div className="text-[#666] text-xs sm:text-sm">{desc}</div>
                </div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a
                href={getLocalizedPath("/menu")}
                className="group relative bg-gradient-to-r from-[#A68345] to-[#BD944A] text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative flex items-center justify-center gap-2">
                  <span>{t("buttons.menu")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </a>
              <a
                href={getLocalizedPath("/datban")}
                className="group border-2 border-[#A68345] text-[#A68345] hover:bg-[#A68345] hover:text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden"
              >
                <div className="relative flex items-center justify-center gap-2">
                  <span>{t("buttons.reservation")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* Image Block */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-[#F4E7D2] group">
              <img
                src="https://i.pinimg.com/736x/ec/75/1f/ec751f453b9bd675a91ef0faaa8890fd.jpg"
                alt={t("image_alt")}
                className="object-cover w-full h-[400px] lg:h-[480px] transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-[#A68345] shadow-lg">
                {t("image_badge")}
              </div>
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#A68345]/20 to-transparent rounded-br-full" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#BD944A]/20 to-transparent rounded-tl-full" />
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-[#A68345] opacity-70">
          <Mouse className="w-6 h-6" />
        </div>
      </section>
    </div>
  );
}
