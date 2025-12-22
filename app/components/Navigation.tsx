'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll detection for "Glass" effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Floating Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center transition-all duration-500",
          scrolled ? "py-4 glass border-b-0" : "bg-transparent"
        )}
      >
        <Link href="/" className="group relative z-50">
           <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors">
             SHEAR MAGIC
           </span>
        </Link>

        {/* The Magnetic Hamburger */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 p-2 text-white hover:text-gold-400 transition-colors"
        >
          {isOpen ? <X size={32} strokeWidth={1} /> : <Menu size={32} strokeWidth={1} />}
        </button>
      </motion.header>

      {/* The Void Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-neutral-950 flex items-center justify-center"
          >
             {/* Background noise specifically for menu */}
             <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

             <nav className="flex flex-col items-center space-y-8 relative z-10">
               {[
                 { name: 'Index', href: '/' },
                 { name: 'Reservations', href: '/book' },
                 { name: 'Administration', href: '/admin' }
               ].map((item, i) => (
                 <motion.div
                    key={item.name}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * i, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 >
                   <Link 
                     href={item.href} 
                     onClick={() => setIsOpen(false)}
                     className="font-serif text-5xl md:text-7xl text-neutral-500 hover:text-gold-400 hover:text-glow-gold transition-all duration-300 tracking-tight"
                   >
                     {item.name}
                   </Link>
                 </motion.div>
               ))}
             </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
