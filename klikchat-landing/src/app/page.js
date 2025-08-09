"use client";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ScreenshotsSection from "@/components/ScreenshotsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import Navbar from "@/components/Navbar";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>KLikChat - Spark real vibes with a KLik</title>
        <meta
          name="description"
          content="KLikChat is a modern, secure, and fun chat app with video calls, instant messaging, and glowing UI. Spark real vibes with a KLik!"
        />
        <meta
          name="keywords"
          content="chat app, secure messaging, video call, LikChat, KLikChat, real-time chat"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.klikchat.fun" />
        <meta name="theme-color" content="#6a11cb" />
      </Head>
      <Navbar />
      <main className="bg-background text-foreground overflow-x-hidden">
        <section id="home" aria-label="KLikChat Introduction">
          <HeroSection />
        </section>

        <StickyCTA />

        <section id="features" aria-label="App Features">
          <FeaturesSection />
        </section>

        <section id="how" aria-label="How KLikChat Works">
          <ScreenshotsSection />
        </section>

        <section id="faqs" aria-label="Frequently Asked Questions">
          <FAQSection />
        </section>

        <CTASection />

        <section id="contact" aria-label="Contact and Footer">
          <Footer />
        </section>
      </main>
    </>
  );
}
