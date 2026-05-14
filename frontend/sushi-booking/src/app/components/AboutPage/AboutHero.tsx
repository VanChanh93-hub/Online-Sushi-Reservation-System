"use client";

import { motion, type Variants } from "framer-motion";
import { Salsa } from "next/font/google";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../../lib/i18n/client";

const salsa = Salsa({ subsets: ["latin"], weight: "400" });

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom,
      ease: "easeOut",
    },
  }),
};

export default function AboutHero() {
  const { t } = useTranslation("aboutHero");

  const stats = [
    { label: t("stats.experience"), value: "15+" },
    { label: t("stats.rating"), value: "4.9★" },
    { label: t("stats.special_dishes"), value: "100+" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#fceedb] via-[#d0c3b5] to-[#d5bfa5] py-16 px-6 lg:px-20 flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #AF763E 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #8B5A2B 1.5px, transparent 1.5px),
            radial-gradient(circle at 50% 10%, #D97706 2px, transparent 2px)
          `,
          backgroundSize: "100px 100px, 80px 80px, 120px 120px",
          backgroundPosition: "0 0, 40px 40px, 20px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h1
            className="text-[48px] sm:text-[64px] lg:text-[72px] font-bold tracking-wide leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B]"
            style={{ fontFamily: salsa.style.fontFamily }}
            variants={fadeInUp}
            custom={0}
          >
            {t("title.line1")}
            <br />
            {t("title.line2")}
          </motion.h1>

          <motion.p
            className="text-xl text-[#AF763E]/90 font-light"
            variants={fadeInUp}
            custom={0.2}
          >
            {t("subtitle")}
          </motion.p>

          <motion.p
            className="text-base text-[#AF763E]/70 max-w-md"
            variants={fadeInUp}
            custom={0.4}
          >
            {t("description")}
          </motion.p>

          <motion.div
            className="flex gap-4 pt-2"
            variants={fadeInUp}
            custom={0.6}
          >
            <Link href="/menu">
              <button className="px-6 py-3 bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] text-white rounded-xl font-medium flex items-center gap-2 hover:brightness-105 transition">
                {t("buttons.menu")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-6 py-3 border border-[#AF763E]/50 text-[#AF763E] rounded-xl font-medium hover:bg-[#fceedb] transition">
                {t("buttons.reserve")}
              </button>
            </Link>
          </motion.div>

          <motion.div
            className="flex gap-6 pt-6"
            variants={fadeInUp}
            custom={0.8}
          >
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[100px] px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-[#AF763E]/20 text-center shadow"
              >
                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#AF763E] to-[#8B5A2B]">
                  {item.value}
                </div>
                <div className="text-xs text-[#AF763E]/70">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Image Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 h-[500px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[0, 0.2, 0.4].map((delay, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-2xl shadow-lg ${
                index === 0 ? "row-span-2" : ""
              }`}
              variants={fadeInUp}
              custom={delay}
            >
              <Image
                src={
                  index === 0
                    ? "https://sushiworld.com.vn/wp-content/uploads/2025/03/z6395411743857_e52ea2f676293290be4c6493f37b421b.jpg"
                    : index === 1
                    ? "https://sushiworld.com.vn/wp-content/uploads/2025/03/z6395411743855_50d51c359086dd8a148ec385e1461954.jpg"
                    : "https://sushiworld.com.vn/wp-content/uploads/2025/03/z6395411743851_27e135da72d1d52699411ef26996af26.jpg"
                }
                alt="Sushi Image"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 rounded-2xl"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
