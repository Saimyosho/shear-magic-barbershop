"use client";

import { motion } from "framer-motion";

type Service = {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string | null;
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const item = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

export default function ServicesList({ services }: { services: Service[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="max-w-3xl mx-auto grid gap-4"
    >
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          variants={item}
          whileHover={{ x: 10, backgroundColor: "rgba(201, 162, 39, 0.05)" }}
          className="group relative p-6 border border-border rounded-sm transition-all duration-500 cursor-pointer overflow-hidden"
        >
          {/* Hover accent line */}
          <motion.div
            className="absolute left-0 top-0 w-1 h-full bg-accent origin-top"
            initial={{ scaleY: 0 }}
            whileHover={{ scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />

          <div className="flex justify-between items-center gap-8">
            <div className="flex-1">
              <div className="flex items-baseline gap-4 mb-2">
                <motion.span
                  className="text-xs text-accent font-mono"
                  initial={{ opacity: 0.5 }}
                  whileHover={{ opacity: 1 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.span>
                <h3 className="text-xl font-serif text-foreground group-hover:text-accent transition-colors duration-300">
                  {service.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                {service.duration} min • Consultation included
              </p>
            </div>

            <motion.div
              className="text-right"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl font-mono text-accent">${service.price}</span>
            </motion.div>
          </div>

          {/* Decorative corner */}
          <div className="absolute bottom-2 right-2 w-6 h-6 border-r border-b border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </motion.div>
  );
}
