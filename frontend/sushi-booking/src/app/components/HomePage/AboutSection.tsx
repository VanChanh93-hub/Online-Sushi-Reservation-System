"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "../../lib/i18n/client";

export default function AboutSection() {
  const { t } = useTranslation("about");

  return (
    <section className="relative bg-[#F8F1E9] py-20 px-6 sm:px-16 overflow-hidden">
      <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 relative h-[520px] flex justify-center"
        >
          {/* Main Image */}
          <div className="absolute top-2 left-8 w-[320px] h-[420px] rounded-2xl overflow-hidden shadow-xl border-[10px] border-white rotate-[-4deg] z-20 hover:rotate-0 transition duration-500">
            <Image
              src="https://images.unsplash.com/photo-1724115890005-a610449d9ab7?w=1000&auto=format&fit=crop&q=80"
              alt={t("images.main")}
              width={700}
              height={700}
              className="w-full h-full object-cover hover:scale-105 transition duration-700"
              priority
            />
          </div>

          {/* Secondary Image */}
          <div className="absolute bottom-2 right-10 w-[300px] h-[380px] rounded-xl overflow-hidden shadow-lg border-[8px] border-white rotate-[6deg] z-10 hover:rotate-0 hover:scale-105 transition duration-500">
            <Image
              src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1000&auto=format&fit=crop&q=80"
              alt={t("images.secondary")}
              width={700}
              height={700}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Circle Image */}
          <div className="absolute bottom-0 left-6 w-44 h-44 rounded-full overflow-hidden shadow-md border-[5px] border-white z-30 rotate-[-10deg] hover:rotate-0 transition duration-700">
            <Image
              src="https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=60"
              alt={t("images.circle")}
              width={350}
              height={350}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:w-1/2 max-w-xl text-center lg:text-left"
        >
          <p className="text-sm tracking-widest uppercase text-[#A68345] font-semibold mb-4">
            {t("subtitle")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B2F24] leading-snug uppercase mb-6">
            {t("title.line1")}
            <span className="text-[#A68345] block">{t("title.line2")}</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5A483A] mb-8 leading-relaxed">
            {t("description")}
          </p>

          {/* Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            <div className="bg-[#F3D9CB] px-6 py-5 rounded-xl text-[#4B3325] text-sm sm:text-base shadow-sm border border-white/50">
              <p>
                {t("schedule.weekdays.label")}:{" "}
                <strong className="text-[#3B2F24]">
                  {t("schedule.weekdays.time")}
                </strong>
              </p>
              <p>
                {t("schedule.saturday.label")}:{" "}
                <strong className="text-[#3B2F24]">
                  {t("schedule.saturday.time")}
                </strong>
              </p>
            </div>
            <div className="bg-white px-6 py-5 rounded-xl text-[#4B3325] text-sm sm:text-base shadow-sm border border-white/50">
              <p>
                {t("schedule.sunday.label")}:{" "}
                <strong className="text-[#3B2F24]">
                  {t("schedule.sunday.time")}
                </strong>
              </p>
              <p>
                {t("schedule.holidays.label")}:{" "}
                <strong className="text-[#3B2F24]">
                  {t("schedule.holidays.time")}
                </strong>
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-gradient-to-r from-[#8A4A32] to-[#A56748] text-white text-sm sm:text-base px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 font-semibold">
            {t("cta_button")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
