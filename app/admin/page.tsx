'use client'

import { useState, useEffect } from 'react'
import { getAllAppointments, getSchedules, updateSchedule } from './actions'
import { updateAppointmentStatus } from '@/app/actions'
import { format } from 'date-fns'
import { Lock, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  
  const [appointments, setAppointments] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    setLoading(true)
    const [apptData, schedData] = await Promise.all([
      getAllAppointments(),
      getSchedules()
    ])
    setAppointments(apptData)
    setSchedules(schedData)
    setLoading(false)
  }

  const handleStatusChange = async (id: number, status: 'CONFIRMED' | 'DENIED' | 'CANCELLED') => {
      // Optimistic Update
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      await updateAppointmentStatus(id, status)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 border border-foreground flex items-center justify-center">
              <Lock className="text-foreground w-6 h-6" strokeWidth={1} />
            </div>
          </div>
          
          <h1 className="text-4xl font-serif text-foreground mb-2">Restricted Area</h1>
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.25em] mb-12">
            Management Protocol Only
          </p>
          
          <div className="space-y-6">
            <Input 
              type="password" 
              className="text-center text-2xl tracking-[1em] py-4 h-16 font-serif"
              placeholder="••••"
              value={pin}
              onChange={e => setPin(e.target.value)}
            />
            
            <Button 
              onClick={() => {
                if (pin === '1234') setIsAuthenticated(true)
                else alert('Access Denied.')
              }}
              className="w-full"
              size="lg"
            >
              Authenticate
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleScheduleUpdate = async (id: number, field: string, value: any) => {
    // Optimistic update
    const newSchedules = schedules.map(s => s.id === id ? { ...s, [field]: value } : s)
    setSchedules(newSchedules)
    
    // Find the full object to send
    const target = newSchedules.find(s => s.id === id)
    if (target) {
      await updateSchedule(id, {
        startTime: target.startTime,
        endTime: target.endTime,
        isWorking: target.isWorking
      })
    }
  }

  // Group schedules by Barber
  const schedulesByBarber: Record<string, any[]> = {}
  schedules.forEach(s => {
    if (!schedulesByBarber[s.barber.name]) schedulesByBarber[s.barber.name] = []
    schedulesByBarber[s.barber.name].push(s)
  })

  return (
    <div className="min-h-screen bg-background p-8 font-sans relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-noise"></div>
      
      <div className="max-w-[1600px] mx-auto relative z-10">
        <header className="flex justify-between items-end mb-16 border-b border-foreground/10 pb-8">
           <div>
             <span className="text-accent font-mono text-[10px] uppercase tracking-[0.25em] block mb-2">System Control</span>
             <h1 className="text-5xl font-serif text-foreground">Dashboard</h1>
           </div>
           <Button variant="outline" onClick={() => setIsAuthenticated(false)} className="gap-2">
             <LogOut size={14} />
             Logout
           </Button>
        </header>

        {/* APPOINTMENTS */}
        <section className="mb-24">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-3xl font-serif text-foreground">Upcoming Rituals</h2>
            <span className="font-mono text-xs text-muted-foreground">{appointments.length} Sessions Active</span>
          </div>
          
          <div className="border-t border-foreground/20">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground uppercase font-mono text-[10px] tracking-[0.1em]">
                <tr>
                  <th className="py-6 pr-4 font-normal">Date/Time</th>
                  <th className="py-6 px-4 font-normal">Client</th>
                  <th className="py-6 px-4 font-normal">Architect</th>
                  <th className="py-6 px-4 font-normal">Service</th>
                  <th className="py-6 px-4 font-normal">Status</th>
                  <th className="py-6 px-4 font-normal">Actions</th>
                  <th className="py-6 pl-4 font-normal text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {appointments.slice(0, 10).map(appt => (
                  <tr key={appt.id} className="group hover:bg-foreground/[0.02] transition-colors">
                    <td className="py-6 pr-4 font-mono text-foreground font-medium">
                      {format(new Date(appt.startTime), 'MMM d, h:mm a')}
                    </td>
                    <td className="py-6 px-4">
                      <div className="font-serif text-lg text-foreground">{appt.customerName}</div>
                      <div className="text-muted-foreground font-mono text-[10px] tracking-wide">{appt.customerPhone}</div>
                    </td>
                    <td className="py-6 px-4 font-sans text-sm text-foreground/80">{appt.barber.name}</td>
                    <td className="py-6 px-4 font-sans text-sm text-foreground/80">{appt.service.name}</td>
                    <td className="py-6 px-4">
                      <span className={`inline-flex items-center px-2 py-1 text-[10px] uppercase tracking-widest border ${appt.status === 'PENDING' ? 'border-amber-200 text-amber-700 bg-amber-50' : appt.status === 'CONFIRMED' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-red-200 text-red-700 bg-red-50'}`}>
                        {appt.status} {appt.isPriority && ' // OVERRIDE'}
                      </span>
                    </td>
                    <td className="py-6 px-4 flex gap-2">
                        {appt.status === 'PENDING' && (
                            <>
                                <Button size="sm" onClick={() => handleStatusChange(appt.id, 'CONFIRMED')} className="bg-emerald-600 hover:bg-emerald-700 h-8 text-[10px]">Accept</Button>
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(appt.id, 'DENIED')} className="text-red-600 hover:bg-red-50 h-8 text-[10px]">Deny</Button>
                            </>
                        )}
                        {appt.status === 'CONFIRMED' && (
                             <Button size="sm" variant="ghost" onClick={() => handleStatusChange(appt.id, 'CANCELLED')} className="text-muted-foreground hover:text-red-600 h-8 text-[10px]">Cancel</Button>
                        )}
                    </td>
                    <td className="py-6 pl-4 font-mono text-foreground text-right">${appt.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && <p className="py-12 text-center text-muted-foreground font-mono text-xs uppercase tracking-widest">No active sessions.</p>}
          </div>
        </section>

        {/* SCHEDULES */}
        <section>
          <h2 className="text-3xl font-serif text-foreground mb-12">Temporal Configuration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {Object.keys(schedulesByBarber).map(barberName => (
              <div key={barberName} className="space-y-6">
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] border-b border-foreground pb-4">{barberName}</h3>
                <div className="space-y-4">
                  {schedulesByBarber[barberName].map(s => (
                    <div key={s.id} className={`group flex items-center justify-between p-4 border transition-all duration-300 ${s.isWorking ? 'border-foreground/10 bg-white' : 'border-transparent bg-foreground/[0.03] opacity-60'}`}>
                      <div className="flex items-center gap-4">
                        <input 
                          type="checkbox" 
                          checked={s.isWorking} 
                          onChange={e => handleScheduleUpdate(s.id, 'isWorking', e.target.checked)}
                          className="w-4 h-4 accent-foreground border-gray-300 rounded-none cursor-pointer"
                        />
                        <span className="font-serif text-lg text-foreground">
                          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][s.dayOfWeek]}
                        </span>
                      </div>
                      
                      {s.isWorking ? (
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <input 
                            type="time" 
                            value={s.startTime} 
                            onChange={e => handleScheduleUpdate(s.id, 'startTime', e.target.value)}
                            className="bg-transparent border-b border-foreground/20 text-foreground w-16 text-center focus:border-accent outline-none transition-colors"
                          />
                          <span className="text-muted-foreground">-</span>
                          <input 
                            type="time" 
                            value={s.endTime} 
                            onChange={e => handleScheduleUpdate(s.id, 'endTime', e.target.value)}
                            className="bg-transparent border-b border-foreground/20 text-foreground w-16 text-center focus:border-accent outline-none transition-colors"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
                          Closed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
