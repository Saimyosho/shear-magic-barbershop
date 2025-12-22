import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Barbers
  const calvin = await prisma.barber.create({
    data: {
      name: 'Calvin Berkins',
      title: 'Owner & Master Barber',
      bio: 'Over 30 years of professional experience.',
      imageUrl: '/images/calvin.jpg', // Placeholder
    },
  })

  const darrien = await prisma.barber.create({
    data: {
      name: 'Darrien Berkins',
      title: 'Barber',
      bio: 'Specializing in modern cuts and fades.',
      imageUrl: '/images/darrien.jpg', // Placeholder
    },
  })

  const danielle = await prisma.barber.create({
    data: {
      name: 'Danielle Valentine',
      title: 'Salonist & Barber',
      bio: 'Expert in styling and coloring.',
      imageUrl: '/images/danielle.jpg', // Placeholder
    },
  })

  const barbers = [calvin, darrien, danielle]

  // Create Services
  const servicesData = [
    { name: 'Adult Haircut', price: 20.0, duration: 30 },
    { name: "Kid's Cut", price: 15.0, duration: 30 },
    { name: 'Hot Shave', price: 25.0, duration: 30 },
    { name: 'Beard Trim', price: 5.0, duration: 15 },
    { name: 'Razor Edge Up', price: 3.0, duration: 15 },
    { name: 'Design', price: 3.0, duration: 15 },
    { name: 'Coloring', price: 30.0, duration: 60 },
  ]

  for (const s of servicesData) {
    await prisma.service.create({ data: s })
  }

  // Create Schedules (Mon-Fri 10am-5pm)
  // 0=Sun, 1=Mon, ..., 6=Sat
  // User req: Mon-Fri 10-5
  for (const barber of barbers) {
    for (let day = 0; day <= 6; day++) {
      const isWorkDay = day >= 1 && day <= 5 // Mon(1) to Fri(5)
      await prisma.schedule.create({
        data: {
          barberId: barber.id,
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '17:00',
          isWorking: isWorkDay,
        },
      })
    }
  }

  console.log('Seeding finished.')
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
