'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBarbers, getServices, getAvailability, createAppointment, TimeSlot } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Check, Calendar, Clock, User, Scissors, AlertCircle } from 'lucide-react'
import { format, addDays } from 'date-fns'

type Barber = { id: number; name: string; title: string; bio: string | null; imageUrl: string | null }
type Service = { id: number; name: string; price: number; duration: number; description: string | null }

const steps = ['Barber', 'Service', 'Date & Time', 'Your Info', 'Confirm']

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [availability, setAvailability] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  useEffect(() => {
    Promise.all([getBarbers(), getServices()]).then(([b, s]) => {
      setBarbers(b)
      setServices(s)
    })
  }, [])

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      setLoading(true)
      getAvailability(selectedBarber.id, format(selectedDate, 'yyyy-MM-dd'))
        .then(slots => {
          setAvailability(slots)
          setSelectedTime(null)
        })
        .finally(() => setLoading(false))
    }
  }, [selectedBarber, selectedDate])

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0))

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedBarber
      case 1: return !!selectedService
      case 2: return !!selectedDate && !!selectedTime
      case 3: return customerName.trim() && customerPhone.trim()
      default: return true
    }
  }

  const handleSubmit = async () => {
    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) return

    setLoading(true)
    try {
      await createAppointment({
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        dateStr: format(selectedDate, 'yyyy-MM-dd'),
        timeStr: selectedTime,
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        isPriority: false
      })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Generate next 14 days for date picker
  const dateOptions = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1))

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-serif text-4xl text-foreground mb-4">Appointment Requested!</h1>
          <p className="text-muted-foreground mb-2">
            Your appointment with <span className="text-foreground">{selectedBarber?.name}</span> has been submitted.
          </p>
          <p className="text-muted-foreground mb-8">
            We'll confirm your booking shortly. You'll receive a confirmation call or text.
          </p>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Return Home
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Book an Appointment</h1>
          <p className="text-muted-foreground">Select your barber and preferred time</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {steps.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${i <= currentStep ? 'bg-accent text-background' : 'bg-border text-muted-foreground'}`}>
                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-xs mt-2 text-muted-foreground hidden md:block">{step}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-accent/10 border border-accent/20 rounded-sm flex gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Please note:</span> Some appointments are booked via phone or walk-in.
            Your selected time slot is not guaranteed until confirmed by our team.
          </p>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px]"
          >
            {/* Step 0: Select Barber */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-accent" /> Choose Your Barber
                </h2>
                <div className="grid gap-4">
                  {barbers.map(barber => (
                    <button
                      key={barber.id}
                      onClick={() => setSelectedBarber(barber)}
                      className={`p-6 border rounded-sm text-left transition-all ${selectedBarber?.id === barber.id
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                        }`}
                    >
                      <h3 className="font-serif text-xl text-foreground">{barber.name}</h3>
                      <p className="text-sm text-accent">{barber.title}</p>
                      {barber.bio && <p className="text-sm text-muted-foreground mt-2">{barber.bio}</p>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
                  <Scissors className="w-6 h-6 text-accent" /> Select a Service
                </h2>
                <div className="grid gap-3">
                  {services.map(service => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-5 border rounded-sm text-left transition-all flex justify-between items-center ${selectedService?.id === service.id
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                        }`}
                    >
                      <div>
                        <h3 className="font-medium text-foreground">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.duration} min</p>
                      </div>
                      <span className="text-xl font-mono text-accent">${service.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-accent" /> Pick a Date & Time
                </h2>

                {/* Date Selection */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Select a date:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dateOptions.map(date => (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 p-3 border rounded-sm text-center transition-all min-w-[70px] ${selectedDate?.toDateString() === date.toDateString()
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                          }`}
                      >
                        <p className="text-xs text-muted-foreground">{format(date, 'EEE')}</p>
                        <p className="text-lg font-medium text-foreground">{format(date, 'd')}</p>
                        <p className="text-xs text-muted-foreground">{format(date, 'MMM')}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Available times for {format(selectedDate, 'EEEE, MMM d')}:
                    </p>
                    {loading ? (
                      <p className="text-muted-foreground">Loading availability...</p>
                    ) : availability.length === 0 ? (
                      <p className="text-muted-foreground">No availability. {selectedBarber?.name} is not working this day.</p>
                    ) : (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {availability.map(slot => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`p-2 border rounded-sm text-sm transition-all ${selectedTime === slot.time
                                ? 'border-accent bg-accent text-background'
                                : slot.available
                                  ? 'border-border hover:border-accent/50 text-foreground'
                                  : 'border-border/50 text-muted-foreground/50 cursor-not-allowed bg-surface'
                              }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Contact Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-foreground mb-6">Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full p-3 bg-surface border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Phone *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="(814) 555-0123"
                      className="w-full p-3 bg-surface border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Email (optional)</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full p-3 bg-surface border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-foreground mb-6">Confirm Your Appointment</h2>
                <div className="p-6 border border-border rounded-sm space-y-4">
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Barber</span>
                    <span className="text-foreground font-medium">{selectedBarber?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Service</span>
                    <span className="text-foreground font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="text-foreground font-medium">
                      {selectedDate && format(selectedDate, 'EEE, MMM d')} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-foreground font-medium">{customerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="text-foreground font-medium">{customerPhone}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-foreground font-medium">Total</span>
                    <span className="text-2xl font-serif text-accent">${selectedService?.price}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  By confirming, you agree that this appointment request is subject to availability.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-accent text-background hover:bg-accent/90 gap-2"
            >
              {loading ? 'Submitting...' : 'Confirm Booking'} <Check className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-accent text-background hover:bg-accent/90 gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
