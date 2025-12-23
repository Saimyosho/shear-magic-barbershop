'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  getCurrentBarber,
  logoutBarber,
  getAppointmentsByBarber,
  updateAppointmentStatus,
  blockDate,
  getBlockedDates,
  unblockDate
} from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Check,
  X,
  LogOut,
  Clock,
  User,
  Phone,
  Ban,
  Trash2
} from 'lucide-react'
import { format, isFuture, isToday, addDays } from 'date-fns'
import { useRouter } from 'next/navigation'

type Appointment = {
  id: number
  startTime: Date
  endTime: Date
  customerName: string
  customerPhone: string
  customerEmail: string | null
  status: string
  isPriority: boolean
  totalPrice: number
  service: { name: string; duration: number }
}

type BlockedDate = {
  id: number
  date: Date
  reason: string | null
}

export default function AdminDashboard() {
  const [barber, setBarber] = useState<{ id: number; name: string } | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'appointments' | 'availability'>('appointments')
  const [blockDateInput, setBlockDateInput] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const b = await getCurrentBarber()
    if (!b) {
      router.push('/admin/login')
      return
    }
    setBarber(b)
    await loadData(b.id)
    setLoading(false)
  }

  const loadData = async (barberId: number) => {
    const [appts, blocked] = await Promise.all([
      getAppointmentsByBarber(barberId),
      getBlockedDates(barberId)
    ])
    setAppointments(appts as any)
    setBlockedDates(blocked as any)
  }

  const handleLogout = async () => {
    await logoutBarber()
    router.push('/admin/login')
  }

  const handleStatusChange = async (id: number, status: 'CONFIRMED' | 'DENIED' | 'CANCELLED') => {
    await updateAppointmentStatus(id, status)
    if (barber) await loadData(barber.id)
  }

  const handleBlockDate = async () => {
    if (!barber || !blockDateInput) return
    await blockDate(barber.id, blockDateInput, blockReason || undefined)
    setBlockDateInput('')
    setBlockReason('')
    await loadData(barber.id)
  }

  const handleUnblockDate = async (dateStr: string) => {
    if (!barber) return
    await unblockDate(barber.id, dateStr)
    await loadData(barber.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const pendingAppts = appointments.filter(a => a.status === 'PENDING' && (isFuture(new Date(a.startTime)) || isToday(new Date(a.startTime))))
  const upcomingAppts = appointments.filter(a => a.status === 'CONFIRMED' && (isFuture(new Date(a.startTime)) || isToday(new Date(a.startTime))))
  const pastAppts = appointments.filter(a => !isFuture(new Date(a.startTime)) && !isToday(new Date(a.startTime)))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl text-foreground">Barber Portal</h1>
            <p className="text-muted-foreground text-sm">Welcome, {barber?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${activeTab === 'appointments'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${activeTab === 'availability'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Availability
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-8">
            {/* Pending */}
            {pendingAppts.length > 0 && (
              <section>
                <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Pending Requests ({pendingAppts.length})
                </h2>
                <div className="space-y-3">
                  {pendingAppts.map(appt => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={appt}
                      onConfirm={() => handleStatusChange(appt.id, 'CONFIRMED')}
                      onDeny={() => handleStatusChange(appt.id, 'DENIED')}
                      showActions
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming */}
            <section>
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Upcoming ({upcomingAppts.length})
              </h2>
              {upcomingAppts.length === 0 ? (
                <p className="text-muted-foreground">No upcoming confirmed appointments.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppts.map(appt => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={appt}
                      onCancel={() => handleStatusChange(appt.id, 'CANCELLED')}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="space-y-8">
            {/* Block Date */}
            <section>
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-500" /> Block a Day Off
              </h2>
              <div className="p-4 bg-surface border border-border rounded-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Date</label>
                    <input
                      type="date"
                      value={blockDateInput}
                      onChange={e => setBlockDateInput(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full p-2 bg-background border border-border rounded-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Reason (optional)</label>
                    <input
                      type="text"
                      value={blockReason}
                      onChange={e => setBlockReason(e.target.value)}
                      placeholder="e.g., Vacation"
                      className="w-full p-2 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleBlockDate} disabled={!blockDateInput} className="bg-accent text-background hover:bg-accent/90">
                      Block Day
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Blocked Dates List */}
            <section>
              <h2 className="text-lg font-medium text-foreground mb-4">Blocked Dates</h2>
              {blockedDates.length === 0 ? (
                <p className="text-muted-foreground">No blocked dates.</p>
              ) : (
                <div className="space-y-2">
                  {blockedDates.map(bd => (
                    <div key={bd.id} className="flex justify-between items-center p-3 bg-surface border border-border rounded-sm">
                      <div>
                        <span className="text-foreground">{format(new Date(bd.date), 'EEEE, MMMM d, yyyy')}</span>
                        {bd.reason && <span className="text-muted-foreground ml-2">— {bd.reason}</span>}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnblockDate(format(new Date(bd.date), 'yyyy-MM-dd'))}
                        className="gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

function AppointmentCard({
  appointment,
  showActions = false,
  onConfirm,
  onDeny,
  onCancel
}: {
  appointment: Appointment
  showActions?: boolean
  onConfirm?: () => void
  onDeny?: () => void
  onCancel?: () => void
}) {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-500',
    CONFIRMED: 'bg-green-500/20 text-green-500',
    CANCELLED: 'bg-red-500/20 text-red-500',
    DENIED: 'bg-red-500/20 text-red-500',
    BLOCKED: 'bg-gray-500/20 text-gray-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-surface border border-border rounded-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-foreground font-medium">{appointment.service.name}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {format(new Date(appointment.startTime), 'EEE, MMM d')} at {format(new Date(appointment.startTime), 'h:mm a')}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[appointment.status] || ''}`}>
          {appointment.status}
        </span>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><User className="w-4 h-4" /> {appointment.customerName}</span>
        <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {appointment.customerPhone}</span>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button size="sm" onClick={onConfirm} className="bg-green-600 hover:bg-green-700 text-white gap-1">
            <Check className="w-4 h-4" /> Confirm
          </Button>
          <Button size="sm" variant="outline" onClick={onDeny} className="text-red-500 border-red-500/50 hover:bg-red-500/10 gap-1">
            <X className="w-4 h-4" /> Deny
          </Button>
        </div>
      )}

      {onCancel && appointment.status === 'CONFIRMED' && (
        <div className="pt-3 border-t border-border">
          <Button size="sm" variant="outline" onClick={onCancel} className="text-muted-foreground gap-1">
            Cancel Appointment
          </Button>
        </div>
      )}
    </motion.div>
  )
}
