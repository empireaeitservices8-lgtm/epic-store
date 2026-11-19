"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

type AuthMode = "login" | "register";
type Feedback = { type: "error" | "success" | "info"; text: string } | null;

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const revealCls =
  "translate-y-6 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "1";
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setOtpSent(false);
    setVerified(false);
    setOtp("");
    setFeedback(null);
  };

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "register" && fullName.trim().length < 2) {
      setFeedback({
        type: "error",
        text: "Please enter your full name to create an account.",
      });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setFeedback({
        type: "error",
        text: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    setOtpSent(true);
    setVerified(false);
    setFeedback({
      type: "info",
      text: "Demo OTP sent. Use 123456 to continue.",
    });
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp === "123456") {
      setVerified(true);
      setFeedback({
        type: "success",
        text:
          mode === "register"
            ? "Demo account created and verified successfully!"
            : "Demo sign-in verification successful!",
      });
    } else {
      setFeedback({
        type: "error",
        text: "Invalid OTP. Please enter 123456 for the demo.",
      });
    }
  };

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] px-4 py-10 font-[family-name:var(--font-inter)] sm:px-6 lg:py-14`}
      >
        <div
          data-reveal
          className={`${revealCls} mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:grid-cols-2`}
        >
          {/* Left Showcase Panel */}
          <div className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-[#17171B] p-12 text-white md:flex">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
            <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

            <div className="relative z-10">
              <p className={`${head} m-0 text-2xl font-extrabold tracking-[0.18em]`}>
                EPIC<span className="text-[#78D94F]">STORE.</span>
              </p>
            </div>

            <div className="relative z-10">
              <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]">
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Welcome to Epic Store
              </p>
              <h1
                className={`${head} mt-4 max-w-md text-4xl font-extrabold uppercase leading-[1.05] tracking-tight lg:text-5xl`}
              >
                Make your space feel like{" "}
                <span className="text-[#78D94F]">you.</span>
              </h1>
              <p className="mt-5 max-w-sm leading-7 text-gray-400">
                Discover creative prints, unique designs, and collections
                selected to bring your walls to life.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Quick mobile OTP sign-in & registration",
                  "Save favourites to your personal wishlist",
                  "Track orders and custom print enquiries",
                ].map((perk) => (
                  <div
                    key={perk}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#78D94F]/15 text-[#78D94F]">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="relative z-10 m-0 text-xs uppercase tracking-[0.2em] text-gray-500">
              Your style. Your space. Your story.
            </p>
          </div>

          {/* Right Form Panel */}
          <div className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-12">
            <div className="w-full max-w-md">
              <Link
                href="/"
                className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-500 no-underline transition hover:text-[#17171B] ${focus}`}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Home
              </Link>

              {/* Login / Register Switcher */}
              <div
                role="tablist"
                aria-label="Account mode"
                className="mt-7 grid grid-cols-2 rounded-full border border-gray-200 bg-[#F7F8F5] p-1"
              >
                {(
                  [
                    { id: "login", label: "Sign In" },
                    { id: "register", label: "Create Account" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={mode === tab.id}
                    onClick={() => switchMode(tab.id)}
                    className={`cursor-pointer rounded-full border-0 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition ${focus} ${
                      mode === tab.id
                        ? "bg-[#17171B] text-white shadow-sm"
                        : "bg-transparent text-gray-500 hover:text-[#17171B]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <p className="m-0 text-xs font-bold uppercase tracking-[0.22em] text-green-700">
                  {mode === "register" ? "New Customer" : "Customer Account"}
                </p>
                <h2
                  className={`${head} m-0 mt-2 text-3xl font-extrabold text-[#17171B]`}
                >
                  {verified
                    ? "You are all set!"
                    : otpSent
                      ? "Verify your number"
                      : mode === "register"
                        ? "Create your account"
                        : "Welcome back"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {verified
                    ? "Your demo verification is complete."
                    : otpSent
                      ? `Enter the 6-digit OTP sent to +91 ${mobile}.`
                      : mode === "register"
                        ? "Enter your name and mobile number to get started."
                        : "Enter your mobile number to sign in to your account."}
                </p>
              </div>

              {verified ? (
                <div className="mt-8 rounded-2xl border border-[#78D94F]/40 bg-[#78D94F]/10 p-6 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#78D94F] text-[#17171B]">
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <p className={`${head} m-0 mt-4 text-lg font-bold text-[#17171B]`}>
                    {mode === "register" && fullName
                      ? `Welcome, ${fullName}!`
                      : "Verification Complete"}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Demo session ready for +91 {mobile}.
                  </p>
                  <Link
                    href="/shop"
                    className={`group mt-6 inline-flex items-center gap-2 rounded-full bg-[#17171B] px-7 py-3.5 text-sm font-bold text-white no-underline transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                  >
                    Start Shopping
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              ) : !otpSent ? (
                <form onSubmit={handleSendOtp} className="mt-7 space-y-5">
                  {mode === "register" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Full Name
                      </label>
                      <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#78D94F]">
                        <User className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            setFeedback(null);
                          }}
                          placeholder="Enter your full name"
                          className="w-full border-0 bg-transparent px-3 py-3.5 text-sm outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Mobile Number
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-gray-200 transition focus-within:border-[#78D94F]">
                      <span className="flex items-center gap-1.5 border-r border-gray-200 bg-[#F7F8F5] px-4 text-sm font-semibold text-gray-600">
                        <Phone className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                          setFeedback(null);
                        }}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full border-0 bg-transparent px-4 py-3.5 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#17171B] px-6 py-4 text-sm font-bold tracking-[0.08em] text-white transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
                  >
                    {mode === "register" ? "SEND OTP & REGISTER" : "SEND OTP"}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="mt-7 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setFeedback(null);
                      }}
                      placeholder="••••••"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-center text-xl font-bold tracking-[0.5em] outline-none transition focus:border-[#78D94F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#78D94F] px-6 py-4 text-sm font-bold tracking-[0.08em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white ${focus}`}
                  >
                    VERIFY & CONTINUE
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setFeedback(null);
                    }}
                    className="w-full cursor-pointer border-0 bg-transparent text-sm font-semibold text-gray-500 transition hover:text-[#17171B]"
                  >
                    Change mobile number
                  </button>
                </form>
              )}

              {feedback && (
                <p
                  role="status"
                  className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                    feedback.type === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : feedback.type === "success"
                        ? "border-[#78D94F]/40 bg-[#78D94F]/15 text-green-800"
                        : "border-gray-200 bg-[#F7F8F5] text-gray-600"
                  }`}
                >
                  {feedback.text}
                </p>
              )}

              <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                <p className="m-0 text-xs leading-6 text-gray-500">
                  By continuing, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-[#17171B] underline underline-offset-4 hover:text-green-700"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-[#17171B] underline underline-offset-4 hover:text-green-700"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
