import { Suspense } from "react";
import { HeroSection, HeroSectionFallback } from "@/components/landing/hero-section";
import { FeaturedProperties } from "@/components/landing/featured-properties";
import { CtaBanners } from "@/components/landing/cta-banners";
import { AboutSection } from "@/components/landing/about-section";
import { ContactSection } from "@/components/landing/contact-section";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<HeroSectionFallback />}>
        <HeroSection />
      </Suspense>
      <FeaturedProperties />
      <CtaBanners />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
