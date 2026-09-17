// Modelo de datos del dominio: hábitos personales.
// Refleja 1:1 la tabla `habits` de Supabase (ver supabase/schema.sql).

export interface Habit {
  id: string
  title: string
  category: string | null
  streak: number
  completed_today: boolean
  created_at: string
}

// Forma que envía el formulario al crear un hábito nuevo.
export type NewHabit = Pick<Habit, 'title' | 'category'>

// Estado de una petición a la API: nunca se pisan entre sí,
// para poder mostrar loading, error y datos de forma independiente.
export interface RequestState {
  loading: boolean
  error: string | null
}
