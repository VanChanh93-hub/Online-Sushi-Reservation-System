"use client";

import { useTranslation } from "../../lib/i18n/client";
import { Award, Heart, Lightbulb, Star } from "lucide-react";

const iconMap = {
  Award: <Award className="w-8 h-8 text-[#AF763E]" />,
  Heart: <Heart className="w-8 h-8 text-[#AF763E]" />,
  Lightbulb: <Lightbulb className="w-8 h-8 text-[#AF763E]" />,
  Star: <Star className="w-5 h-5 text-[#AF763E]" />,
};

export default function CoreValues() {
  const { t } = useTranslation("core");

  const values = [0, 1, 2].map((i) => {
    const value = JSON.parse(t(`values_${i}`));
    return {
      ...value,
      icon: iconMap[value.icon as keyof typeof iconMap],
    };
  });

  const stats = [0, 1, 2].map((i) => {
    const stat = JSON.parse(t(`stats_${i}`));
    return {
      ...stat,
      icon: iconMap[stat.icon as keyof typeof iconMap],
    };
  });

  return (
    <section className="bg-white py-[60px] px-[90px]">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h3 className="text-4xl sm:text-5xl font-bold tracking-wide pb-2 mb-4 bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent">
          {t("heading")}
        </h3>
        <p className="text-[#AF763E]/90 text-xl font-light leading-relaxed max-w-5xl mx-auto">
          {t("subheading")}
        </p>
        <p className="text-[#AF763E]/70 text-lg max-w-3xl mx-auto mt-2">
          {t("note")}
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-[#AF763E]/10 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-[#AF763E]">
                {stat.number}
              </div>
              <div className="text-sm text-[#AF763E]/70">{stat.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {values.map((value, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#AF763E]/10 rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-center mb-4">{value.icon}</div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-[#AF763E] mb-2">
                {value.title}
              </h4>
              <p className="text-[#AF763E]/80 font-medium mb-2">{value.desc}</p>
              <p className="text-[#AF763E]/70 leading-relaxed text-sm mb-4">
                {value.detail}
              </p>
              <div className="inline-block bg-[#AF763E]/10 text-[#AF763E] text-sm px-4 py-1 rounded-full">
                {value.stats} — {value.statsLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-16 text-center">
        <div className="bg-[#AF763E]/5 rounded-2xl p-8 border border-[#AF763E]/10">
          <blockquote className="text-xl italic text-[#AF763E]/80 leading-relaxed mb-4">
            &quot;{t("quote")}&quot;
          </blockquote>
          <cite className="text-sm font-semibold text-[#AF763E] not-italic">
            {t("quote_by")}
          </cite>
        </div>
      </div>
    </section>
  );
}
