"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Scissors } from "lucide-react";

const contactInfo = [
  { icon: MapPin, label: "Location", value: ["225 Market ST", "Johnstown, PA 15901"] },
  { icon: Clock, label: "Hours", value: ["Tue-Sat: 9AM-5PM", "Sun-Mon: CLOSED"] },
  { icon: Phone, label: "Call Us", value: ["(814) 535-5110", "After Hours: (814) 418-3779"] },
  { icon: Mail, label: "Email", value: ["calvin.berkins@yahoo.com"] },
];

export default function ContactSection() {
  return (
    <footer className="relative py-16 md:py-44 px-4 sm:px-6 md:px-12 border-t border-border overflow-hidden" id="contact">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.08) 0%, transparent 70%)" }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Decorative elements - hidden on mobile */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="hidden md:block absolute top-20 right-20 w-48 h-48 border border-dashed border-border rounded-full opacity-20"
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-24"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-accent mb-4 md:mb-6">Get In Touch</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 md:mb-6">
            Visit Us
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-md mx-auto">
            Johnstown's premiere barbershop. Friendly service at its best – we treat our customers like family!
          </p>
        </motion.div>

        {/* Contact cards grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {contactInfo.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              whileHover={{ y: -5, borderColor: "rgba(201, 162, 39, 0.3)" }}
              className="p-4 md:p-6 border border-border rounded-sm transition-all duration-300"
            >
              <item.icon className="w-4 h-4 md:w-5 md:h-5 text-accent mb-3 md:mb-4" />
              <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground mb-2 md:mb-3">{item.label}</p>
              <div className="space-y-0.5 md:space-y-1">
                {item.value.map((line, j) => (
                  <p key={j} className="text-sm md:text-base text-foreground font-light">{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-24"
        >
          <h3 className="text-lg font-medium text-foreground mb-4 text-center">Find Us</h3>
          <div className="relative w-full h-64 md:h-80 rounded-sm overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.847!2d-78.9215!3d40.3267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89cb53f3f07a2f1b%3A0x7b9c6c6e8f8c8e8!2s225%20Market%20St%2C%20Johnstown%2C%20PA%2015901!5e0!3m2!1sen!2sus!4v1703451000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shear Magic Barbershop Location"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <p className="text-center text-muted-foreground text-sm mt-3">
            225 Market ST, Johnstown, PA 15901
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12 md:mb-24"
        >
          <p className="text-sm md:text-base text-muted-foreground mb-1 md:mb-2">Over 30 years of professional styling experience</p>
          <p className="text-accent font-medium mb-6 md:mb-8">Walk-ins Always Welcome!</p>
          <motion.a
            href="tel:8145355110"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-accent text-background font-medium uppercase tracking-wider text-xs md:text-sm rounded-sm shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
          >
            <Phone className="w-4 h-4" />
            Call (814) 535-5110
          </motion.a>
        </motion.div>

        {/* Footer bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 md:pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6"
        >
          <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Shear Magic Barbershop. Locally owned and operated.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            225 Market ST, Johnstown, PA 15901
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
