"use client";

import { useState } from "react";
import {
  Award,
  Star,
  Sparkles,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../../lib/i18n/client";

export default function ChefTeam() {
  const { t } = useTranslation("chefs");
  const [selectedChef, setSelectedChef] = useState<number | null>(null);

  const chefs = [0, 1, 2].map((i) => ({
    name: t(`chef_${i}_name`),
    title: t(`chef_${i}_title`),
    image: t(`chef_${i}_image`),
    desc: t(`chef_${i}_desc`),
    specialties: t(`chef_${i}_specialties`).split(","),
    experience: t(`chef_${i}_experience`),
    awards: t(`chef_${i}_awards`),
    gradient: t(`chef_${i}_gradient`),
  }));

  const openChefPopup = (index: number) => setSelectedChef(index);
  const closeChefPopup = () => setSelectedChef(null);
  const nextChef = () =>
    setSelectedChef((prev) =>
      prev !== null ? (prev + 1) % chefs.length : null
    );
  const prevChef = () =>
    setSelectedChef((prev) =>
      prev !== null ? (prev - 1 + chefs.length) % chefs.length : null
    );

  return (
    <section className="bg-white py-16 px-6 sm:px-10 md:px-20 lg:px-28 xl:px-36 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-wide pb-2 mb-4 bg-gradient-to-r from-[#AF763E] via-[#D97706] to-[#8B5A2B] bg-clip-text text-transparent">
          {t("title")}
        </h2>
        <p className="text-[#AF763E]/90 text-lg max-w-5xl mx-auto leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
        {[
          { icon: Users, number: "3", label: t("stats.chefs") },
          { icon: Award, number: "12+", label: t("stats.awards") },
          { icon: Star, number: "50+", label: t("stats.years") },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-gradient-to-br from-[#AF763E]/20 to-[#8B5A2B]/20 rounded-lg">
                <item.icon className="w-5 h-5 text-[#AF763E]" />
              </div>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
              {item.number}
            </div>
            <div className="text-sm text-[#AF763E]/70">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {chefs.map((chef, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl shadow-md overflow-hidden border border-[#AF763E]/20 cursor-pointer"
            onClick={() => openChefPopup(index)}
          >
            <div className="relative overflow-hidden rounded-t-2xl">
              <Image
                src={`/${chef.image}`}
                alt={`${chef.name} - ${chef.title}`}
                width={400}
                height={280}
                className="w-full h-[280px] object-cover"
              />
            </div>
            <div className="p-5">
              <h4 className="text-xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent mb-1">
                {chef.name}
              </h4>
              <p className="text-sm text-[#AF763E]/80 italic mb-3">
                {chef.title}
              </p>
              <p className="text-sm text-[#AF763E]/80 mb-3">{chef.desc}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                {chef.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 text-[#AF763E] rounded-full border border-[#AF763E]/20"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-16 text-center">
        <div className="bg-gradient-to-r from-[#AF763E]/10 to-[#8B5A2B]/10 rounded-2xl p-8 border border-[#AF763E]/20">
          <Sparkles className="w-8 h-8 text-[#AF763E] mb-4 mx-auto opacity-30" />
          <blockquote className="text-xl italic text-[#AF763E]/80 mb-2">
            &ldquo;{t("quote_text")}&rdquo;
          </blockquote>
          <cite className="text-sm font-semibold text-[#AF763E] not-italic">
            — {t("quote_author")}
          </cite>
        </div>
      </div>

      {/* Popup */}
      {selectedChef !== null && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-6"
          onClick={closeChefPopup}
        >
          <div
            className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              <Image
                src={`/${chefs[selectedChef].image}`}
                alt={chefs[selectedChef].name}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
              <h3 className="text-3xl font-bold text-[#AF763E] mb-3">
                {chefs[selectedChef].name}
              </h3>
              <p className="text-lg text-[#AF763E]/80 italic mb-5">
                {chefs[selectedChef].title}
              </p>
              <p className="text-base text-[#444] mb-6">
                {chefs[selectedChef].desc}
              </p>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#AF763E] mb-3">
                  {t("popup.specialties")}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {chefs[selectedChef].specialties.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-[#AF763E]/10 text-[#AF763E] rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-sm text-[#AF763E]">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {chefs[selectedChef].awards}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                  {chefs[selectedChef].experience}
                </div>
              </div>
            </div>
            <button
              onClick={closeChefPopup}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-[#AF763E]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevChef();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6 text-[#AF763E]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextChef();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6 text-[#AF763E]" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
