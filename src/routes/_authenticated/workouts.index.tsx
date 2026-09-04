import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CalendarDays, Flame, Plus, Timer } from "lucide-react";
import { fetchWorkouts, formatDate, formatDuration } from "@/lib/fittrack";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/workouts/")({
  head: () => ({
    meta: [
      { title: "Antrenamentele mele — FitTrack" },
      {
        name: "description",
        content: "Lista completă a antrenamentelor tale, de la cel mai recent la cel mai vechi.",
      },
      { property: "og:title", content: "Antrenamentele mele — FitTrack" },
      { property: "og:description", content: "Toate antrenamentele tale, într-un singur loc." },
    ],
  }),
  component: WorkoutsPage,
});

function WorkoutsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Antrenamentele mele</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Toate antrenamentele tale, de la cel mai recent la cel mai vechi.
          </p>
        </div>
        <Button asChild>
          <Link to="/workouts/new">
            <Plus className="size-4" />
            Adaugă antrenament
          </Link>
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Nu am putut încărca antrenamentele</AlertTitle>
          <AlertDescription>
            {(error as Error).message}
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Încearcă din nou
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <CalendarDays className="size-6" />
            </span>
            <div>
              <p className="text-lg font-semibold">Nu ai adăugat încă niciun antrenament.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Începe acum și urmărește-ți progresul.
              </p>
            </div>
            <Button asChild>
              <Link to="/workouts/new">
                <Plus className="size-4" />
                Adaugă primul antrenament
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="grid gap-3">
          {data.map((workout) => (
            <Card key={workout.id} className="shadow-card transition-shadow hover:shadow-soft">
              <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold leading-tight">{workout.title}</h2>
                    <Badge variant="secondary">{workout.workout_type}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      {formatDate(workout.workout_date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Timer className="size-4" />
                      {formatDuration(workout.duration)}
                    </span>
                    {workout.calories != null && (
                      <span className="flex items-center gap-1.5">
                        <Flame className="size-4" />
                        {workout.calories} kcal
                      </span>
                    )}
                  </div>
                </div>
                <Button asChild variant="outline" className="sm:w-auto">
                  <Link to="/workouts/$workoutId" params={{ workoutId: workout.id }}>
                    Vezi detalii
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
