import { getBarbers, getServices } from '@/app/actions'
import BookingWizard from '@/app/components/BookingWizard'
import Navigation from '@/app/components/Navigation'

export const dynamic = 'force-dynamic'

export default async function BookPage() {
  const barbers = await getBarbers()
  const services = await getServices()

  return (
    <main className="min-h-screen bg-black selection:bg-gold-500 selection:text-black overflow-hidden relative">
      <Navigation />
      
      {/* Atmosphere Layers */}
      <div className="absolute inset-0 z-0">
           <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-neutral-800/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-gold-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-24 px-4">
        <BookingWizard barbers={barbers} services={services} />
      </div>
    </main>
  )
}
