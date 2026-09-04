import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Dumbbell, Flame, Loader2, Plus, Timer, TrendingUp } from "lucide-react";
import { fetchProfile, fetchWorkouts, formatDate, formatDuration } from "@/lib/fittrack";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FitTrack" },
      {
        name: "description",
        content: "Statisticile tale FitTrack: număr de antrenamente, minute totale și calorii arse.",
      },
      { property: "og:title", content: "Dashboard — FitTrack" },
      { property: "og:description", content: "Vezi progresul antrenamentelor tale în FitTrack." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = Route.useRouteContext();

  const profileQuery = useQuery({
    queryKey: ["profile", user.id],
    queryFn: () => fetchProfile(user.id),
  });

  const workoutsQuery = useQuery({ queryKey: ["workouts"], queryFn: fetchWorkouts });

  const workouts = workoutsQuery.data ?? [];
  const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration ?? 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories ?? 0), 0);
  const last = workouts[0];
  const name =
    profileQuery.data?.full_name?.trim() || user.email?.split("@")[0] || "sportiv";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Bun venit</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Salut, {name}!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Iată o privire de ansamblu asupra activității tale.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/workouts/new">
            <Plus className="size-4" />
            Adaugă antrenament
          </Link>
        </Button>
      </div>

      {workoutsQuery.isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Nu am putut încărca datele</AlertTitle>
          <AlertDescription>
            {(workoutsQuery.error as Error).message}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => workoutsQuery.refetch()}
            >
              Încearcă din nou
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Antrenamente"
          value={workouts.length.toString()}
          hint="total înregistrate"
          icon={<Dumbbell className="size-5" />}
          loading={workoutsQuery.isLoading}
        />
        <StatCard
          label="Durata totală"
          value={`${totalMinutes} min`}
          hint={totalMinutes ? formatDuration(totalMinutes) : "încă nimic"}
          icon={<Timer className="size-5" />}
          loading={workoutsQuery.isLoading}
        />
        <StatCard
          label="Calorii arse"
          value={totalCalories ? `${totalCalories} kcal` : "—"}
          hint={totalCalories ? "din antrenamentele cu calorii notate" : "nu ai notat calorii"}
          icon={<Flame className="size-5" />}
          loading={workoutsQuery.isLoading}
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4 text-primary" />
            Ultimul antrenament
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workoutsQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : last ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold">{last.title}</span>
                  <Badge variant="secondary">{last.workout_type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(last.workout_date)} · {formatDuration(last.duration)}
                  {last.calories ? ` · ${last.calories} kcal` : ""}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/workouts/$workoutId" params={{ workoutId: last.id }}>
                  Vezi detalii
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground">
                Nu ai adăugat încă niciun antrenament.
              </p>
              <Button asChild>
                <Link to="/workouts/new">
                  <Plus className="size-4" />
                  Adaugă primul antrenament
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  loading,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="flex items-start justify-between gap-4 pt-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-extrabold tracking-tight">{value}</p>
          )}
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
        </span>
      </CardContent>
    </Card>
  );
}
