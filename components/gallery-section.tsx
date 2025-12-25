"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Gallery images scraped from shearmagicbarbershop.com
const galleryImages = [
  { src: "/images/gallery/1_1.jpg", alt: "Fresh Fade", category: "Fades" },
  { src: "/images/gallery/1_2.jpg", alt: "Clean Lineup", category: "Fades" },
  { src: "/images/gallery/2_1.jpg", alt: "Low Taper", category: "Fades" },
  { src: "/images/gallery/2_2.jpg", alt: "Skin Fade", category: "Fades" },
  { src: "/images/gallery/2_3.jpg", alt: "Box Fade", category: "Fades" },
  { src: "/images/gallery/3_1.jpg", alt: "High Top", category: "Modern" },
  { src: "/images/gallery/3_2.jpg", alt: "Temple Fade", category: "Fades" },
  { src: "/images/gallery/3_3.jpg", alt: "Classic Cut", category: "Classic" },
  { src: "/images/gallery/4_1.jpg", alt: "Sharp Edge Up", category: "Fades" },
  { src: "/images/gallery/4_2.jpg", alt: "Bald Fade", category: "Fades" },
  { src: "/images/gallery/5_1.jpg", alt: "Mohawk Fade", category: "Modern" },
  { src: "/images/gallery/5_2.jpg", alt: "Taper Cut", category: "Classic" },
  { src: "/images/gallery/6_1.jpg", alt: "Burst Fade", category: "Fades" },
  { src: "/images/gallery/6_2.jpg", alt: "Drop Fade", category: "Fades" },
  { src: "/images/gallery/7_1.jpg", alt: "Shadow Fade", category: "Fades" },
  { src: "/images/gallery/7_2.jpg", alt: "Mid Fade", category: "Fades" },
  { src: "/images/gallery/8_1.jpg", alt: "Textured Crop", category: "Modern" },
  { src: "/images/gallery/8_2.jpg", alt: "Caesar Cut", category: "Classic" },
  { src: "/images/gallery/9_1.jpg", alt: "Curly Top", category: "Modern" },
  { src: "/images/gallery/9_2.jpg", alt: "Afro Taper", category: "Fades" },
  { src: "/images/gallery/10_1.jpg", alt: "Undercut", category: "Modern" },
  { src: "/images/gallery/10_2.jpg", alt: "Pompadour", category: "Classic" },
  { src: "/images/gallery/10_3.jpg", alt: "Slick Back", category: "Classic" },
  { src: "/images/gallery/11_1.jpg", alt: "Waves Cut", category: "Modern" },
  { src: "/images/gallery/11_2.jpg", alt: "Design Lineup", category: "Modern" },
  { src: "/images/gallery/11_3.jpg", alt: "Precision Cut", category: "Classic" },
];

// Placeholder data when no real images exist
const placeholderGallery = [
  { category: "Fades", description: "Skin fades, mid fades, high fades - precision gradients" },
  { category: "Classic", description: "Timeless gentleman cuts and side parts" },
  { category: "Modern", description: "Textured crops and contemporary styles" },
  { category: "Beards", description: "Beard shaping, hot towel shaves, edge-ups" },
  { category: "Kids", description: "Patient styling for our youngest clients" },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hasRealImages] = useState(true); // Real images now available!

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <section className="py-16 md:py-32 px-4 sm:px-6 md:px-12" id="gallery">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-accent mb-3 md:mb-4">Our Work</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 md:mb-6">
            The Gallery
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            30+ years of precision cuts and satisfied clients. Every style, crafted with care.
          </p>
        </motion.div>

        {hasRealImages ? (
          // Real image gallery grid
          <>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square rounded-sm overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(i)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-accent">{img.category}</p>
                    <p className="text-sm text-foreground">{img.alt}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
              {selectedImage !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center"
                  onClick={() => setSelectedImage(null)}
                >
                  <button
                    className="absolute top-6 right-6 p-2 text-foreground hover:text-accent"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <button
                    className="absolute left-6 p-2 text-foreground hover:text-accent"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    className="absolute right-6 p-2 text-foreground hover:text-accent"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-[80vw] h-[80vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={galleryImages[selectedImage].src}
                      alt={galleryImages[selectedImage].alt}
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          // Placeholder gallery when no real images
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {placeholderGallery.map((item, i) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative aspect-[4/3] rounded-sm overflow-hidden border border-border bg-surface group"
              >
                {/* Placeholder pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-accent/30 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-accent/50">✂</span>
                    </div>
                    <h3 className="font-serif text-xl text-foreground mb-2">{item.category}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="relative aspect-[4/3] rounded-sm overflow-hidden border border-accent/30 bg-accent/5 flex items-center justify-center"
            >
              <div className="text-center p-6">
                <p className="text-accent font-medium mb-2">Ready for your transformation?</p>
                <a
                  href="/book"
                  className="inline-block px-6 py-3 bg-accent text-background rounded-sm hover:bg-accent/90 transition-colors"
                >
                  Book Now
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Note for clients */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-sm mt-12"
        >
          Follow us on social media to see our latest work!
        </motion.p>
      </div>
    </section>
  );
}
