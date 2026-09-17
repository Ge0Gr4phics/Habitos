import { useState, type FormEvent } from 'react'
import type { NewHabit } from '../types'

interface HabitFormProps {
  onCreate: (habit: NewHabit) => Promise<void>
  submitting: boolean
}

export function HabitForm({ onCreate, submitting }: HabitFormProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    await onCreate({ title: trimmed, category: category.trim() || null })
    setTitle('')
    setCategory('')
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Leer 20 minutos, estirar, tomar agua..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Nombre del hábito"
        disabled={submitting}
      />
      <input
        type="text"
        placeholder="Categoría (opcional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Categoría del hábito"
        disabled={submitting}
        className="habit-form__category"
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        Agregar
      </button>
    </form>
  )
}
