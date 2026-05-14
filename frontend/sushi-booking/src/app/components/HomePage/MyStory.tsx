"use client";

import { CalendarDays, Star, Leaf } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useTranslation } from "../../lib/i18n/client";

export default function MyStory() {
  const ref = useRef(null);
  const { t } = useTranslation("myStory");

  const stats = [
    {
      value: t("stats.experience.value"),
      label: t("stats.experience.label"),
      icon: CalendarDays,
    },
    {
      value: t("stats.branches.value"),
      label: t("stats.branches.label"),
      icon: Star,
    },
    {
      value: t("stats.ingredients.value"),
      label: t("stats.ingredients.label"),
      icon: Leaf,
    },
  ];

  return (
    <section
      ref={ref}
      id="about"
      className="relative overflow-hidden py-15 px-6 sm:px-10 md:px-16 xl:px-20 bg-[#F8F1E9] flex items-center"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          {/* Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A68345]/10 text-[#A68345] text-sm font-semibold mb-6">
              <div className="w-2 h-2 bg-[#A68345] rounded-full" />
              {t("badge")}
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-[#2D2D2D] mb-6">
              {t("title.line1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A68345] via-[#BD944A] to-[#D4B04F]">
                {t("title.highlight")}
              </span>
            </h2>

            <p className="text-[#555] text-lg leading-relaxed mb-4">
              {t("description.1")}
            </p>
            <p className="text-[#555] text-lg leading-relaxed mb-8">
              {t("description.2")}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 rounded-xl p-5 border border-[#A68345]/10"
                >
                  <div className="flex justify-center mb-3">
                    <item.icon className="text-[#A68345]" size={24} />
                  </div>
                  <div className="text-xl font-bold text-[#2D2D2D]">
                    {item.value}
                  </div>
                  <div className="text-sm text-[#666]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="overflow-hidden rounded-3xl shadow-md">
              <Image
                src="https://res.klook.com/image/upload/c_fill,w_750,h_750/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/bdjcugfgoqmozfswf4kd.jpg"
                alt={t("image_alt")}
                className="w-full h-auto object-cover"
                width={750}
                height={750}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
