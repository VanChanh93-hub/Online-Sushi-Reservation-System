"use client";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "../../lib/i18n/client";

const testimonials = [
  {
    name: "Nguyễn Minh Anh",
    rating: 5,
    comment: "testimonial1",
    avatar: "MA",
  },
  {
    name: "Trần Văn Hùng",
    rating: 5,
    comment: "testimonial2",
    avatar: "TH",
  },
  {
    name: "Lê Thị Hoa",
    rating: 5,
    comment: "testimonial3",
    avatar: "LH",
  },
];

export default function ContactTestimonials() {
  const { t } = useTranslation("contactTestimonials");

  return (
    <section className="bg-[#FAF7F2] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#AF763E] mb-2">
            <Quote className="w-5 h-5" />
            <span className="uppercase text-sm tracking-wide font-semibold">
              {t("subtitle")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4B3B2A]">
            {t("title")}
          </h2>
          <p className="text-[#6D5F50] mt-3 max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tItem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="bg-white border border-[#E7DDD1] rounded-xl shadow-sm p-6 flex flex-col justify-between"
            >
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#AF763E]/90 text-white rounded-full flex items-center justify-center font-semibold">
                  {tItem.avatar}
                </div>
                <div>
                  <h4 className="text-[#4B3B2A] font-semibold">{tItem.name}</h4>
                  <div className="flex gap-1">
                    {Array(tItem.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#F7C948] text-[#F7C948]"
                        />
                      ))}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className="text-[#5B4A3B] text-sm leading-relaxed italic">
                &quot;{t(tItem.comment)}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
