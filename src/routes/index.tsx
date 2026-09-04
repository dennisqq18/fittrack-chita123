import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Autentificare — FitTrack" },
      {
        name: "description",
        content:
          "Intră în contul FitTrack sau creează-ți unul nou pentru a-ți urmări antrenamentele, durata și caloriile arse.",
      },
      { property: "og:title", content: "Autentificare — FitTrack" },
      {
        property: "og:description",
        content: "Creează un cont FitTrack și începe să îți notezi antrenamentele.",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "register";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }
      setChecking(false);
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  function validate() {
    if (mode === "register" && fullName.trim().length < 3) {
      return "Introdu numele complet (minim 3 caractere).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Introdu o adresă de email validă.";
    }
    if (password.length < 6) {
      return "Parola trebuie să aibă minim 6 caractere.";
    }
    if (mode === "register" && password !== confirm) {
      return "Parolele nu coincid.";
    }
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(
            signInError.message === "Invalid login credentials"
              ? "Email sau parolă incorecte."
              : signInError.message,
          );
          return;
        }
        toast.success("Bine ai revenit!");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim() },
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        if (data.session) {
          toast.success("Cont creat cu succes!");
          navigate({ to: "/dashboard", replace: true });
          return;
        }
        setInfo(
          "Cont creat cu succes. Verifică-ți emailul și confirmă adresa, apoi autentifică-te.",
        );
        setMode("login");
        setPassword("");
        setConfirm("");
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
          <Activity className="size-6" />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">FitTrack</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Jurnalul tău personal de antrenamente: notează ce ai lucrat, cât a durat și câte calorii
          ai ars.
        </p>
      </div>

      <Card className="w-full max-w-md shadow-card">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Autentificare" : "Creează cont"}</CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Intră în contul tău pentru a-ți vedea antrenamentele."
              : "Completează datele pentru a-ți crea un cont nou."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {info && (
              <Alert className="border-primary/30 bg-accent text-accent-foreground">
                <AlertDescription>{info}</AlertDescription>
              </Alert>
            )}

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nume complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Andrei Popescu"
                  autoComplete="name"
                  maxLength={120}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nume@email.com"
                autoComplete="email"
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minim 6 caractere"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmă parola</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "login" ? "Autentificare" : "Creează cont"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Nu ai încă un cont?" : "Ai deja un cont?"}{" "}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
                setInfo(null);
              }}
            >
              {mode === "login" ? "Create account" : "Login"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
