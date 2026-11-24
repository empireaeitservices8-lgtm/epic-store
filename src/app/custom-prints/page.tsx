"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import {
  ArrowRight,
  Check,
  Home,
  Image as ImageIcon,
  Palette,
  Upload,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingImage from "@/components/LoadingImage";

/* Fonts: Montserrat for headings, Inter for body/UI */
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

const printOptions = [
  {
    icon: ImageIcon,
    title: "Personalized Posters",
    description:
      "Turn your favourite photos, quotes, or artwork into personalized posters.",
  },
  {
    icon: Palette,
    title: "Canvas Prints",
    description:
      "Create canvas artwork using your own images and creative ideas.",
  },
  {
    icon: Home,
    title: "Wall Decor",
    description:
      "Design something special to complement your home or workspace.",
  },
];

const steps = [
  ["01", "Choose Your Print", "Select the type of print you want."],
  ["02", "Share Your Design", "Tell us about your image or design."],
  ["03", "Discuss Requirements", "Our team can discuss available options."],
  ["04", "Confirm Your Order", "Proceed after the details and price are agreed."],
];

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";
const card =
  "rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] md:p-8";

const revealCls =
  "translate-y-8 opacity-0 transition-all duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[in=1]:translate-y-0 data-[in=1]:opacity-100";

export default function CustomPrintsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [printType, setPrintType] = useState("Personalized Poster");
  const [dimensions, setDimensions] = useState("");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      { threshold: 0.12 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const reveal = (delay: number) => ({
    "data-reveal": "",
    style: { transitionDelay: `${delay}ms` },
  });

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    setUploadError("");
    setUploadingFile(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "epic-store/custom-prints");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as {
        ok?: boolean;
        url?: string;
        error?: string;
      };
      if (!res.ok || !data?.ok || !data.url) {
        setUploadError(data?.error || "Image upload failed.");
        return;
      }
      setFileUrl(data.url);
    } catch {
      setUploadError("Unable to upload image right now.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom-print",
          name,
          email,
          printType,
          dimensions,
          fileName: fileUrl || fileName,
          message,
        }),
      });
    } catch {
      /* Fallback gracefully if offline */
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  };

  return (
    <>
      <Header />

      <main
        ref={pageRef}
        className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
      >
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-12 text-center md:py-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/custom-prints-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#17171B]/55 via-[#17171B]/45 to-[#17171B]/75" />
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#78D94F]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative mx-auto max-w-3xl">
            <p
              {...reveal(100)}
              className={`${revealCls} flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#78D94F]`}
            >
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Made For You
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h1
              {...reveal(200)}
              className={`${revealCls} ${head} mt-4 text-3xl font-semibold uppercase leading-[1.06] tracking-tight text-white sm:text-4xl md:text-5xl`}
            >
              Your Ideas.
              <span className="block text-[#78D94F]">Your Prints.</span>
            </h1>

            <p
              {...reveal(300)}
              className={`${revealCls} mx-auto mt-5 max-w-xl leading-7 text-gray-400`}
            >
              Make your space more personal with custom prints. Bring your
              favourite photos, artwork, and ideas to life with Epic Store.
            </p>

            <div {...reveal(400)} className={revealCls}>
              <a
                href="#customize"
                className={`group mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-[#78D94F] px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`}
              >
                START CUSTOMIZING
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </section>

        {/* ================= INTRODUCTION ================= */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-10">
            <div {...reveal(100)} className={revealCls}>
              <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Personalize Your Space
              </p>

              <h2
                className={`${head} m-0 mt-3 text-2xl font-semibold text-[#17171B] md:text-3xl`}
              >
                Turn Your Ideas Into Something Special
              </h2>

              <p className="mt-5 leading-8 text-gray-500">
                Sometimes the best design is the one that means something to
                you. Choose your image, share your preferences, and tell us
                what you have in mind.
              </p>

              <p className="mt-4 leading-8 text-gray-500">
                Our custom print enquiry process helps you communicate your
                requirements so our team can discuss the available options with
                you.
              </p>

              <a
                href="#customize"
                className={`group mt-7 inline-flex items-center gap-3 rounded-full bg-[#17171B] px-8 py-4 text-sm font-bold tracking-[0.08em] text-white no-underline transition duration-300 hover:-translate-y-0.5 hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
              >
                SUBMIT YOUR IDEA
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <div {...reveal(200)} className={`${revealCls} grid grid-cols-2 gap-4`}>
              <LoadingImage
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700"
                alt="Art print inspiration"
                wrapperClassName="relative h-52 w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm md:h-56"
              />
              <LoadingImage
                src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=700"
                alt="Creative artwork"
                wrapperClassName="relative h-52 w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm md:h-56"
              />
              <LoadingImage
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700"
                alt="Abstract art"
                wrapperClassName="relative h-52 w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm md:h-56"
              />
              <LoadingImage
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=700"
                alt="Creative interior"
                wrapperClassName="relative h-52 w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm md:h-56"
              />
            </div>
          </div>
        </section>

        {/* ================= CUSTOMIZATION OPTIONS ================= */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mb-8 text-center">
            <p className="m-0 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              What You Can Create
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h2
              className={`${head} m-0 mt-3 text-2xl font-semibold text-[#17171B] md:text-3xl`}
            >
              Explore Custom Print Options
            </h2>

            <p className="m-0 mt-3 text-gray-500">
              Share your idea and let us discuss the possibilities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {printOptions.map((option) => {
              const OptionIcon = option.icon;
              return (
                <div
                  key={option.title}
                  className={`${card} group transition duration-300 hover:-translate-y-1 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.12)]`}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B] transition-colors duration-300 group-hover:bg-[#78D94F]">
                    <OptionIcon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <h3
                    className={`${head} m-0 mt-6 text-xl font-extrabold text-[#17171B]`}
                  >
                    {option.title}
                  </h3>

                  <p className="m-0 mt-3 leading-7 text-gray-500">
                    {option.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mb-8 text-center">
            <p className="m-0 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
              <span className="h-0.5 w-8 bg-[#78D94F]" />
              Simple Process
              <span className="h-0.5 w-8 bg-[#78D94F]" />
            </p>

            <h2
              className={`${head} m-0 mt-3 text-2xl font-semibold text-[#17171B] md:text-3xl`}
            >
              How Custom Printing Works
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {steps.map(([number, title, description]) => (
              <div
                key={number}
                className={`${card} group text-center transition duration-300 hover:-translate-y-1 hover:border-[#78D94F] hover:shadow-[0_10px_30px_rgba(120,217,79,0.12)]`}
              >
                <div
                  className={`${head} mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#78D94F]/20 text-lg font-extrabold text-[#17171B] transition-colors duration-300 group-hover:bg-[#78D94F]`}
                >
                  {number}
                </div>

                <h3
                  className={`${head} m-0 mt-5 text-lg font-extrabold text-[#17171B]`}
                >
                  {title}
                </h3>

                <p className="m-0 mt-3 text-sm leading-7 text-gray-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CUSTOM ENQUIRY FORM ================= */}
        <section
          id="customize"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6 lg:px-10 lg:py-10"
        >
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="lg:pt-4">
              <p className="m-0 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                <span className="h-0.5 w-8 bg-[#78D94F]" />
                Start Your Project
              </p>

              <h2
                className={`${head} m-0 mt-3 text-2xl font-semibold text-[#17171B] md:text-3xl`}
              >
                Tell Us What You Have in Mind
              </h2>

              <p className="mt-5 leading-8 text-gray-500">
                Share your contact details and customization requirements. Our
                team can use these details to understand your idea and discuss
                the next steps.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Share your preferred print type.",
                  "Tell us the size or dimensions you need.",
                  "Describe your design or customization idea.",
                  "Provide an image reference if available.",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4"
                  >
                    <span
                      className={`${head} grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#78D94F] text-xs font-extrabold text-[#17171B]`}
                    >
                      0{index + 1}
                    </span>
                    <p className="m-0 text-sm font-medium text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={card}>
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#78D94F] text-[#17171B]">
                    <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
                  </div>

                  <h3
                    className={`${head} m-0 mt-6 text-2xl font-extrabold text-[#17171B]`}
                  >
                    Demo Submission Complete
                  </h3>

                  <p className="mt-3 leading-7 text-gray-500">
                    Your form passed the frontend demo submission. No enquiry
                    has been sent or stored yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className={`mt-7 cursor-pointer rounded-full border-0 bg-[#78D94F] px-8 py-3.5 text-sm font-bold text-[#17171B] transition hover:bg-[#17171B] hover:text-white ${focus}`}
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <>
                  <h3
                    className={`${head} m-0 text-2xl font-extrabold text-[#17171B]`}
                  >
                    Custom Print Enquiry
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Fill in your details to describe your project.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Full Name *
                      </label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Print Type *
                      </label>
                      <select
                        value={printType}
                        onChange={(e) => setPrintType(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#78D94F]"
                      >
                        <option>Personalized Poster</option>
                        <option>Canvas Print</option>
                        <option>Metal Poster</option>
                        <option>Custom Wall Decor</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Preferred Size
                      </label>
                      <input
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder="Example: A3, 12 x 18 inches"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#78D94F]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Upload Reference Image
                      </label>
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-[#F7F8F5]/60 px-5 py-8 text-center transition hover:border-[#78D94F]">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#78D94F]/20 text-[#17171B]">
                          <Upload className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <span className="mt-3 text-sm font-semibold text-[#17171B]">
                          {uploadingFile
                            ? "Uploading to Cloudinary..."
                            : "Click to select an image"}
                        </span>
                        <span className="mt-1 text-xs text-gray-400">
                          JPG, PNG, WEBP up to 10 MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            void handleFileUpload(e.target.files?.[0])
                          }
                        />
                      </label>
                      {uploadError && (
                        <p className="mt-2 text-xs font-medium text-red-600">
                          {uploadError}
                        </p>
                      )}
                      {fileName && (
                        <p className="mt-2 break-all text-sm font-medium text-[#17171B]">
                          Selected: {fileName}
                          {fileUrl && (
                            <span className="ml-2 text-xs font-bold text-green-700">
                              ✓ Uploaded
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Describe Your Idea *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your design and requirements..."
                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#78D94F]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className={`group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#78D94F] py-4 text-sm font-bold tracking-[0.08em] text-[#17171B] transition duration-300 hover:bg-[#17171B] hover:text-white disabled:opacity-60 ${focus}`}
                    >
                      {sending ? "SENDING ENQUIRY..." : "SUBMIT ENQUIRY"}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                        aria-hidden="true"
                      />
                    </button>

                    <p className="m-0 text-center text-xs leading-6 text-gray-400">
                      Automatic confirmation email sent via store.epicsports@gmail.com.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ================= CTA BANNER ================= */}
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-[#17171B] px-8 py-12 text-center md:px-16">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#78D94F]/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#78D94F]/10 blur-3xl" />

            <div className="relative">
              <h2
                className={`${head} m-0 text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl`}
              >
                Have a <span className="text-[#78D94F]">Different Idea?</span>
              </h2>

              <p className="mx-auto mb-0 mt-5 max-w-xl leading-7 text-gray-400">
                Contact our team if you have questions about custom products or
                personalization options.
              </p>

              <Link
                href="/contact"
                className={`group mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-[#78D94F] px-9 py-4 text-sm font-bold tracking-[0.1em] text-[#17171B] no-underline shadow-[0_10px_30px_rgba(120,217,79,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-white ${focus}`}
              >
                CONTACT US
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
