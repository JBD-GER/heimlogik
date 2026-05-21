"use client";

import { useActionState, useState } from "react";
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { authenticate, type AuthState } from "./actions";

type LoginFormProps = {
  nextPath: string;
};

const initialState: AuthState = {};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [state, formAction, pending] = useActionState(authenticate, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="next" value={nextPath} />

      <div className="grid grid-cols-2 rounded-md border border-slate-200 bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-ink shadow-sm" : "text-slate-600"}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded px-3 py-2 text-sm font-semibold ${mode === "signup" ? "bg-white text-ink shadow-sm" : "text-slate-600"}`}
        >
          Registrieren
        </button>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        E-Mail
        <span className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
          <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-12 w-full bg-transparent text-base font-normal outline-none"
          />
        </span>
      </label>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Passwort
        <span className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
          <LockKeyhole className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
            className="min-h-12 w-full bg-transparent text-base font-normal outline-none"
          />
        </span>
      </label>

      {state.message ? (
        <p className={`rounded-md border p-3 text-sm ${state.status === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-ink shadow-sm transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {pending ? "Bitte warten..." : mode === "login" ? "Einloggen" : "Bestätigungsmail senden"}
      </button>
    </form>
  );
}
