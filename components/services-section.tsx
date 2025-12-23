import { getServices } from "@/app/actions";
import ServicesList from "./services-list";

export default async function ServicesSection() {
  const services = await getServices();

  return (
    <section className="relative py-20 md:py-44 px-4 sm:px-6 md:px-12 border-t border-border overflow-hidden" id="services">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />

      {/* Decorative circles - hidden on mobile */}
      <div className="hidden md:block absolute top-20 right-20 w-64 h-64 border border-border rounded-full opacity-20" />
      <div className="hidden md:block absolute bottom-20 left-20 w-32 h-32 border border-accent/20 rounded-full opacity-30" />

      <div className="relative max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-20">
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-accent mb-4 md:mb-6">
            What We Offer
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 md:mb-6">
            Service Menu
          </h2>
          <div className="w-12 md:w-16 h-0.5 bg-accent mx-auto" />
        </div>

        <ServicesList services={services} />

        {/* Bottom note */}
        <p className="text-center text-muted-foreground text-xs md:text-sm mt-10 md:mt-16">
          All services include consultation. <span className="text-accent">Priority booking available.</span>
        </p>
      </div>
    </section>
  );
}
