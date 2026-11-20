"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter, Syne } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const head = `${syne.className} font-[family-name:var(--font-syne)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

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
      setError("Please enter both your admin email and password.");
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
      className={`${syne.variable} ${inter.variable} ${inter.className} flex min-h-screen items-center justify-center bg-[#F7F8F5] px-4 py-8 font-[family-name:var(--font-inter)] sm:px-6`}
    >
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(23,23,27,0.08)] md:grid-cols-2">
        {/* Left Dark Brand Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#17171B] p-10 text-white md:flex lg:p-12">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative z-10 flex items-center justify-between">
            <span className={`${head} text-2xl font-extrabold tracking-[0.14em]`}>
              EPIC<span className="text-[#78D94F]">STORE.</span>
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#78D94F]">
              Admin Portal
            </span>
          </div>

          <div className="relative z-10 my-10">
            <p className="m-0 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.24em] text-[#78D94F]">
              <span className="h-0.5 w-7 bg-[#78D94F]" />
              Control Center
            </p>
            <h1
              className={`${head} mt-3 text-3xl font-extrabold uppercase leading-[1.06] tracking-tight text-white lg:text-4xl`}
            >
              Manage Your{" "}
              <span className="text-[#78D94F]">Storefront.</span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Sign in to access live orders, inventory, TiDB Cloud analytics,
              customer enquiries, and product collections.
            </p>

            <div className="mt-7 space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#78D94F]" />
                <span>HTTP-only signed session protection</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#78D94F]" />
                <span>Real-time TiDB Cloud order &amp; stock sync</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-5">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Live Store
            </Link>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mb-6 flex items-center justify-between md:hidden">
            <span className={`${head} text-xl font-extrabold tracking-[0.12em] text-[#17171B]`}>
              EPIC<span className="text-[#78D94F]">STORE.</span>
            </span>
            <Link
              href="/"
              className="text-xs font-bold text-gray-500 no-underline hover:text-[#17171B]"
            >
              ← Storefront
            </Link>
          </div>

          <p className="m-0 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-0.5 w-6 bg-[#78D94F]" />
            Administrator Access
          </p>

          <h2
            className={`${head} mt-2.5 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
          >
            Admin Sign In
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            Enter your administrator credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#17171B]"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
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
                  className={`w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-[#17171B] outline-none transition placeholder:text-gray-400 focus:border-[#78D94F] focus:ring-2 focus:ring-[#78D94F]/25 ${focus}`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#17171B]"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter admin password"
                  className={`w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-11 text-sm text-[#17171B] outline-none transition placeholder:text-gray-400 focus:border-[#78D94F] focus:ring-2 focus:ring-[#78D94F]/25 ${focus}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-1 text-gray-400 transition hover:text-[#17171B]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

              <div className="flex items-center text-xs">
                <label className="flex cursor-pointer items-center gap-2 font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-[#78D94F]"
                  />
                  Keep me signed in (7 days)
                </label>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`${head} group inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-0 bg-[#78D94F] px-7 py-3.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#17171B] shadow-[0_10px_28px_rgba(120,217,79,0.28)] transition hover:bg-[#17171B] hover:text-white disabled:cursor-wait disabled:opacity-75 ${focus}`}
              >
                {loading ? "Signing In..." : "Sign In to Admin"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
          </form>
        </div>
      </div>
    </main>
  );
}

