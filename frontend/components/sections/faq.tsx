"use client";

import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "Is NEET mandatory for MBBS admission abroad?",
    answer: "Yes. Indian students planning to pursue MBBS abroad generally need to qualify NEET in accordance with the applicable regulations of the National Medical Commission (NMC).",
  },
  {
    question: "Can you help with MBBS admission in India?",
    answer: "Yes. We provide guidance for MBBS admissions through All India Counseling, State Counseling, Government Medical Colleges, Private Medical Colleges, and Deemed Universities.",
  },
  {
    question: "Which country is best for MBBS?",
    answer: "There is no single 'best' country for every student. The ideal destination depends on your academic profile, budget, preferred learning environment, and long-term career goals. Our counselors help you evaluate the available options.",
  },
  {
    question: "How do I choose the right medical university?",
    answer: "We assess factors such as academic performance, NEET qualification, tuition fees, recognition, clinical exposure, infrastructure, faculty, student support, and future career opportunities before recommending suitable universities.",
  },
  {
    question: "Do you assist with visa applications?",
    answer: "Yes. We provide complete guidance regarding documentation, application procedures, and visa requirements for eligible students pursuing MBBS abroad.",
  },
  {
    question: "Can you help with education loans?",
    answer: "Yes. We guide students and parents regarding education loan documentation and financing options available through eligible financial institutions.",
  },
  {
    question: "Will you help after admission?",
    answer: "Absolutely. Our support continues with travel guidance, hostel assistance, university joining formalities, and ongoing student support.",
  },
  {
    question: "How long does the admission process take?",
    answer: "The timeline varies depending on the university, counseling schedule, document verification, and visa procedures. Our counselors provide a personalized admission timeline during the counseling session.",
  },
  {
    question: "Are hostel facilities available?",
    answer: "Most universities provide hostel or accommodation options for international students. We help students understand the available facilities before admission.",
  },
  {
    question: "How do I begin my admission process?",
    answer: "Simply book a free counseling session with our admission experts. We will evaluate your profile and guide you through every step of the admission journey.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Generate FAQ schema markup JSON-LD
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className="pt-2 pb-12 sm:pt-4 sm:pb-16 md:pt-6 md:pb-20 bg-[#fafcff] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-10 sm:space-y-14">

        {/* Schema markup script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />

        {/* Custom Stylesheet for floating animation */}
        <style>{`
          @keyframes floatFaqImage {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .faq-float-img {
            animation: floatFaqImage 5s ease-in-out infinite;
          }
        `}</style>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
            Asked Questions
          </span>
          <h2 className="text-[22px] sm:text-[28px] md:text-[34px] font-black text-[#0c2e60] tracking-tight">
            Generally <span className="text-[#3b82f6]">Asked Questions</span>
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: 3D Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[420px] lg:max-w-none aspect-[4/3] lg:aspect-auto lg:h-[450px]">
              <img
                src="/faq_illustration.png"
                alt="Admissions Consultation FAQ Illustration"
                className="w-full h-full object-contain faq-float-img"
                onError={(e) => {
                  // Fallback if image has not finished copying yet
                  e.currentTarget.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800";
                }}
              />
            </div>
          </div>

          {/* Right Column: Premium Accordion Wrapper Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-100 rounded-[28px] p-5 sm:p-7 md:p-8 shadow-xl shadow-slate-100/50">
              <div className="divide-y divide-slate-100">
                {faqs.map((faq, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={i} className="py-4.5 sm:py-5 first:pt-0 last:pb-0">
                      {/* Question Row */}
                      <button
                        onClick={() => toggle(i)}
                        className="w-full flex items-center justify-between text-left gap-4 outline-none select-none cursor-pointer group"
                      >
                        <span className="text-[12px] sm:text-[14px] md:text-[15px] font-black text-slate-700 group-hover:text-[#3b82f6] transition-colors duration-200 leading-snug tracking-wide">
                          {faq.question}
                        </span>

                        {/* Plus/Minus Circular Box */}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 flex-shrink-0 ${isOpen
                            ? "bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]"
                            : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-[#3b82f6]/5 group-hover:border-[#3b82f6]/10 group-hover:text-[#3b82f6]"
                            }`}
                        >
                          {isOpen ? <FaMinus /> : <FaPlus />}
                        </div>
                      </button>

                      {/* Answer Box */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                          }`}
                      >
                        <div className="pt-3 pb-1 text-[11px] sm:text-[12px] md:text-[13px] text-slate-500 font-medium leading-relaxed pr-8 sm:pr-10">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
