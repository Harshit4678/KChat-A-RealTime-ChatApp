"use client";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ScreenshotsSection from "@/components/ScreenshotsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground overflow-x-hidden">
        <section id="home">
          <HeroSection />
        </section>
        <StickyCTA />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="how">
          {" "}
          <ScreenshotsSection />
        </section>
        <section id="faqs">
          <FAQSection />
        </section>
        <CTASection />
        <section id="contact">
          {" "}
          <Footer />
        </section>
      </main>
    </>
  );
}
