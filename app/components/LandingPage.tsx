'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Navigation from './Navigation'
import { ArrowRight, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Define props for the client component that wraps the data
type Props = {
  barbers: any[]
  services: any[]
}

export default function LandingPage({ barbers, services }: Props) {
  const containerRef = useRef(null)
  
  // Parallax Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  // Z-Axis Transforms
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100])

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05, // Heavy, luxurious scroll
      wheelMultiplier: 1.2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <div ref={containerRef} className="bg-background min-h-screen selection:bg-accent selection:text-white">
      <Navigation />

      {/* SECTION 1: THE PORTAL (HERO) */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
             {/* Real Image Background */}
             <div 
               className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914209-98c22f01a111?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
             ></div>
             {/* Gradient Overlay for Readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background"></div>
             
             {/* Abstract light leak - Warmer tones for luxury */}
             <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[120px] mix-blend-overlay"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-foreground/5 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center px-6"
        >
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-foreground/30 hidden md:block"></div>
            <span className="font-mono text-xs md:text-sm tracking-[0.3em] text-accent uppercase font-medium">
              Est. MMX
            </span>
            <div className="h-px w-12 bg-foreground/30 hidden md:block"></div>
          </motion.div>
          
          <h1 className="text-[14vw] leading-[0.8] font-serif text-foreground tracking-tighter mix-blend-multiply">
            SHEAR<br/>
            <span className="italic font-light">MAGIC</span>
          </h1>
          
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.8 }}
             className="mt-12 font-sans text-muted-foreground max-w-md mx-auto text-lg leading-relaxed font-light"
          >
            <span className="float-left text-7xl font-serif leading-[0.8] mr-3 text-foreground">T</span>
            he intersection of precision engineering and classic grooming in Johnstown, PA.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.5, duration: 1 }}
           className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
        >
          <div className="w-[1px] h-24 bg-gradient-to-b from-foreground/0 via-foreground/30 to-foreground/0"></div>
        </motion.div>
      </section>


      {/* SECTION 2: THE MENU (SERVICES) */}
      <section className="relative py-32 md:py-48 px-8 md:px-16 border-t border-foreground/10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
          <div className="lg:col-span-4 lg:col-start-2 sticky top-32 h-fit">
            <span className="block font-mono text-xs text-accent uppercase tracking-[0.25em] mb-6">Service Menu</span>
            <h2 className="text-6xl md:text-8xl font-serif text-foreground mb-8 leading-[0.9]">The<br/><span className="italic font-light">Curated</span><br/>List</h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-xs">
              Services designed for the modern gentleman. Each cut is a sculptural process, not just a trim.
            </p>
          </div>
          
          <div className="lg:col-span-6 space-y-0">
            {services.map((service, i) => (
              <motion.div 
                 key={service.id}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
                 transition={{ duration: 0.8, delay: i * 0.1 }}
                 className="group relative border-b border-foreground/10 py-10 hover:border-accent transition-colors duration-700"
              >
                 <div className="flex justify-between items-baseline mb-3">
                   <h3 className="text-3xl md:text-4xl font-serif text-foreground group-hover:text-accent transition-colors duration-500">{service.name}</h3>
                   <span className="font-mono text-lg text-foreground/60">${service.price}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <p className="text-muted-foreground font-light text-sm tracking-wide">{service.description || "Precision cut & styling."}</p>
                   <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{service.duration} MIN</span>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* SECTION 3: THE ATELIER (TEAM) */}
      <section className="py-32 md:py-48 bg-foreground text-background relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <div className="mb-32 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 md:col-start-2">
              <span className="font-mono text-xs text-accent uppercase tracking-[0.25em] block mb-6">The Architects</span>
              <h2 className="text-6xl md:text-8xl font-serif text-background leading-[0.9]">Master<br/><span className="italic font-light">Barbers</span></h2>
            </div>
            <div className="md:col-span-4 md:col-end-12 flex items-end pb-4">
              <p className="text-background/60 font-light leading-relaxed">
                Meet the artisans behind the chair. With decades of combined experience, our team approaches every client as a unique canvas.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-16">
            {barbers.map((barber, i) => (
              <motion.div 
                 key={barber.id}
                 initial={{ opacity: 0, y: 60 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1, delay: i * 0.2 }}
                 className="group relative"
              >
                <div className="relative aspect-[3/4] bg-neutral-900 mb-8 overflow-hidden grayscale-transition shadow-lifted">
                   {/* Real Image Placeholder */}
                   <div 
                     className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
                     style={{ 
                       backgroundImage: `url(${
                         i === 0 ? 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=800&auto=format&fit=crop' : // Calvin (Older/Owner vibe)
                         i === 1 ? 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop' : // Darrien (Younger vibe)
                         'https://images.unsplash.com/photo-1521119989659-a83eee488058?q=80&w=800&auto=format&fit=crop' // Danielle (Stylist)
                       })` 
                     }}
                   ></div>
                   
                   {/* Vertical Name Label - Visible on hover or desktop */}
                   <div className="absolute top-4 right-4 z-20 font-mono text-[10px] text-white uppercase tracking-[0.25em] vertical-rl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {barber.name}
                   </div>
                   
                   <div className="absolute inset-0 shadow-inner-border pointer-events-none"></div>
                </div>
                
                <div className="border-t border-white/20 pt-6 group-hover:border-accent transition-colors duration-700">
                  <h3 className="text-3xl font-serif text-white mb-2 group-hover:text-accent transition-colors duration-500">{barber.name}</h3>
                  <p className="font-mono text-[10px] text-white/60 uppercase tracking-[0.25em] mb-4">{barber.title}</p>
                  <p className="text-white/50 text-sm leading-relaxed font-light">{barber.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE CALL (FOOTER) */}
      <section className="py-48 px-6 text-center bg-background relative border-t border-foreground/5">
         <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
           <h2 className="text-7xl md:text-9xl font-serif text-foreground mb-12 tracking-tighter leading-[0.85]">
             Secure<br/><span className="italic text-accent">Your Slot</span>
           </h2>
           
           <Link href="/book" passHref>
             <Button variant="link" className="text-xl md:text-2xl h-auto py-4">
               Begin Ritual <ArrowRight className="ml-4 w-6 h-6" />
             </Button>
           </Link>
         </div>
      </section>
    </div>
  )
}