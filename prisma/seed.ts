import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.appointment.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.dateException.deleteMany()
  await prisma.barber.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  // Create Users (login credentials for barbers)
  const calvinUser = await prisma.user.create({
    data: { username: 'calvin', password: 'shearmagic123' },
  })
  const darrienUser = await prisma.user.create({
    data: { username: 'darrien', password: 'shearmagic123' },
  })
  const danielleUser = await prisma.user.create({
    data: { username: 'danielle', password: 'shearmagic123' },
  })

  // Create Barbers linked to Users
  const calvin = await prisma.barber.create({
    data: {
      name: 'Calvin Berkins',
      title: 'Owner & Master Barber',
      bio: 'Over 30 years of professional experience. Owner and founder of Shear Magic.',
      imageUrl: '/images/calvin.png',
      userId: calvinUser.id,
    },
  })

  const darrien = await prisma.barber.create({
    data: {
      name: 'Darrien Berkins',
      title: 'Barber',
      bio: 'Specializing in modern cuts, fades, and precision styling.',
      imageUrl: '/images/darrien.png',
      userId: darrienUser.id,
    },
  })

  const danielle = await prisma.barber.create({
    data: {
      name: 'Danielle Valentine',
      title: 'Stylist & Barber',
      bio: 'Expert in styling, coloring, and all hair services.',
      imageUrl: '/images/danielle.png',
      userId: danielleUser.id,
    },
  })

  const barbers = [calvin, darrien, danielle]

  // Create Services
  const servicesData = [
    { name: 'Adult Haircut', price: 20.0, duration: 30, description: 'Classic haircut with consultation' },
    { name: "Kid's Cut", price: 15.0, duration: 30, description: 'Haircut for children 12 and under' },
    { name: 'Hot Shave', price: 25.0, duration: 30, description: 'Traditional hot towel straight razor shave' },
    { name: 'Beard Trim', price: 5.0, duration: 15, description: 'Shape and trim your beard' },
    { name: 'Razor Edge Up', price: 3.0, duration: 15, description: 'Clean up your edges' },
    { name: 'Design', price: 3.0, duration: 15, description: 'Custom hair design or pattern' },
    { name: 'Coloring', price: 30.0, duration: 60, description: 'Full hair coloring service' },
  ]

  for (const s of servicesData) {
    await prisma.service.create({ data: s })
  }

  // Create Schedules (Mon-Fri 10am-5pm, Sat 9am-2pm)
  for (const barber of barbers) {
    for (let day = 0; day <= 6; day++) {
      let isWorking = false
      let startTime = '10:00'
      let endTime = '17:00'

      if (day >= 1 && day <= 5) {
        // Mon-Fri
        isWorking = true
        startTime = '10:00'
        endTime = '17:00'
      } else if (day === 6) {
        // Saturday
        isWorking = true
        startTime = '09:00'
        endTime = '14:00'
      }
      // Sunday closed

      await prisma.schedule.create({
        data: {
          barberId: barber.id,
          dayOfWeek: day,
          startTime,
          endTime,
          isWorking,
        },
      })
    }
  }

  console.log('Seeding finished.')
  console.log('Barber logins:')
  console.log('  calvin / shearmagic123')
  console.log('  darrien / shearmagic123')
  console.log('  danielle / shearmagic123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
