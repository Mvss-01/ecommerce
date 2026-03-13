"use client";

import React, { Suspense } from 'react';
import { MessageCircle, Instagram, Facebook } from 'lucide-react'; 
import { motion } from 'framer-motion';
import { Noto_Kufi_Arabic } from 'next/font/google';
import Navbar from '@/components/Navbar';

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700']
});

interface ContactLink {
  title: string;
  subtitle: string;
  detail: string;
  href: string;
  icon: React.ReactNode;
}

const contactLinks: ContactLink[] = [
  {
    title: "الواتساب المباشر",
    subtitle: "خدمة استشارية فورية وحصرية",
    detail: "0559398340",
    href: "https://wa.me/966559854862",
    icon: <MessageCircle className="w-6 h-6" />,
  },
  {
    title: "انستغرام",
    subtitle: "تابع جديدنا الحصري يومياً",
    detail: "LaPerleDz Official",
    href: "#",
    icon: <Instagram className="w-6 h-6" />,
  },
  {
    title: "فيسبوك",
    subtitle: "تواصل مع مجتمعنا الراقي",
    detail: "LaPerleDz Official",
    href: "#",
    icon: <Facebook className="w-6 h-6" />,
  },
];

export default function ContactSection() {
  return (
    <div className={`${notoKufi.className} min-h-screen bg-white flex justify-center items-center p-5 text-[#121212] mt-20`}>
      <Suspense fallback={<div className="h-20" />}> 
        <Navbar />
      </Suspense>

      <div className="w-full max-w-112.5">
        <header className="text-center mb-12">
          <div className="w-10 h-0.5 bg-black mx-auto mb-4" />
          <h1 className="text-[1.8rem] font-bold tracking-wide">تواصل معنا</h1>
        </header>

        <section className="flex flex-col gap-5 items-center">
          {contactLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group w-full bg-white p-[30px_20px] text-center border border-[#f0f0f0] rounded-[15px] transition-all duration-400 ease-out hover:-translate-y-1.5 hover:border-black hover:shadow-[0_15px_35px_rgba(197,160,89,0.1)] no-underline"
            >
              <div className="w-15 h-15 bg-[#fbfbfb] rounded-full flex items-center justify-center mx-auto mb-5 text-[#121212] transition-colors duration-400 group-hover:bg-[#121212] group-hover:text-white">
                {link.icon}
              </div>

              <h2 className="text-[1.1rem] font-semibold mb-2">{link.title}</h2>
              <p className="text-[0.85rem] text-[#777] mb-4">{link.subtitle}</p>
              <span className="font-bold text-black text-[0.95rem] tracking-wide">{link.detail}</span>
            </motion.a>
          ))}
        </section>
      </div>
    </div>
  );
}