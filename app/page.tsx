import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import ServicesSection from "@/components/services-section";
import GallerySection from "@/components/gallery-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent selection:text-black">
      <HeroSection />

      <AboutSection />

      <ServicesSection />

      <GallerySection />

      <ContactSection />
    </main>
  );
}