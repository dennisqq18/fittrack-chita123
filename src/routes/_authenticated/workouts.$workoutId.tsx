import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Flame, NotebookPen, Timer } from "lucide-react";
import { fetchWorkout, formatDate, formatDateTime, formatDuration } from "@/lib/fittrack";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/workouts/$workoutId")({
  head: () => ({
    meta: [
      { title: "Detalii antrenament — FitTrack" },
      {
        name: "description",
        content: "Vezi toate detaliile unui antrenament: tip, durată, dată, calorii și observații.",
      },
      { property: "og:title", content: "Detalii antrenament — FitTrack" },
      { property: "og:description", content: "Detaliile complete ale antrenamentului tău." },
    ],
  }),
  component: WorkoutDetailPage,
});

function WorkoutDetailPage() {
  const { workoutId } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["workouts", workoutId],
    queryFn: () => fetchWorkout(workoutId),
  });

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-2 w-fit">
        <Link to="/workouts">
          <ArrowLeft className="size-4" />
          Înapoi la antrenamente
        </Link>
      </Button>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Nu am putut încărca antrenamentul</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      ) : !data ? (
        <Alert>
          <AlertTitle>Antrenament inexistent</AlertTitle>
          <AlertDescription>
            Acest antrenament nu există sau nu îți aparține.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="shadow-card">
          <CardHeader className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              {data.workout_type}
            </Badge>
            <CardTitle className="text-2xl">{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Detail icon={<CalendarDays className="size-4" />} label="Data">
                {formatDate(data.workout_date)}
              </Detail>
              <Detail icon={<Timer className="size-4" />} label="Durată">
                {formatDuration(data.duration)}
              </Detail>
              <Detail icon={<Flame className="size-4" />} label="Calorii">
                {data.calories != null ? `${data.calories} kcal` : "—"}
              </Detail>
            </div>

            <Detail icon={<NotebookPen className="size-4" />} label="Observații">
              <span className="whitespace-pre-wrap">{data.notes?.trim() ? data.notes : "—"}</span>
            </Detail>

            <p className="border-t pt-4 text-sm text-muted-foreground">
              Adăugat pe {formatDateTime(data.created_at)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="font-medium text-foreground">{children}</p>
    </div>
  );
}
