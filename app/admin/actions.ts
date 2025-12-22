'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAllAppointments() {
  return await prisma.appointment.findMany({
    orderBy: { startTime: 'desc' },
    include: {
      barber: true,
      service: true
    }
  })
}

export async function getSchedules() {
  return await prisma.schedule.findMany({
    orderBy: [{ barberId: 'asc' }, { dayOfWeek: 'asc' }],
    include: { barber: true }
  })
}

export async function updateSchedule(id: number, data: { startTime: string, endTime: string, isWorking: boolean }) {
  await prisma.schedule.update({
    where: { id },
    data
  })
  revalidatePath('/admin')
  revalidatePath('/book') // Revalidate booking availability
}
