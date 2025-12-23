"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-44 px-4 sm:px-6 md:px-12 overflow-hidden"
      id="about"
    >
      {/* Background accent */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none"
        style={{ y: textY }}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">

        {/* Image with parallax */}
        <motion.div
          style={{ y: imageY }}
          className="relative aspect-[3/4] md:aspect-[4/5] rounded-sm overflow-hidden group"
        >
          <div className="absolute inset-0 bg-surface">
            <Image
              src="/images/about-storefront.jpg"
              alt="Shear Magic Barbershop storefront with barber and client"
              fill
              className="object-cover group-hover:scale-105 transition-all duration-1000"
            />
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-background/80 backdrop-blur-md border border-border p-3 md:p-6"
          >
            <motion.span
              className="block text-2xl md:text-4xl font-serif text-accent mb-0.5 md:mb-1"
              whileHover={{ scale: 1.1 }}
            >
              30+
            </motion.span>
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">Years Experience</span>
          </motion.div>

          {/* Corner accent */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-accent/30" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-accent/30" />
        </motion.div>

        {/* Text content */}
        <motion.div
          style={{ y: textY }}
          className="space-y-6 md:space-y-10 text-center lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-accent"
          >
            About Us
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight"
          >
            Johnstown's Premiere<br />
            <motion.span
              className="text-accent inline-block"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Barbershop
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 md:space-y-6 text-sm md:text-base text-muted-foreground font-light leading-relaxed"
          >
            <p>
              <span className="text-foreground font-normal">Shear Magic Barbershop</span> is locally owned and operated, native to Johnstown, PA. We provide the best in hair services to Johnstown and surrounding areas.
            </p>
            <p>
              With <span className="text-foreground font-normal">over 30 years of professional hair styling experience</span>, our three barbers on staff deliver friendly service at its best. We treat our customers like family and enjoy great conversation while perfecting your look.
            </p>
            <p className="text-accent font-medium">
              Walk-ins are always welcome!
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-start gap-6 sm:gap-8 md:gap-12 pt-6 md:pt-8 border-t border-border"
          >
            {[
              { number: "3", label: "Expert Barbers" },
              { number: "30+", label: "Years Experience" },
              { number: "∞", label: "Happy Clients" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center"
              >
                <span className="block text-2xl md:text-3xl font-serif text-accent">{stat.number}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
