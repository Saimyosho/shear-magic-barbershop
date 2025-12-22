import { getBarbers, getServices } from '@/app/actions'
import LandingPage from '@/app/components/LandingPage'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const barbers = await getBarbers()
  const services = await getServices()

  return <LandingPage barbers={barbers} services={services} />
}