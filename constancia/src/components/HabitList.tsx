import type { Habit } from '../types'
import { HabitItem } from './HabitItem'

interface HabitListProps {
  habits: Habit[]
  onToggle: (habit: Habit) => void
  onDelete: (id: string) => void
  busyId: string | null
}

export function HabitList({ habits, onToggle, onDelete, busyId }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <p className="empty-state">
        Todavía no tienes hábitos. Agrega el primero arriba para empezar a construir tu racha.
      </p>
    )
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onDelete={onDelete}
          busy={busyId === habit.id}
        />
      ))}
    </ul>
  )
}
