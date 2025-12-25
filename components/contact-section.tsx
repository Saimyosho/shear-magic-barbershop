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

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <motion.a
              href="https://www.instagram.com/shearmagicbarbershop/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, color: "#C9A227" }}
              className="text-muted-foreground hover:text-accent transition-colors"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </motion.a>
            <motion.a
              href="https://www.facebook.com/pages/Calvins-Shear-Magic/128438530636075"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, color: "#C9A227" }}
              className="text-muted-foreground hover:text-accent transition-colors"
              aria-label="Follow us on Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </motion.a>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground">
            225 Market ST, Johnstown, PA 15901
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
