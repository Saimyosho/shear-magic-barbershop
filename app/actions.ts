'use server'

import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, addMinutes, format, parse, isBefore } from 'date-fns'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// ============ PUBLIC ACTIONS ============

export async function getBarbers() {
  try {
    return await prisma.barber.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        imageUrl: true,
      }
    })
  } catch (error) {
    console.error('Failed to fetch barbers:', error)
    // Return fallback barbers for build time
    return [
      { id: 1, name: 'Calvin Berkins', title: 'Master Barber', bio: '30+ years experience', imageUrl: null },
      { id: 2, name: 'Darrien Berkins', title: 'Senior Barber', bio: 'Fade specialist', imageUrl: null },
      { id: 3, name: 'Danielle Valentine', title: 'Stylist', bio: 'All styles welcome', imageUrl: null },
    ]
  }
}

export async function getServices() {
  try {
    return await prisma.service.findMany()
  } catch (error) {
    console.error('Failed to fetch services:', error)
    // Return fallback services for build time
    return [
      { id: 1, name: 'Haircut', price: 20, duration: 30, description: 'Classic haircut' },
      { id: 2, name: 'Skin Fade', price: 25, duration: 45, description: 'Sharp skin fade' },
      { id: 3, name: 'Shave', price: 15, duration: 20, description: 'Hot towel shave' },
      { id: 4, name: 'Haircut & Beard', price: 35, duration: 45, description: 'Full grooming' },
    ]
  }
}

export type TimeSlot = {
  time: string
  available: boolean
  isPriorityEligible: boolean
}

export async function getAvailability(barberId: number, dateStr: string): Promise<TimeSlot[]> {
  const date = new Date(dateStr)
  const dayOfWeek = date.getDay()

  // 1. Get Schedule
  const schedule = await prisma.schedule.findFirst({
    where: { barberId, dayOfWeek },
  })

  if (!schedule || !schedule.isWorking) {
    return []
  }

  // 2. Check for date exceptions (blocked dates)
  const dateException = await prisma.dateException.findFirst({
    where: {
      barberId,
      date: {
        gte: startOfDay(date),
        lt: endOfDay(date),
      },
    },
  })

  if (dateException) {
    return [] // Barber is unavailable this day
  }

  // 3. Get existing appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      startTime: {
        gte: startOfDay(date),
        lt: endOfDay(date),
      },
      status: { notIn: ['CANCELLED', 'DENIED'] },
    },
  })

  // 4. Generate slots
  const slots: TimeSlot[] = []
  const start = parse(schedule.startTime, 'HH:mm', date)
  const end = parse(schedule.endTime, 'HH:mm', date)

  let current = start
  while (isBefore(current, end)) {
    const timeString = format(current, 'HH:mm')
    const isBooked = appointments.some(appt =>
      format(appt.startTime, 'HH:mm') === timeString
    )

    slots.push({
      time: timeString,
      available: !isBooked,
      isPriorityEligible: isBooked,
    })

    current = addMinutes(current, 30)
  }

  return slots
}

export async function createAppointment(data: {
  barberId: number
  serviceId: number
  dateStr: string
  timeStr: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  isPriority: boolean
}) {
  const { barberId, serviceId, dateStr, timeStr, customerName, customerPhone, customerEmail, isPriority } = data

  const start = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date())

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service) throw new Error('Service not found')

  const end = addMinutes(start, service.duration)

  let totalPrice = service.price
  if (isPriority) totalPrice += 15

  const appointment = await prisma.appointment.create({
    data: {
      barberId,
      serviceId,
      startTime: start,
      endTime: end,
      customerName,
      customerPhone,
      customerEmail,
      isPriority,
      totalPrice,
      status: 'PENDING'
    },
    include: { barber: true, service: true }
  })

  // Send notifications (console stub)
  await sendNotification(appointment)

  return appointment
}

async function sendNotification(appointment: any) {
  console.log('='.repeat(50))
  console.log('📧 EMAIL NOTIFICATION (STUB)')
  console.log('='.repeat(50))
  console.log(`To Barber: ${appointment.barber.name}`)
  console.log(`New Appointment Request:`)
  console.log(`  Customer: ${appointment.customerName}`)
  console.log(`  Phone: ${appointment.customerPhone}`)
  console.log(`  Service: ${appointment.service.name}`)
  console.log(`  Date/Time: ${format(appointment.startTime, 'PPpp')}`)
  console.log(`  Status: PENDING - Awaiting confirmation`)
  console.log('='.repeat(50))
}

// ============ ADMIN ACTIONS ============

export async function loginBarber(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: { barber: true }
  })

  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid credentials' }
  }

  if (!user.barber) {
    return { success: false, error: 'No barber profile linked' }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set('barber_session', JSON.stringify({
    id: user.barber.id,
    name: user.barber.name,
    userId: user.id
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  return { success: true, barber: user.barber }
}

export async function logoutBarber() {
  const cookieStore = await cookies()
  cookieStore.delete('barber_session')
  return { success: true }
}

export async function getCurrentBarber() {
  const cookieStore = await cookies()
  const session = cookieStore.get('barber_session')

  if (!session) return null

  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}

export async function getAppointmentsByBarber(barberId: number) {
  return await prisma.appointment.findMany({
    where: { barberId },
    include: { service: true },
    orderBy: { startTime: 'asc' }
  })
}

export async function updateAppointmentStatus(id: number, status: 'CONFIRMED' | 'DENIED' | 'CANCELLED') {
  await prisma.appointment.update({
    where: { id },
    data: { status }
  })
  revalidatePath('/admin')
}

export async function blockTimeSlot(barberId: number, dateStr: string, startTime: string, endTime: string) {
  const date = parse(`${dateStr} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date())
  const endDate = parse(`${dateStr} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date())

  await prisma.appointment.create({
    data: {
      barberId,
      serviceId: 1, // Placeholder
      startTime: date,
      endTime: endDate,
      customerName: 'BLOCKED',
      customerPhone: '--',
      status: 'BLOCKED',
      isPriority: false,
      totalPrice: 0,
      notes: 'Blocked by barber'
    }
  })
  revalidatePath('/admin')
}

export async function blockDate(barberId: number, dateStr: string, reason?: string) {
  const date = new Date(dateStr)

  await prisma.dateException.create({
    data: {
      barberId,
      date: startOfDay(date),
      reason: reason || 'Unavailable'
    }
  })
  revalidatePath('/admin')
}

export async function unblockDate(barberId: number, dateStr: string) {
  const date = new Date(dateStr)

  await prisma.dateException.deleteMany({
    where: {
      barberId,
      date: {
        gte: startOfDay(date),
        lt: endOfDay(date)
      }
    }
  })
  revalidatePath('/admin')
}

export async function getBlockedDates(barberId: number) {
  return await prisma.dateException.findMany({
    where: { barberId },
    orderBy: { date: 'asc' }
  })
}

export async function updateBarberSchedule(barberId: number, dayOfWeek: number, data: {
  isWorking: boolean
  startTime?: string
  endTime?: string
}) {
  await prisma.schedule.upsert({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
    update: data,
    create: {
      barberId,
      dayOfWeek,
      startTime: data.startTime || '10:00',
      endTime: data.endTime || '17:00',
      isWorking: data.isWorking
    }
  })
  revalidatePath('/admin')
}

export async function getBarberSchedule(barberId: number) {
  return await prisma.schedule.findMany({
    where: { barberId },
    orderBy: { dayOfWeek: 'asc' }
  })
}