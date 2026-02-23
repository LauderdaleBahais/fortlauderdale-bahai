'use client'

import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import type { Event } from '@/lib/types'

type Props = {
  events: Event[]
}

type SelectedEvent = Event | null

/** Normalize Supabase/Postgres timestamp to strict ISO 8601 for FullCalendar. */
function toISO8601(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') return ''
  const s = value.trim()
  if (!s) return ''
  // Already has T → likely ISO 8601; ensure timezone suffix
  if (s.includes('T')) {
    const hasTz = s.endsWith('Z') || /[+-]\d{2}:?\d{2}$/.test(s)
    return hasTz ? s : s + 'Z'
  }
  // Postgres space format: "2025-02-26 00:00:00+00" or "2025-02-26 00:00:00.000000+00"
  const spaceIdx = s.indexOf(' ')
  const datePart = spaceIdx >= 0 ? s.slice(0, spaceIdx) : s
  let timePart = spaceIdx >= 0 ? s.slice(spaceIdx + 1).trim() : ''
  if (timePart) {
    timePart = timePart.replace(/\+\d{2}:?\d{0,2}$/, (m) => (m === '+00' || m === '+00:00' ? 'Z' : m))
    if (timePart && !/Z$|[+-]\d{2}:?\d{2}$/.test(timePart)) timePart = timePart + 'Z'
  }
  if (!datePart || datePart.length < 10) return ''
  return timePart ? `${datePart}T${timePart}` : datePart
}

/** Return YYYY-MM-DD from any timestamp string. */
function toDateOnly(value: string | null | undefined): string {
  const iso = toISO8601(value)
  if (!iso) return ''
  return iso.substring(0, 10)
}

/** Add days to a YYYY-MM-DD string. */
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return date.toISOString().substring(0, 10)
}

export default function EventsCalendar({ events }: Props) {
  const [selected, setSelected] = useState<SelectedEvent>(null)
  const calendarRef = useRef<FullCalendar>(null)

  const normalizedEvents = Array.isArray(events) ? events : []

  const calendarEvents = normalizedEvents.map((e) => {
    const startTime = typeof e.start_time === 'string' ? e.start_time : ''
    const startISO = toISO8601(startTime)
    const isAllDay =
      e.is_holy_day ||
      startTime.includes('T00:00:00') ||
      startTime.includes(' 00:00:00')

    if (isAllDay) {
      const startDate = toDateOnly(startTime) || startISO.substring(0, 10)
      if (!startDate || startDate.length !== 10) {
        console.warn('[EventsCalendar] Skipping event with invalid start date:', e.id, e.title, startTime)
        return null
      }
      let endDate: string | undefined
      if (e.end_time) {
        const endDateOnly = toDateOnly(e.end_time)
        if (endDateOnly) {
          // FullCalendar all-day end is exclusive; add 1 day to stored end date.
          endDate = addDays(endDateOnly, 1)
        }
      }
      return {
        id: e.id,
        title: e.title,
        start: startDate,
        end: endDate,
        allDay: true,
        classNames: e.is_holy_day ? ['fc-event-holy-day'] : ['fc-event-community'],
        extendedProps: e,
      }
    }

    const start = startISO || startTime
    const end = e.end_time ? toISO8601(e.end_time) : undefined
    if (!start) {
      console.warn('[EventsCalendar] Skipping event with invalid start:', e.id, e.title)
      return null
    }
    return {
      id: e.id,
      title: e.title,
      start,
      end,
      allDay: false,
      classNames: ['fc-event-community'],
      extendedProps: e,
    }
  }).filter(Boolean) as Array<{
    id: string
    title: string
    start: string
    end?: string
    allDay: boolean
    classNames: string[]
    extendedProps: Event
  }>

  // Log for verification (browser DevTools console)
  console.log('[EventsCalendar] Fetched events (props):', normalizedEvents.length, normalizedEvents)
  console.log('[EventsCalendar] FullCalendar event objects:', calendarEvents)

  function handleEventClick(info: EventClickArg) {
    const raw = info.event.extendedProps as Event
    setSelected(raw)
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth',
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={1.8}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#c8942a] inline-block" />
          <span className="text-gray-600">Holy Day</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#2a7c7a] inline-block" />
          <span className="text-gray-600">Community Event</span>
        </div>
      </div>

      {/* Event detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.is_holy_day && (
              <span className="inline-block bg-[#c8942a]/10 text-[#c8942a] text-xs font-medium px-2 py-0.5 rounded mb-3">
                Holy Day
              </span>
            )}
            <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-3">
              {selected.title}
            </h2>
            <div className="space-y-2 mb-4 text-sm">
              <p className="text-[#2a7c7a] font-medium">
                {(() => {
                  const isAllDay =
                    selected.is_holy_day ||
                    selected.start_time.includes('T00:00:00') ||
                    selected.start_time.includes(' 00:00:00')

                  if (isAllDay) {
                    // Parse date from UTC string without timezone conversion
                    const [year, month, day] = selected.start_time.substring(0, 10).split('-').map(Number)
                    const start = new Date(year, month - 1, day)
                    let label = start.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                    if (selected.end_time) {
                      const [ey, em, ed] = selected.end_time.substring(0, 10).split('-').map(Number)
                      const end = new Date(ey, em - 1, ed)
                      if (end.getTime() !== start.getTime()) {
                        label += ' – ' + end.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      }
                    }
                    return label
                  }

                  return new Date(selected.start_time).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  }) + (selected.end_time
                    ? ' – ' + new Date(selected.end_time).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZoneName: 'short',
                      })
                    : '')
                })()}
              </p>
              {selected.location && (
                <p className="text-gray-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {selected.location}
                </p>
              )}
            </div>
            {selected.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{selected.description}</p>
            )}
            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full bg-[#1a2744] hover:bg-[#243460] text-white py-2 rounded font-medium text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
