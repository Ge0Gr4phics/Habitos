import { supabase } from './supabaseClient'
import type { Habit, NewHabit } from '../types'

// GET — todos los hábitos, del más reciente al más antiguo.
export async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Habit[]
}

// POST — crea un hábito nuevo, arrancando en racha 0.
export async function createHabit(habit: NewHabit): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert({ title: habit.title, category: habit.category })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Habit
}

// PUT — alterna si el hábito de hoy está cumplido y ajusta la racha.
export async function toggleHabit(habit: Habit): Promise<Habit> {
  const completed_today = !habit.completed_today
  const streak = completed_today ? habit.streak + 1 : Math.max(habit.streak - 1, 0)

  const { data, error } = await supabase
    .from('habits')
    .update({ completed_today, streak })
    .eq('id', habit.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Habit
}

// DELETE — elimina un hábito de forma permanente.
export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
