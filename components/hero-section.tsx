"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import FloatingParticles from "./floating-particles";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center px-4 sm:px-6 md:px-12 py-20 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.08) 0%, transparent 70%)" }} />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Decorative lines */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent origin-left"
      />

      {/* Main content grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">

        {/* Left: Text content */}
        <motion.div style={{ y }} className="space-y-5 md:space-y-8 order-2 lg:order-1 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-2.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm"
          >
            <motion.span
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-accent">Johnstown's Premiere Barbershop</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-none"
          >
            <span className="text-foreground">Shear </span>
            <motion.span
              className="text-accent inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Magic
            </motion.span>
          </motion.h1>

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-16 md:w-24 h-0.5 bg-gradient-to-r from-accent to-accent/20 mx-auto lg:mx-0"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-base md:text-lg text-muted-foreground font-light max-w-md mx-auto lg:mx-0 leading-relaxed"
          >
            Friendly Service at its Best. Over 30 years of professional hair styling experience.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-accent font-medium"
          >
            Walk-ins Welcome!
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/book">
                <Button
                  size="lg"
                  className="bg-accent text-background hover:bg-accent/90 shadow-lg shadow-accent/20"
                >
                  Book Appointment
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-foreground/20 hover:bg-foreground/5"
                >
                  View Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: Hero image */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 lg:order-2"
        >
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-black/50">
            <Image
              src="/images/hero-storefront.jpg"
              alt="Shear Magic Barbershop at sunset - Johnstown, PA"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-accent/50" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-accent/50" />
          </div>

          {/* Floating badge on image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute -bottom-6 -left-6 bg-background/90 backdrop-blur-md border border-border p-5"
          >
            <span className="block text-3xl font-serif text-accent">30+</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Years</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
}
