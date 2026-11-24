"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Inter, Montserrat } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

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

type Feedback = { type: "success" | "error"; text: string } | null;

const head = `${montserrat.className} font-[family-name:var(--font-montserrat)]`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminProfilePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "store.epicsports@gmail.com",
    phone: "+91 98765 43210",
    role: "Super Administrator",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      setFeedback({ type: "error", text: "Name and email are required." });
      return;
    }

    setFeedback({
      type: "success",
      text: "Profile updated in this demo. Connect the backend to save changes permanently.",
    });
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwords.current || !passwords.newPassword || !passwords.confirm) {
      setFeedback({
        type: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (passwords.newPassword.length < 8) {
      setFeedback({
        type: "error",
        text: "New password must contain at least 8 characters.",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      setFeedback({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    setFeedback({
      type: "success",
      text: "Password validation passed in this demo. Connect authentication to update credentials.",
    });

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });
  };

  return (
    <div
      className={`${montserrat.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
    >
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
              <Link
                href="/admin"
                className="text-gray-400 no-underline transition hover:text-[#17171B]"
              >
                Admin
              </Link>
              <span>/</span>
              <span className="text-green-700">Profile</span>
            </div>
            <h1
              className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
            >
              Admin Profile
            </h1>
            <p className="m-0 mt-1.5 text-sm text-gray-500">
              Manage your administrator account and security preferences.
            </p>
          </div>

          {feedback && (
            <div
              role="status"
              className={`mb-6 flex items-center justify-between gap-4 rounded-2xl border px-5 py-3.5 text-sm font-medium ${
                feedback.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-[#78D94F]/40 bg-[#78D94F]/15 text-[#17171B]"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {feedback.type === "error" ? (
                  <AlertCircle size={17} className="shrink-0 text-red-600" />
                ) : (
                  <CheckCircle2 size={17} className="shrink-0 text-green-700" />
                )}
                {feedback.text}
              </span>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                aria-label="Dismiss message"
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent transition hover:bg-black/10"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
            {/* Profile Summary Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-7">
              <div className="flex flex-col items-center text-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-[#17171B] font-[family-name:var(--font-inter)] text-2xl font-extrabold text-[#78D94F]">
                  {profile.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "AD"}
                </div>

                <h2
                  className={`${head} m-0 mt-4 text-xl font-extrabold text-[#17171B]`}
                >
                  {profile.name}
                </h2>
                <p className="m-0 mt-1 text-sm text-gray-500">
                  {profile.email}
                </p>

                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#78D94F]/20 px-3.5 py-1.5 text-xs font-bold text-green-800">
                  <ShieldCheck size={14} />
                  {profile.role}
                </span>
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                <div className="flex items-center gap-3 rounded-2xl bg-[#F7F8F5] px-4 py-3 text-sm">
                  <Mail size={16} className="shrink-0 text-gray-400" />
                  <span className="break-all font-medium text-[#17171B]">
                    {profile.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#F7F8F5] px-4 py-3 text-sm">
                  <Phone size={16} className="shrink-0 text-gray-400" />
                  <span className="font-medium text-[#17171B]">
                    {profile.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs & Forms */}
            <div className="xl:col-span-2">
              <div
                role="tablist"
                aria-label="Profile sections"
                className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-gray-200 bg-white p-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "profile"}
                  onClick={() => {
                    setActiveTab("profile");
                    setFeedback(null);
                  }}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] transition ${focus} ${
                    activeTab === "profile"
                      ? "bg-[#17171B] text-white"
                      : "bg-transparent text-gray-500 hover:text-[#17171B]"
                  }`}
                >
                  <User size={16} />
                  Personal Information
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "password"}
                  onClick={() => {
                    setActiveTab("password");
                    setFeedback(null);
                  }}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] transition ${focus} ${
                    activeTab === "password"
                      ? "bg-[#17171B] text-white"
                      : "bg-transparent text-gray-500 hover:text-[#17171B]"
                  }`}
                >
                  <Lock size={16} />
                  Change Password
                </button>
              </div>

              {activeTab === "profile" && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8">
                  <div className="mb-6">
                    <h2
                      className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                    >
                      Personal Information
                    </h2>
                    <p className="m-0 mt-1 text-sm text-gray-500">
                      Update the details associated with your admin account.
                    </p>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Full Name
                      </label>
                      <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#78D94F]">
                        <User size={17} className="shrink-0 text-gray-400" />
                        <input
                          required
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          className="w-full border-0 bg-transparent px-3 py-3 text-sm outline-none"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Email Address
                      </label>
                      <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#78D94F]">
                        <Mail size={17} className="shrink-0 text-gray-400" />
                        <input
                          required
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="w-full border-0 bg-transparent px-3 py-3 text-sm outline-none"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Phone Number
                      </label>
                      <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#78D94F]">
                        <Phone size={17} className="shrink-0 text-gray-400" />
                        <input
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="w-full border-0 bg-transparent px-3 py-3 text-sm outline-none"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Account Role
                      </label>
                      <input
                        value={profile.role}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-[#F7F8F5] px-4 py-3 text-sm font-medium text-gray-500"
                      />
                      <p className="m-0 mt-1.5 text-xs text-gray-400">
                        Contact the system owner to change administrator
                        permissions.
                      </p>
                    </div>

                    <div className="flex justify-end border-t border-gray-100 pt-5">
                      <button
                        type="submit"
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-[#78D94F] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white ${focus}`}
                      >
                        <Save size={16} />
                        Save Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8">
                  <div className="mb-6">
                    <h2
                      className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                    >
                      Change Password
                    </h2>
                    <p className="m-0 mt-1 text-sm text-gray-500">
                      Use a strong password to protect your administrator
                      account.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    {[
                      {
                        key: "current" as const,
                        label: "Current Password",
                        placeholder: "Enter current password",
                      },
                      {
                        key: "newPassword" as const,
                        label: "New Password",
                        placeholder: "Enter new password",
                      },
                      {
                        key: "confirm" as const,
                        label: "Confirm New Password",
                        placeholder: "Confirm new password",
                      },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                          {field.label}
                        </label>
                        <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#78D94F]">
                          <Lock size={17} className="shrink-0 text-gray-400" />
                          <input
                            required
                            type={showPasswords ? "text" : "password"}
                            value={passwords[field.key]}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                [field.key]: e.target.value,
                              })
                            }
                            placeholder={field.placeholder}
                            className="w-full border-0 bg-transparent px-3 py-3 text-sm outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-gray-400 hover:text-[#17171B]"
                            aria-label={
                              showPasswords ? "Hide passwords" : "Show passwords"
                            }
                          >
                            {showPasswords ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-2xl bg-[#F7F8F5] p-4">
                      <p className={`${head} m-0 text-sm font-bold text-[#17171B]`}>
                        Password requirements
                      </p>
                      <ul className="mb-0 mt-2 list-inside list-disc space-y-1 pl-0 text-xs text-gray-500">
                        <li>At least 8 characters.</li>
                        <li>Use a mixture of letters, numbers and symbols.</li>
                        <li>
                          Do not reuse your password from another website.
                        </li>
                      </ul>
                    </div>

                    <div className="flex justify-end border-t border-gray-100 pt-5">
                      <button
                        type="submit"
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-[#78D94F] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white ${focus}`}
                      >
                        <Lock size={16} />
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
