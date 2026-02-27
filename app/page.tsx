import { HeroSection } from "@/components/landing/hero-section";
import { FeaturedProperties } from "@/components/landing/featured-properties";
import { AboutSection } from "@/components/landing/about-section";
import { ContactSection } from "@/components/landing/contact-section";

export default function Home() {
  return (
    <main>
        <HeroSection />
      <FeaturedProperties />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
