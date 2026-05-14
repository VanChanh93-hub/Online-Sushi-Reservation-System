"use client";

import HeroSection from "@/src/app/components/HomePage/HeroSection";
import FeaturedMenu from "@/src/app/components/HomePage/FeaturedMenu";
import AboutSection from "@/src/app/components/HomePage/AboutSection";
import CallToAction from "@/src/app/components/HomePage/CallToAction";
import MyStory from "@/src/app/components/HomePage/MyStory";
import Menus from "@/src/app/components/HomePage/Menus";
import FavoriteSushiSection from "@/src/app/components/HomePage/FavoriteSushiSection";

export default function SushiPage() {
  return (
    <div className=" min-h-screen bg-[#FFF9F0]">
      <HeroSection />
      <FeaturedMenu />
      <AboutSection />
      <Menus />
      <MyStory />
      <FavoriteSushiSection />
      <CallToAction />
    </div>
  );
}
