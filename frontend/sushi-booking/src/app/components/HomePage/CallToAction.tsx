"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/src/app/lib/i18n/client";

export default function CallToAction() {
  const { t } = useTranslation("callToAction");

  return (
    <section
      id="order"
      className="relative py-20 px-6 sm:px-16 bg-[#F8F1E9] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between relative z-10 gap-16">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <p className="text-sm uppercase tracking-widest text-[#A68345] mb-4">
            {t("label")}
          </p>
          <h2 className="text-4xl sm:text-5xl font-semibold text-[#2D2D2D] leading-snug mb-6">
            {t("heading.before")} <br />
            {t("heading.middle")}{" "}
            <span className="text-[#A68345] font-bold">
              {t("heading.highlight")}
            </span>
          </h2>
          <p className="text-[#4A4A4A] text-lg leading-relaxed mb-10">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/dat-mon"
              className="bg-[#A68345] text-white px-6 py-3 rounded-full text-base font-medium hover:bg-[#8C6D3C] transition-colors"
            >
              🍣 {t("actions.order")}
            </Link>
            <Link
              href="/dat-ban"
              className="border border-[#A68345] text-[#A68345] px-6 py-3 rounded-full text-base font-medium hover:bg-[#A68345] hover:text-white transition-colors"
            >
              📅 {t("actions.reserve")}
            </Link>
          </div>

          <p className="text-sm text-[#888] mt-6">{t("footer")}</p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 flex justify-center"
        >
          <div className="relative w-full aspect-[4/5] h-[500px]">
            <Image
              src="https://www.elledecoration.vn/wp-content/uploads/2024/06/omakase2.jpg"
              alt="Sushi Takumi"
              fill
              className="rounded-3xl object-cover shadow-sm"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
