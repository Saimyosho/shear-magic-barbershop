'use server'

import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, addMinutes, format, parse, isBefore, isEqual } from 'date-fns'
import { revalidatePath } from 'next/cache'

export async function getBarbers() {
  return await prisma.barber.findMany()
}

export async function getServices() {
  return await prisma.service.findMany()
}

export type TimeSlot = {
  time: string // "10:00"
  available: boolean
  isPriorityEligible: boolean // If booked, can we squeeze in?
}

export async function getAvailability(barberId: number, dateStr: string): Promise<TimeSlot[]> {
  // dateStr expected in "YYYY-MM-DD"
  const date = new Date(dateStr)
  const dayOfWeek = date.getDay() // 0=Sun, 1=Mon...

  // 1. Get Schedule
  const schedule = await prisma.schedule.findFirst({
    where: {
      barberId,
      dayOfWeek,
    },
  })

  if (!schedule || !schedule.isWorking) {
    return [] // Closed
  }

  // 2. Get Existing Appointments (Confirmed or Pending)
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      startTime: {
        gte: startOfDay(date),
        lt: endOfDay(date),
      },
      status: {
        notIn: ['CANCELLED', 'DENIED'],
      },
    },
  })

  // 3. Generate Slots
  const slots: TimeSlot[] = []
  
  const start = parse(schedule.startTime, 'HH:mm', date)
  const end = parse(schedule.endTime, 'HH:mm', date)

  let current = start
  while (isBefore(current, end)) {
    const timeString = format(current, 'HH:mm')
    
    // Check collision
    const isBooked = appointments.some(appt => {
      const apptStart = format(appt.startTime, 'HH:mm')
      return apptStart === timeString
    })

    slots.push({
      time: timeString,
      available: !isBooked,
      isPriorityEligible: isBooked, // If booked, it's eligible for priority squeeze
    })

    current = addMinutes(current, 30)
  }

  return slots
}

export async function createAppointment(data: {
  barberId: number
  serviceId: number
  dateStr: string // YYYY-MM-DD
  timeStr: string // HH:mm
  customerName: string
  customerPhone: string
  isPriority: boolean
}) {
  const { barberId, serviceId, dateStr, timeStr, customerName, customerPhone, isPriority } = data
  
  // Calculate start and end
  const start = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date())
  
  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service) throw new Error('Service not found')

  const end = addMinutes(start, service.duration)
  
  // Calculate Price
  let totalPrice = service.price
  if (isPriority) {
    totalPrice += 15 // Priority Fee
  }

  const appointment = await prisma.appointment.create({
    data: {
      barberId,
      serviceId,
      startTime: start,
      endTime: end,
      customerName,
      customerPhone,
      isPriority,
      totalPrice,
      status: 'PENDING' // Now defaults to PENDING
    }
  })

  // Send Notification Stub
  await sendSMSNotification(appointment.id, barberId, customerName, `${dateStr} @ ${timeStr}`)
  
  return appointment
}

// Stub for SMS Notification
async function sendSMSNotification(apptId: number, barberId: number, customerName: string, time: string) {
    // In a real app, you would look up the barber's phone number and use Twilio/AWS SNS
    const barber = await prisma.barber.findUnique({ where: { id: barberId } })
    console.log(`[SMS STUB] To Barber (${barber?.name}): New Appointment Request from ${customerName} at ${time}. Status: PENDING.`)
}

// Admin Action: Update Status
export async function updateAppointmentStatus(id: number, status: 'CONFIRMED' | 'DENIED' | 'CANCELLED') {
    await prisma.appointment.update({
        where: { id },
        data: { status }
    })
    revalidatePath('/admin')
}