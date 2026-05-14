"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../../lib/i18n/client";

export default function ContactFAQ() {
  const { t } = useTranslation("contactFAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: t("question1"),
      answer: t("answer1"),
      icon: "📞",
    },
    {
      question: t("question2"),
      answer: t("answer2"),
      icon: "🥗",
    },
    {
      question: t("question3"),
      answer: t("answer3"),
      icon: "⏱️",
    },
    {
      question: t("question4"),
      answer: t("answer4"),
      icon: "🚗",
    },
    {
      question: t("question5"),
      answer: t("answer5"),
      icon: "🅿️",
    },
  ];

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#AF763E] mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="uppercase text-sm tracking-wide font-semibold">
              {t("sectionLabel")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4B3B2A]">
            {t("heading")}
          </h2>
          <p className="text-[#6D5F50] mt-3 max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[#E7DDD1] rounded-xl p-5 shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex gap-3 items-center text-[#AF763E] font-medium">
                  <span>{faq.icon}</span>
                  <span>{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#AF763E]" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-3 pl-8 pr-2 text-[#5B4A3B]"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[#6D5F50] mb-4">{t("ctaText")}</p>
          <button className="inline-flex items-center gap-2 px-6 py-2 bg-[#AF763E] text-white rounded-full shadow-md hover:shadow-lg transition">
            {t("ctaButton")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
