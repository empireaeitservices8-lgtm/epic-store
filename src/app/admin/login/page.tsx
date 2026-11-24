"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter, Montserrat } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

const autofillFix =
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1E1E24] [&:-webkit-autofill]:[-webkit-text-fill-color:#FFFFFF] [&:-webkit-autofill]:caret-white";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your administrator email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const safeRedirect = redirectTarget.startsWith("/admin")
        ? redirectTarget
        : "/admin";
      router.replace(safeRedirect);
      router.refresh();
    } catch {
      setError("Unable to reach the authentication service. Please retry.");
      setLoading(false);
    }
  };

  return (
    <main
      className={`${montserrat.variable} ${inter.variable} ${inter.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0D0D10] px-4 py-10 font-[family-name:var(--font-inter)] text-white sm:px-6`}
    >
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#78D94F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#78D94F]/8 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Top back link */}
        <div className="mb-5 flex items-center justify-between px-1">
          <span className={`${head} text-lg font-extrabold tracking-[0.14em] text-white`}>
            EPIC<span className="text-[#78D94F]">STORE.</span>
          </span>
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Live Store
          </Link>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#17171B]/95 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-9">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#78D94F]/60 to-transparent" />

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#78D94F]/35 bg-[#78D94F]/10 text-[#78D94F] shadow-[0_0_28px_rgba(120,217,79,0.18)]">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.26em] text-[#78D94F]">
              Epic Store Administration
            </p>

            <h1
              className={`${head} mt-2.5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl`}
            >
              Admin <span className="text-[#78D94F]">Login</span>
            </h1>

            <p className="mt-2 text-xs text-gray-400 sm:text-sm">
              Sign in to manage your Epic Store platform.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-xs font-semibold tracking-wide text-gray-300"
              >
                Administrator Email
              </label>
              <div className="relative flex items-center overflow-hidden rounded-xl border border-white/15 bg-[#1E1E24] transition focus-within:border-[#78D94F] focus-within:ring-2 focus-within:ring-[#78D94F]/20">
                <span className="grid h-12 w-11 shrink-0 place-items-center text-[#78D94F]">
                  <Mail size={17} />
                </span>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="admin@epicstore.in"
                  className={`h-12 w-full border-0 bg-transparent pr-4 text-sm text-white outline-none placeholder:text-gray-500 ${autofillFix}`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-semibold tracking-wide text-gray-300"
              >
                Password
              </label>
              <div className="relative flex items-center overflow-hidden rounded-xl border border-white/15 bg-[#1E1E24] transition focus-within:border-[#78D94F] focus-within:ring-2 focus-within:ring-[#78D94F]/20">
                <span className="grid h-12 w-11 shrink-0 place-items-center text-[#78D94F]">
                  <Lock size={17} />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter administrator password"
                  className={`h-12 w-full border-0 bg-transparent pr-11 text-sm text-white outline-none placeholder:text-gray-500 ${autofillFix}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 grid h-9 w-9 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-gray-400 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-gray-400 transition hover:text-gray-200">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded accent-[#78D94F]"
                />
                Keep me signed in (7 days)
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${head} group inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border-0 bg-[#78D94F] px-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#17171B] shadow-[0_12px_32px_rgba(120,217,79,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#8be365] disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0 ${focus}`}
            >
              {loading ? "Signing In..." : "Access Dashboard"}
              {!loading && (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-7 border-t border-white/10 pt-5 text-center">
            <p className="m-0 text-[11px] font-medium text-gray-500">
              Authorized personnel only.
            </p>
            <p className="m-0 mt-1 text-[11px] text-gray-600">
              Epic Store Administration Portal
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
