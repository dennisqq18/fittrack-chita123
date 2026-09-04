import { supabase } from "@/integrations/supabase/client";

export type Workout = {
  id: string;
  user_id: string;
  title: string;
  workout_type: string;
  duration: number;
  workout_date: string;
  calories: number | null;
  notes: string | null;
  created_at: string;
};

export const WORKOUT_TYPES = [
  "Forță",
  "Cardio",
  "Stretching",
  "Alergare",
  "Ciclism",
  "Înot",
  "Altul",
] as const;

export async function fetchWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("workout_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Workout[];
}

export async function fetchWorkout(id: string): Promise<Workout | null> {
  const { data, error } = await supabase.from("workouts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Workout) ?? null;
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export function formatDate(value: string) {
  const d = new Date(value.length <= 10 ? `${value}T00:00:00` : value);
  return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
