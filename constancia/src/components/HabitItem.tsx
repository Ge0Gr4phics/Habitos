import type { Habit } from '../types'

interface HabitItemProps {
  habit: Habit
  onToggle: (habit: Habit) => void
  onDelete: (id: string) => void
  busy: boolean
}

export function HabitItem({ habit, onToggle, onDelete, busy }: HabitItemProps) {
  return (
    <li className={`habit-row${habit.completed_today ? ' habit-row--done' : ''}`}>
      <button
        className="habit-row__toggle"
        onClick={() => onToggle(habit)}
        disabled={busy}
        aria-pressed={habit.completed_today}
        aria-label={
          habit.completed_today ? 'Marcar como no cumplido hoy' : 'Marcar como cumplido hoy'
        }
      >
        <span className="habit-row__mark" />
      </button>

      <div className="habit-row__body">
        <span className="habit-row__title">{habit.title}</span>
        {habit.category && <span className="habit-row__category">{habit.category}</span>}
      </div>

      <span className="habit-row__streak" title="Racha actual">
        {habit.streak} {habit.streak === 1 ? 'día' : 'días'}
      </span>

      <button
        className="habit-row__delete"
        onClick={() => onDelete(habit.id)}
        disabled={busy}
        aria-label={`Eliminar ${habit.title}`}
      >
        ×
      </button>
    </li>
  )
}
