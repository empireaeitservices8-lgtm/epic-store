"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Store,
  Truck,
  CreditCard,
  Save,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

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

type Settings = {
  storeName: string;
  storeEmail: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  currency: string;
  shippingFee: string;
  freeShippingMinimum: string;
  estimatedDelivery: string;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  razorpayEnabled: boolean;
  maintenanceMode: boolean;
};

const initialSettings: Settings = {
  storeName: "Epic Store",
  storeEmail: "store.epicsports@gmail.com",
  phone: "+91 98765 43210",
  website: "https://epicstore.com",
  address: "Enter your business address",
  city: "Kochi",
  state: "Kerala",
  postalCode: "682001",
  currency: "INR",
  shippingFee: "50",
  freeShippingMinimum: "999",
  estimatedDelivery: "3-7 business days",
  codEnabled: true,
  onlinePaymentEnabled: true,
  razorpayEnabled: true,
  maintenanceMode: false,
};

type Tab = "store" | "shipping" | "payments";
type Feedback = { type: "success" | "error"; text: string } | null;

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

export default function AdminSettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState<Tab>("store");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const updateField = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      Number(settings.shippingFee) < 0 ||
      Number(settings.freeShippingMinimum) < 0
    ) {
      setFeedback({
        type: "error",
        text: "Shipping amounts cannot be negative.",
      });
      return;
    }

    setFeedback({
      type: "success",
      text: "Settings updated in this demo. Connect the backend to save them permanently.",
    });
  };

  const tabs = [
    { id: "store" as Tab, label: "Store Information", icon: Store },
    { id: "shipping" as Tab, label: "Shipping", icon: Truck },
    { id: "payments" as Tab, label: "Payments", icon: CreditCard },
  ];

  return (
    <div
      className={`${syne.variable} ${inter.variable} min-h-screen bg-[#F7F8F5] font-[family-name:var(--font-inter)]`}
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
              <span className="text-green-700">Settings</span>
            </div>
            <h1
              className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
            >
              Store Settings
            </h1>
            <p className="m-0 mt-1.5 text-sm text-gray-500">
              Manage your store details, shipping preferences and payment
              options.
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

          <div
            role="tablist"
            aria-label="Settings sections"
            className="mb-6 flex flex-wrap gap-2 rounded-3xl border border-gray-200 bg-white p-2 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:inline-flex sm:rounded-full"
          >
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border-0 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition ${focus} ${
                  activeTab === id
                    ? "bg-[#17171B] text-white"
                    : "bg-transparent text-gray-500 hover:text-[#17171B]"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === "store" && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B]">
                    <Store size={20} />
                  </div>
                  <div>
                    <h2
                      className={`${head} m-0 text-lg font-extrabold text-[#17171B]`}
                    >
                      General Information
                    </h2>
                    <p className="m-0 text-sm text-gray-500">
                      Your store&apos;s basic details and contact information.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Store Name
                    </label>
                    <input
                      required
                      value={settings.storeName}
                      onChange={(e) => updateField("storeName", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Store Email
                    </label>
                    <input
                      required
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) =>
                        updateField("storeEmail", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Phone Number
                    </label>
                    <input
                      value={settings.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={settings.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                    />
                  </div>
                </div>

                <div className="my-7 border-t border-gray-100" />

                <div className="mb-5 flex items-center gap-3">
                  <MapPin size={19} className="text-green-700" />
                  <h3
                    className={`${head} m-0 text-base font-extrabold text-[#17171B]`}
                  >
                    Business Address
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Street Address
                    </label>
                    <textarea
                      rows={3}
                      value={settings.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        City
                      </label>
                      <input
                        value={settings.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        State
                      </label>
                      <input
                        value={settings.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Postal Code
                      </label>
                      <input
                        value={settings.postalCode}
                        onChange={(e) =>
                          updateField("postalCode", e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B]">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h2
                      className={`${head} m-0 text-lg font-extrabold text-[#17171B]`}
                    >
                      Shipping Configuration
                    </h2>
                    <p className="m-0 text-sm text-gray-500">
                      Configure delivery charges and estimated delivery times.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Standard Shipping Fee (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.shippingFee}
                      onChange={(e) =>
                        updateField("shippingFee", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                    />
                    <p className="m-0 mt-1.5 text-xs text-gray-400">
                      Applied to orders below the free shipping threshold.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Free Shipping Minimum (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.freeShippingMinimum}
                      onChange={(e) =>
                        updateField("freeShippingMinimum", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                    />
                    <p className="m-0 mt-1.5 text-xs text-gray-400">
                      Orders at or above this amount qualify for free shipping.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Estimated Delivery Time
                    </label>
                    <input
                      value={settings.estimatedDelivery}
                      onChange={(e) =>
                        updateField("estimatedDelivery", e.target.value)
                      }
                      placeholder="Example: 3-7 business days"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                    />
                  </div>
                </div>

                <div className="mt-7 rounded-2xl bg-[#F7F8F5] p-5">
                  <h3
                    className={`${head} m-0 text-sm font-extrabold uppercase tracking-[0.1em] text-[#17171B]`}
                  >
                    Shipping Preview
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-6 text-sm">
                    <p className="m-0 text-gray-600">
                      Standard fee:{" "}
                      <strong className="text-[#17171B]">
                        ₹{settings.shippingFee || "0"}
                      </strong>
                    </p>
                    <p className="m-0 text-gray-600">
                      Free shipping above:{" "}
                      <strong className="text-[#17171B]">
                        ₹{settings.freeShippingMinimum || "0"}
                      </strong>
                    </p>
                  </div>
                  <p className="m-0 mt-2 text-xs text-gray-500">
                    Estimated delivery:{" "}
                    {settings.estimatedDelivery || "Not specified"}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B]">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h2
                      className={`${head} m-0 text-lg font-extrabold text-[#17171B]`}
                    >
                      Payment Preferences
                    </h2>
                    <p className="m-0 text-sm text-gray-500">
                      Choose which payment methods your store will offer.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "onlinePaymentEnabled" as const,
                      title: "Online Payments",
                      description:
                        "Allow customers to pay online during checkout.",
                    },
                    {
                      key: "razorpayEnabled" as const,
                      title: "Razorpay",
                      description:
                        "Use Razorpay for supported online payment methods.",
                    },
                    {
                      key: "codEnabled" as const,
                      title: "Cash on Delivery",
                      description:
                        "Allow customers to pay when their order is delivered.",
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4 transition hover:border-[#78D94F] hover:bg-[#F7F8F5]/60"
                    >
                      <div>
                        <p className="m-0 font-bold text-[#17171B]">
                          {item.title}
                        </p>
                        <p className="m-0 mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={(e) =>
                          updateField(item.key, e.target.checked)
                        }
                        className="h-5 w-5 accent-[#78D94F]"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className={`${head} m-0 text-sm font-bold text-amber-900`}>
                    Payment gateway setup
                  </p>
                  <p className="m-0 mt-1 text-sm leading-6 text-amber-800">
                    These switches are only interface preferences. Razorpay API
                    keys, server-side order creation, payment verification and
                    webhook handling must be configured securely in the backend
                    before accepting real payments.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      updateField("maintenanceMode", e.target.checked)
                    }
                    className="h-4 w-4 accent-[#78D94F]"
                  />
                  Enable maintenance mode (demo preference only)
                </label>

                <button
                  type="submit"
                  className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-[#78D94F] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white ${focus}`}
                >
                  <Save size={16} /> Save Settings
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
