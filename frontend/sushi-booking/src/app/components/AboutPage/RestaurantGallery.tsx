"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "../../lib/i18n/client";

export default function RestaurantGallery() {
  const { t } = useTranslation("restaurant");

  const [filter] = useState("All");

  const images = Array.from({ length: 7 }).map((_, i) =>
    JSON.parse(t(`list_${i}`))
  );

  const filteredImages =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  return (
    <section className="py-[60px] px-[90px] bg-[#F8F1E9]">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h3 className="pb-2 text-5xl font-bold bg-gradient-to-r from-[#AF763E] to-[#8B5A2B] bg-clip-text text-transparent">
          {t("heading")}
        </h3>
        <p className="mt-4 text-[#AF763E]/90 text-lg">{t("subheading")}</p>
      </div>

      {/* Featured Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {filteredImages
          .filter((img) => img.featured)
          .slice(0, 3)
          .map((image, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <Image
                src={image.src}
                alt={image.title}
                width={600}
                height={400}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span>{image.category}</span>
                  {image.featured && (
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <h4 className="font-semibold text-lg">{image.title}</h4>
                <p className="text-sm opacity-90">{image.desc}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Regular Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredImages
          .filter((img) => !img.featured)
          .map((image, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-lg shadow hover:shadow-md transition duration-300"
            >
              <Image
                src={image.src}
                alt={image.title}
                width={300}
                height={200}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 text-white text-sm">
                <h5>{image.title}</h5>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
