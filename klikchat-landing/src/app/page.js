"use client";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ScreenshotsSection from "@/components/ScreenshotsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";

export default function Home() {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <StickyCTA />
      <FeaturesSection />
      <ScreenshotsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
