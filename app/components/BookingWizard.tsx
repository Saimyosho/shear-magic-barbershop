'use client'

import { useState, useEffect } from 'react'
import { getAvailability, createAppointment, TimeSlot } from '@/app/actions'
import { Barber, Service } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Props = {
  barbers: Barber[]
  services: Service[]
}

const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
}

export default function BookingWizard({ barbers, services }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Selection State
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date, setDate] = useState<string>('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isPriority, setIsPriority] = useState(false)
  
  // Customer Info
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  useEffect(() => {
    if (selectedBarber && date) {
      setLoading(true)
      getAvailability(selectedBarber.id, date)
        .then(data => {
          setSlots(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [selectedBarber, date])

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTime(slot.time)
      setIsPriority(false)
    } else if (slot.isPriorityEligible) {
      const confirmPriority = window.confirm('The Architect is fully booked. Do you wish to initiate a Priority Override? (+$15.00)')
      if (confirmPriority) {
        setSelectedTime(slot.time)
        setIsPriority(true)
      }
    }
  }

  const handleSubmit = async () => {
    if (!selectedBarber || !selectedService || !date || !selectedTime || !customerName || !customerPhone) {
      setError('Protocol incomplete. All fields are mandatory.')
      return
    }
    
    setLoading(true)
    try {
      await createAppointment({
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        dateStr: date,
        timeStr: selectedTime,
        customerName,
        customerPhone,
        isPriority
      })
      // Success Animation could go here
      alert('Ritual Complete. Your session is secured.')
      router.push('/')
    } catch (e) {
      console.error(e)
      setError('System Error. The timeline could not be secured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto min-h-[600px] flex flex-col justify-center">
      {/* Background Decor - Refined for Light Mode Luxury */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-3xl border border-foreground/5 z-0 shadow-lifted overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-multiply grayscale"></div>
      </div>
      
      <div className="relative z-10 p-8 md:p-16">
        {/* Header */}
        <div className="mb-12 flex justify-between items-end border-b border-foreground/10 pb-6">
          <div>
            <span className="font-mono text-xs text-accent uppercase tracking-[0.3em] font-medium">Protocol 0{step}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mt-2 tracking-tight">
              {step === 1 && "Select The Architect"}
              {step === 2 && "Define The Service"}
              {step === 3 && "Secure The Time"}
              {step === 4 && "Finalize Ritual"}
            </h2>
          </div>
          {step > 1 && (
            <Button 
              variant="ghost" 
              onClick={() => setStep(step - 1)} 
              className="text-muted-foreground hover:text-foreground pl-0"
            >
              <ArrowLeft size={14} className="mr-2" />
              <span className="font-mono text-xs tracking-widest uppercase">Regress</span>
            </Button>
          )}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-200 p-4 mb-8 font-mono text-xs uppercase tracking-wide"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 1: BARBER */}
          {step === 1 && (
            <motion.div 
              key="step1" 
              variants={fadeVariant} 
              initial="hidden" 
              animate="visible" 
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {barbers.map((b, i) => (
                <div 
                  key={b.id}
                  onClick={() => { setSelectedBarber(b); setStep(2) }}
                  className="group relative h-[420px] cursor-pointer overflow-hidden border-t border-foreground bg-transparent transition-all duration-700 hover:bg-white/60"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                  
                  {/* Barber Image Background */}
                  <div 
                     className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-20 group-hover:opacity-40"
                     style={{ 
                       backgroundImage: `url(${
                         i === 0 ? 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=800&auto=format&fit=crop' : 
                         i === 1 ? 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop' : 
                         'https://images.unsplash.com/photo-1521119989659-a83eee488058?q=80&w=800&auto=format&fit=crop'
                       })` 
                     }}
                  ></div>

                  {/* Vertical Label */}
                  <div className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground vertical-rl opacity-50 z-20">
                    Master Barber
                  </div>

                  <div className="absolute bottom-0 left-0 p-8 w-full z-20">
                    <div className="w-8 h-px bg-accent mb-6 transition-all duration-500 group-hover:w-24"></div>
                    <h3 className="text-3xl font-serif text-foreground mb-3 leading-none group-hover:text-accent transition-colors duration-500">{b.name}</h3>
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-[0.2em] group-hover:text-foreground transition-colors">{b.title}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* STEP 2: SERVICE */}
          {step === 2 && (
            <motion.div 
              key="step2" 
              variants={fadeVariant} 
              initial="hidden" 
              animate="visible" 
              exit="exit"
              className="space-y-4"
            >
              {services.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep(3) }}
                  className="w-full flex justify-between items-center p-8 border-t border-foreground/20 cursor-pointer hover:border-accent hover:bg-white/40 transition-all duration-500 group"
                >
                  <div className="text-left">
                    <h3 className="text-2xl font-serif text-foreground group-hover:text-accent transition-colors duration-300">{s.name}</h3>
                    <p className="font-sans text-xs text-muted-foreground mt-2 tracking-wide uppercase">{s.duration} Minutes &nbsp;//&nbsp; {s.description}</p>
                  </div>
                  <div className="font-mono text-xl text-foreground/60 group-hover:text-foreground transition-colors">
                    ${s.price}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === 3 && (
            <motion.div 
              key="step3" 
              variants={fadeVariant} 
              initial="hidden" 
              animate="visible" 
              exit="exit"
            >
              <div className="mb-12 max-w-md">
                <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">Select Date</label>
                <input 
                  type="date" 
                  className="w-full bg-transparent border-b border-foreground text-4xl md:text-5xl font-serif text-foreground py-4 focus:outline-none focus:border-accent transition-colors placeholder-muted-foreground/30"
                  onChange={(e) => setDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              {date && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {loading ? (
                    <div className="flex items-center gap-4 text-accent font-mono text-xs uppercase tracking-[0.2em]">
                      <Loader2 className="animate-spin" size={16} />
                      <span>Synchronizing Calendar...</span>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="p-8 border-l-2 border-red-900/30 bg-red-50 text-red-800 font-mono text-xs tracking-wide uppercase">
                      // Unavailable. The shop is closed.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {slots.map(slot => (
                        <button
                          key={slot.time}
                          onClick={() => handleSlotClick(slot)}
                          disabled={!slot.available && !slot.isPriorityEligible}
                          className={cn(
                            "relative py-4 font-mono text-xs border transition-all duration-300",
                            selectedTime === slot.time 
                              ? "bg-foreground border-foreground text-white" 
                              : slot.available 
                                ? "border-foreground/20 text-muted-foreground hover:border-accent hover:text-foreground"
                                : slot.isPriorityEligible 
                                  ? "border-red-200 text-red-700 cursor-pointer hover:bg-red-50 hover:border-red-300"
                                  : "border-transparent text-muted-foreground/30 cursor-not-allowed decoration-slice line-through"
                          )}
                        >
                          {slot.time}
                          {slot.isPriorityEligible && !slot.available && (
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedTime && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-16 flex justify-end"
                >
                  <Button 
                    onClick={() => setStep(4)}
                    size="lg"
                  >
                    Proceed With Booking
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 4: CONFIRM */}
          {step === 4 && (
            <motion.div 
              key="step4" 
              variants={fadeVariant} 
              initial="hidden" 
              animate="visible" 
              exit="exit"
              className="grid md:grid-cols-2 gap-16"
            >
              {/* Receipt Style Summary */}
              <div className="bg-white p-10 shadow-soft relative border border-foreground/5">
                <div className="text-center mb-10">
                  <h3 className="font-serif text-2xl text-foreground tracking-tight italic">Confirmation</h3>
                  <div className="w-full h-px bg-foreground/10 mt-6"></div>
                </div>
                
                <div className="space-y-6 font-mono text-xs tracking-wide text-muted-foreground">
                  <div className="flex justify-between items-baseline">
                    <span className="uppercase tracking-[0.2em]">Architect</span>
                    <span className="font-bold text-foreground text-sm font-serif">{selectedBarber?.name}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="uppercase tracking-[0.2em]">Service</span>
                    <span className="font-bold text-foreground text-sm font-serif">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="uppercase tracking-[0.2em]">Date</span>
                    <span className="text-foreground">{date}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="uppercase tracking-[0.2em]">Time</span>
                    <span className="text-foreground">{selectedTime}</span>
                  </div>
                  {isPriority && (
                    <div className="flex justify-between text-accent items-baseline">
                      <span className="uppercase tracking-[0.2em]">Priority Fee</span>
                      <span>+$15.00</span>
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-6 border-t border-foreground flex justify-between items-baseline">
                  <span className="font-mono text-xs uppercase tracking-[0.2em]">Total</span>
                  <span className="font-serif text-3xl text-foreground">${ (selectedService?.price || 0) + (isPriority ? 15 : 0) }</span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-10 flex flex-col justify-center">
                 <div className="space-y-8">
                   <div>
                      <label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em] mb-3">Client Identification</label>
                      <Input 
                        placeholder="Full Name"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="text-xl py-4 h-auto font-serif"
                      />
                   </div>
                   <div>
                      <label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em] mb-3">Comms Frequency</label>
                      <Input 
                        placeholder="Phone Number"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="text-xl py-4 h-auto font-serif"
                      />
                   </div>
                 </div>

                 <Button 
                   onClick={handleSubmit}
                   disabled={loading}
                   size="lg"
                   className="w-full mt-4"
                 >
                   {loading ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2" size={16} />}
                   {loading ? 'Processing...' : 'Confirm Appointment'}
                 </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}