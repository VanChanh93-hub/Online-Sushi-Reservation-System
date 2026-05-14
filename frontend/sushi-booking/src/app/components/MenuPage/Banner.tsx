"use client";

import { Noto_Serif_JP } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-noto-serif-jp",
});

export default function BannerMenu() {
  return (
    <section className="menu-banner relative bg-gradient-to-br from-[#4b3720] via-[#3a2917] to-[#2e200f] h-[665px] overflow-hidden py-[60px] sm:px-16 lg:px-24">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('/images/japanese-paper-texture.png')] bg-repeat pointer-events-none" />

      {/* Decorative emojis */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {["🍣", "🍱", "🍙", "🍤", "🥢", "🍶"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl md:text-5xl opacity-20 animate-float-slow"
            style={
              {
                left: `${5 + i * 12}%`,
                top: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.3}s`,
              } as React.CSSProperties
            }
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-full max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left */}
        <div className="flex-1 w-full text-center md:text-left flex flex-col gap-4">
          <div
            className={`${notoSerifJP.variable} font-noto-serif-jp text-[#F4E5D4] text-2xl sm:text-3xl md:text-4xl tracking-widest transition-opacity duration-700 opacity-100`}
          >
            寿司匠メニュー
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#F4E5D4] tracking-tight leading-tight transition-opacity duration-700 delay-100">
            <span className="block">SUSHI TAKUMI</span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#A68345] tracking-wider mt-2 block">
              MENU COLLECTION
            </span>
          </h1>

          <p className="text-[#F4E5D4]/80 text-base sm:text-lg max-w-xl mt-2 transition-opacity duration-700 delay-200">
            Trải nghiệm tinh hoa ẩm thực Nhật Bản qua thực đơn độc quyền của
            Sushi Takumi - nơi nghệ thuật gặp hương vị.
          </p>

          <Link
            href="#reservation"
            className="mt-6 inline-block px-6 py-3 bg-[#A68345] hover:bg-[#BD944A] text-white rounded-full shadow-lg transition-all duration-300 text-sm sm:text-base w-max mx-auto md:mx-0"
          >
            ĐẶT BÀN NGAY
          </Link>
        </div>

        {/* Right - Image */}
        <div className="flex-1 w-full flex justify-center items-center transition-opacity duration-700 delay-300">
          <div className="w-full max-w-[600px]">
            <Image
              src="https://image.phunuonline.com.vn/fckeditor/upload/2022/20221113/images/2020-04-08-92239-1586333880-large.jpg_721668338712.jpg"
              alt="Sushi banner"
              width={600}
              height={400}
              className="w-full h-auto rounded-xl shadow-xl object-cover"
              layout="responsive"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
