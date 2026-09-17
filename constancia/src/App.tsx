import { useEffect, useState } from 'react'
import type { Habit, NewHabit } from './types'
import { createHabit, deleteHabit, fetchHabits, toggleHabit } from './lib/habitsApi'
import { HabitForm } from './components/HabitForm'
import { HabitList } from './components/HabitList'
import './index.css'

const today = new Date().toLocaleDateString('es-EC', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetchHabits()
      .then((data) => {
        if (active) setHabits(data)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function handleCreate(newHabit: NewHabit) {
    setSubmitting(true)
    setError(null)
    try {
      const created = await createHabit(newHabit)
      setHabits((prev) => [created, ...prev])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggle(habit: Habit) {
    setBusyId(habit.id)
    setError(null)
    try {
      const updated = await toggleHabit(habit)
      setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id)
    setError(null)
    try {
      await deleteHabit(id)
      setHabits((prev) => prev.filter((h) => h.id !== id))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  const doneCount = habits.filter((h) => h.completed_today).length

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">{today}</p>
        <h1>Constancia</h1>
        <p className="page__subtitle">
          {habits.length === 0
            ? 'Un lugar simple para sostener tus rutinas.'
            : `${doneCount} de ${habits.length} hábitos cumplidos hoy.`}
        </p>
      </header>

      <HabitForm onCreate={handleCreate} submitting={submitting} />

      {error && (
        <p className="feedback feedback--error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="feedback">Cargando tus hábitos...</p>
      ) : (
        <HabitList habits={habits} onToggle={handleToggle} onDelete={handleDelete} busyId={busyId} />
      )}
    </div>
  )
}
