import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WORKOUT_TYPES } from "@/lib/fittrack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/workouts/new")({
  head: () => ({
    meta: [
      { title: "Adaugă antrenament — FitTrack" },
      {
        name: "description",
        content: "Notează un antrenament nou: tip, durată, dată, calorii arse și observații.",
      },
      { property: "og:title", content: "Adaugă antrenament — FitTrack" },
      { property: "og:description", content: "Adaugă rapid un antrenament nou în FitTrack." },
    ],
  }),
  component: NewWorkoutPage,
});

type FormErrors = {
  title?: string;
  workoutType?: string;
  duration?: string;
  workoutDate?: string;
  calories?: string;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function NewWorkoutPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [workoutDate, setWorkoutDate] = useState(today());
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function validate() {
    const next: FormErrors = {};
    if (title.trim().length < 2) next.title = "Numele antrenamentului este obligatoriu.";
    if (!workoutType) next.workoutType = "Alege tipul antrenamentului.";
    const dur = Number(duration);
    if (!duration || !Number.isFinite(dur) || dur <= 0)
      next.duration = "Durata trebuie să fie un număr mai mare decât 0.";
    if (!workoutDate) next.workoutDate = "Alege data antrenamentului.";
    if (calories !== "") {
      const cal = Number(calories);
      if (!Number.isFinite(cal) || cal < 0) next.calories = "Caloriile trebuie să fie un număr pozitiv.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("workouts").insert({
        user_id: user.id,
        title: title.trim(),
        workout_type: workoutType,
        duration: Math.round(Number(duration)),
        workout_date: workoutDate,
        calories: calories === "" ? null : Math.round(Number(calories)),
        notes: notes.trim() === "" ? null : notes.trim(),
      });

      if (error) {
        setFormError(`Antrenamentul nu a putut fi salvat: ${error.message}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["workouts"] });
      toast.success("Antrenament salvat cu succes!");
      navigate({ to: "/workouts" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard">
          <ArrowLeft className="size-4" />
          Înapoi la dashboard
        </Link>
      </Button>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl">Adaugă antrenament</CardTitle>
          <CardDescription>Completează detaliile antrenamentului tău.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Eroare la salvare</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Numele antrenamentului *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Antrenament picioare"
                maxLength={120}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workoutType">Tipul antrenamentului *</Label>
              <Select value={workoutType} onValueChange={setWorkoutType}>
                <SelectTrigger id="workoutType">
                  <SelectValue placeholder="Alege tipul" />
                </SelectTrigger>
                <SelectContent>
                  {WORKOUT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.workoutType && (
                <p className="text-sm text-destructive">{errors.workoutType}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Durata (minute) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="45"
                />
                {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workoutDate">Data antrenamentului *</Label>
                <Input
                  id="workoutDate"
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                />
                {errors.workoutDate && (
                  <p className="text-sm text-destructive">{errors.workoutDate}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calorii arse (opțional)</Label>
              <Input
                id="calories"
                type="number"
                min={0}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="350"
              />
              {errors.calories && <p className="text-sm text-destructive">{errors.calories}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observații (opțional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cum a fost antrenamentul?"
                rows={4}
                maxLength={1000}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Salvează antrenamentul
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
