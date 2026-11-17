
"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Frontend demo only. Connect this form to an API before launch.
      setSubmitted(true);
    }
  };

  return (
    <>
      <Header />

      <main className="bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#17171B] px-5 py-20 md:py-28">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#78D94F]/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#78D94F]">
              We Are Here to Help
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Let's Start a
              <span className="text-[#78D94F]"> Conversation.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300">
              Have a question about our products, orders or custom prints?
              Our team is ready to help you find the right solution.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-300">
              <Link href="/" className="hover:text-[#78D94F]">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#78D94F]">Contact Us</span>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "✉",
                title: "Email Us",
                description: "Send us your questions anytime.",
                detail: "support@epicstore.com",
                href: "mailto:support@epicstore.com",
              },
              {
                icon: "☎",
                title: "Call Us",
                description: "Talk to our customer support team.",
                detail: "+91 98765 43210",
                href: "tel:+919876543210",
              },
              {
                icon: "◷",
                title: "Working Hours",
                description: "Our customer support availability.",
                detail: "Mon – Sat, 9 AM – 6 PM",
                href: undefined,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#78D94F]/15 text-2xl text-[#17171B]">
                  {item.icon}
                </div>

                <h2 className="mt-6 text-xl font-bold text-[#17171B]">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm text-gray-500">
                  {item.description}
                </p>

                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-5 inline-block font-semibold text-[#17171B] hover:text-[#65c83d]"
                  >
                    {item.detail}
                  </a>
                ) : (
                  <p className="mt-5 font-semibold text-[#17171B]">
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form and Address */}
        <section className="bg-[#F8F8F8] px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-[#78D94F]">
                Send Us a Message
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#17171B]">
                Get in Touch
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Fill in the form below and tell us how we can help.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-green-50 p-7 text-center">
                  <div className="text-4xl text-green-600">✓</div>
                  <h3 className="mt-4 text-xl font-bold text-[#17171B]">
                    Message Submitted!
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Your message passed the frontend demo form validation.
                    No email or support ticket has been sent yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "General Enquiry",
                        message: "",
                      });
                    }}
                    className="mt-6 rounded-full bg-[#78D94F] px-6 py-3 text-sm font-bold text-[#17171B] hover:bg-[#65c83d]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#78D94F]"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#78D94F]"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#78D94F]"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#78D94F]"
                    >
                      <option>General Enquiry</option>
                      <option>Product Enquiry</option>
                      <option>Order Status</option>
                      <option>Shipping and Delivery</option>
                      <option>Return and Refund</option>
                      <option>Custom Prints</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#78D94F]"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#78D94F] px-8 py-4 font-bold text-[#17171B] transition hover:bg-[#65c83d]"
                  >
                    Send Message →
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    Demo form only. Connect a backend before accepting
                    real customer enquiries.
                  </p>
                </form>
              )}
            </div>

            {/* Business Information */}
            <div className="flex flex-col justify-between gap-7">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[#78D94F]">
                  Contact Information
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#17171B]">
                  We'd Love to Hear From You
                </h2>

                <p className="mt-5 leading-8 text-gray-600">
                  Whether you need help choosing the perfect artwork,
                  tracking an order or creating a custom design, get in
                  touch with our team.
                </p>
              </div>

              <div className="rounded-3xl bg-[#17171B] p-8 text-white">
                <h3 className="text-xl font-bold">Epic Store</h3>

                <p className="mt-4 text-sm leading-7 text-gray-300">
                  Creative products and stylish designs to make every
                  space more personal.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="flex gap-4">
                    <span className="text-xl text-[#78D94F]">⌖</span>
                    <div>
                      <p className="font-semibold">Our Location</p>
                      <p className="mt-1 text-sm text-gray-400">
                        Business address to be added
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-xl text-[#78D94F]">✉</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="mt-1 text-sm text-gray-400">
                        support@epicstore.com
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-xl text-[#78D94F]">☎</span>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="mt-1 text-sm text-gray-400">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 text-center">
                <div className="text-4xl">📍</div>
                <h3 className="mt-4 font-bold text-[#17171B]">
                  Find Epic Store
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Add the client's actual business address and Google Maps
                  embed here.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Shortcut */}
        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-[#78D94F] p-8 text-center md:flex-row md:p-12 md:text-left">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#17171B]/60">
                Need Quick Answers?
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#17171B] md:text-3xl">
                Check Our Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-[#17171B]/70">
                Find helpful information about orders, delivery, payments
                and returns.
              </p>
            </div>

            <Link
              href="/faq"
              className="shrink-0 rounded-full bg-[#17171B] px-8 py-4 font-bold text-white transition hover:bg-black"
            >
              Visit FAQs →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
