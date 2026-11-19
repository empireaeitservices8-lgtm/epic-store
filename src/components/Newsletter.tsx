"use client";

import { useEffect, useRef, useState } from "react";
import { Inter, Syne } from "next/font/google";

/* Fonts: Syne for headings, Inter for body/UI */
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

type Status = "idle" | "loading" | "success" | "error";

const perks = ["New collections", "Exclusive offers", "Creative updates"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const head = "font-[family-name:var(--font-syne)]";

/* TODO: replace with your real signup call, e.g.
   await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) });
   Right now it only simulates a request; no email is stored. */
async function subscribe(email: string) {
  await new Promise((r) => setTimeout(r, 900));
  return { ok: Boolean(email) };
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /* Reveal on scroll */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Cursor spotlight (no re-renders) */
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus("error");
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setError("That email doesn't look right. Please check and try again.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const res = await subscribe(value);
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  const done = status === "success";

  return (
    <section
      className={`${syne.variable} ${inter.variable} flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[#F7F8F5] px-4 py-6 font-[family-name:var(--font-inter)] sm:px-6 sm:py-8 lg:min-h-[calc(100svh-5rem)] lg:px-10 lg:py-10`}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        className={`relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#17171B] px-5 py-9 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)] ring-1 ring-white/10 transition-all duration-700 sm:px-10 sm:py-12 lg:px-14 lg:py-14 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Background decoration */}
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,0%),rgba(120,217,79,0.14),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <div className="relative mx-auto w-full max-w-2xl">
          {/* Envelope icon */}
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-[#78D94F]/30 bg-[#78D94F]/10 text-[#78D94F] transition-transform duration-500 hover:-rotate-6 hover:scale-110 sm:mb-5 sm:h-14 sm:w-14">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="sm:h-7 sm:w-7"
            >
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </div>

          <span className="inline-flex items-center rounded-full border border-[#78D94F]/40 bg-[#78D94F]/[0.06] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#78D94F] sm:px-4 sm:py-2 sm:text-xs">
            Stay Connected
          </span>

          <h2
            className={`${head} mt-4 text-3xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl`}
          >
            Get the Latest from
            <br />
            <span className="text-[#78D94F]">Epic Store.</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-lg text-sm leading-relaxed text-gray-400 sm:mt-4 sm:text-base sm:leading-7">
            Be the first to discover new collections, creative designs,
            exclusive offers, and exciting updates delivered straight to your
            inbox.
          </p>

          {/* Perks */}
          <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {perks.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-gray-300 transition duration-300 hover:border-[#78D94F]/60 hover:text-white sm:px-4 sm:py-2 sm:text-xs"
              >
                <span className="text-[#78D94F]">✓</span>
                {p}
              </li>
            ))}
          </ul>

          {/* Form + success state share one cell so height never jumps */}
          <div className="mx-auto mt-6 grid max-w-xl sm:mt-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-hidden={done}
              className={`col-start-1 row-start-1 transition-all duration-500 ${
                done ? "pointer-events-none -translate-y-3 opacity-0" : "opacity-100"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  aria-invalid={status === "error"}
                  aria-describedby="newsletter-feedback"
                  autoComplete="email"
                  disabled={status === "loading" || done}
                  className={`min-h-12 flex-1 rounded-full border bg-white px-5 text-sm text-[#17171B] outline-none transition placeholder:text-gray-400 focus:ring-2 disabled:opacity-70 sm:min-h-14 sm:px-6 ${
                    status === "error"
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                      : "border-white/10 focus:border-[#78D94F] focus:ring-[#78D94F]/30"
                  }`}
                />

                <button
                  type="submit"
                  disabled={status === "loading" || done}
                  className="group inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#78D94F] px-7 text-xs font-bold tracking-[0.1em] text-[#17171B] transition duration-300 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78D94F] sm:min-h-14 sm:px-8 sm:text-sm"
                >
                  {status === "loading" ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-[#17171B]/30 border-t-[#17171B]"
                        aria-hidden="true"
                      />
                      SUBSCRIBING
                    </>
                  ) : (
                    <>
                      SUBSCRIBE
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p
                id="newsletter-feedback"
                aria-live="polite"
                className={`mt-3 min-h-5 text-sm font-medium text-red-400 transition-opacity duration-300 ${
                  status === "error" ? "opacity-100" : "opacity-0"
                }`}
              >
                {error}
              </p>
            </form>

            <div
              role="status"
              aria-live="polite"
              aria-hidden={!done}
              className={`col-start-1 row-start-1 flex flex-col items-center justify-center gap-3 transition-all duration-500 ${
                done
                  ? "translate-y-0 opacity-100 delay-200"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-full bg-[#78D94F] text-2xl font-bold text-[#17171B] transition-transform duration-500 ${
                  done ? "scale-100 delay-300" : "scale-0"
                }`}
              >
                ✓
              </span>
              <p className={`${head} m-0 text-xl font-bold text-white`}>
                Thank you for subscribing to Epic Store!
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="cursor-pointer border-0 bg-transparent text-xs font-semibold text-gray-400 underline underline-offset-4 transition hover:text-[#78D94F]"
              >
                Use a different email
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-gray-500 sm:text-xs">
            By subscribing, you agree to receive updates from Epic Store. You
            can unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}