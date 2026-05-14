"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/app/lib/i18n/client";

export default function FavoriteSushiSection() {
  const { t } = useTranslation("favourite");

  const sushiKeys = ["item1", "item2", "item3", "item4", "item5", "item6"];
  const sushiList = sushiKeys
    .map((key) => ({
      src: t(`list.${key}.src`),
      title: t(`list.${key}.title`),
    }))
    .filter((item) => item.src && item.src.trim() !== "");

  return (
    <section className="bg-white py-20 px-6 sm:px-10 md:px-16">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#432D1F]" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wider text-[#432D1F] uppercase">
              {t("title")}
            </h2>
            <div className="h-px w-16 bg-[#432D1F]" />
          </div>
          <p className="text-[#666] mt-2 text-sm sm:text-base">
            {t("description")}
          </p>
        </motion.div>

        {/* Sushi Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
          {sushiList.map((sushi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={sushi.src}
                  alt={sushi.title}
                  fill
                  className="object-cover"
                />
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] px-5 py-2 bg-black/50 text-white text-sm font-medium text-center rounded-full shadow-lg backdrop-blur-md hover:shadow-xl transition-all">
                  {sushi.title}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0.5, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-[#AF763E] text-white rounded-3xl px-6 py-14 overflow-hidden flex flex-col items-center text-center max-w-4xl mx-auto shadow-lg"
        >
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="https://plus.unsplash.com/premium_photo-1668146932065-d08643791942?w=600&auto=format&fit=crop&q=60"
              alt="Background texture"
              fill
              className="object-cover"
            />
          </div>

          <div className="z-10 max-w-xl relative pb-32 sm:pb-0">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-snug">
              {t("cta.title")}
            </h3>
            <p className="text-base mb-6 max-w-md">{t("cta.description")}</p>
            <button className="bg-white text-[#AF763E] font-semibold px-6 py-3 rounded-full hover:bg-orange-100 transition">
              🍱 {t("cta.button")}
            </button>
          </div>

          {/* Decorative Circles */}
          <div className="absolute -left-6 -bottom-6 w-32 h-32 sm:w-60 sm:h-60 sm:-left-10 sm:-bottom-12 rounded-full border-[8px] border-[#FFECEC] overflow-hidden z-0">
            <Image
              src="https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&auto=format&fit=crop&q=60"
              alt="Decorative left"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 sm:w-60 sm:h-60 sm:-right-10 sm:-bottom-12 rounded-full border-[8px] border-[#FFECEC] overflow-hidden z-0">
            <Image
              src="https://plus.unsplash.com/premium_photo-1675453377179-22d446fe10ad?w=600&auto=format&fit=crop&q=60"
              alt="Decorative right"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
