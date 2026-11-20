"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Search,
  Trash2,
  Star,
  Check,
  X,
  MessageSquare,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
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

type ReviewStatus = "Pending" | "Approved" | "Rejected";

type Review = {
  id: number;
  customer: string;
  email: string;
  product: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: ReviewStatus;
};

const initialReviews: Review[] = [
  {
    id: 1,
    customer: "Alex Johnson",
    email: "alex@example.com",
    product: "Astronaut Space Poster",
    rating: 5,
    title: "Amazing quality!",
    comment:
      "The print quality is excellent and the colors look beautiful. It arrived safely packaged.",
    date: "19 Nov 2026",
    status: "Approved",
  },
  {
    id: 2,
    customer: "Priya Sharma",
    email: "priya@example.com",
    product: "Abstract Modern Art",
    rating: 4,
    title: "Very good product",
    comment:
      "The design looks great on my wall. Delivery took a little longer than expected.",
    date: "18 Nov 2026",
    status: "Pending",
  },
  {
    id: 3,
    customer: "Rahul Kumar",
    email: "rahul@example.com",
    product: "Vintage Aesthetic Poster",
    rating: 3,
    title: "Good but could improve",
    comment: "The design is nice, but I expected slightly thicker paper.",
    date: "17 Nov 2026",
    status: "Pending",
  },
  {
    id: 4,
    customer: "Sneha Thomas",
    email: "sneha@example.com",
    product: "Nature Landscape Print",
    rating: 5,
    title: "Beautiful artwork",
    comment:
      "Absolutely loved this print. The colors are vibrant and it looks premium.",
    date: "16 Nov 2026",
    status: "Approved",
  },
  {
    id: 5,
    customer: "Arjun Das",
    email: "arjun@example.com",
    product: "Minimalist Wall Art",
    rating: 1,
    title: "Not satisfied",
    comment:
      "The product I received was damaged. I have contacted support regarding this.",
    date: "15 Nov 2026",
    status: "Rejected",
  },
];

const statusStyles: Record<ReviewStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-[#78D94F]/20 text-green-800",
  Rejected: "bg-red-50 text-red-600",
};

const head = "font-[family-name:var(--font-syne)]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={15}
          className={
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-200"
          }
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-500">
        {rating}/5
      </span>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!selectedReview && !deleteTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedReview(null);
        setDeleteTarget(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedReview, deleteTarget]);

  const filteredReviews = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesSearch =
        !term ||
        review.customer.toLowerCase().includes(term) ||
        review.product.toLowerCase().includes(term) ||
        review.title.toLowerCase().includes(term) ||
        review.comment.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || review.status === statusFilter;

      const matchesRating =
        ratingFilter === "All" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  const updateReviewStatus = (id: number, status: ReviewStatus) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === id ? { ...review, status } : review
      )
    );
    setSelectedReview((current) =>
      current?.id === id ? { ...current, status } : current
    );
    setNotice(`Review #${id} marked as ${status}.`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setReviews((current) =>
      current.filter((review) => review.id !== deleteTarget.id)
    );
    setSelectedReview((current) =>
      current?.id === deleteTarget.id ? null : current
    );
    setNotice(`Review by ${deleteTarget.customer} deleted.`);
    setDeleteTarget(null);
  };

  const stats = [
    {
      label: "Total Reviews",
      value: reviews.length,
      icon: MessageSquare,
    },
    {
      label: "Pending Reviews",
      value: reviews.filter((r) => r.status === "Pending").length,
      icon: Clock,
    },
    {
      label: "Approved Reviews",
      value: reviews.filter((r) => r.status === "Approved").length,
      icon: CheckCircle2,
    },
    {
      label: "Average Rating",
      value: reviews.length
        ? `${(
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)} / 5`
        : "0 / 5",
      icon: Star,
    },
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
        <AdminHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          search={search}
          onSearchChange={setSearch}
        />

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
              <span className="text-green-700">Reviews</span>
            </div>
            <h1
              className={`${head} m-0 mt-2 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
            >
              Reviews Management
            </h1>
            <p className="m-0 mt-1.5 text-sm text-gray-500">
              Review customer feedback and manage published product reviews.
            </p>
          </div>

          {notice && (
            <div
              role="status"
              className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#78D94F]/40 bg-[#78D94F]/15 px-5 py-3.5 text-sm font-medium text-[#17171B]"
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-700" />
                {notice}
              </span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#17171B] transition hover:bg-black/10"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="group flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition hover:-translate-y-1 hover:border-[#78D94F]"
              >
                <div>
                  <p className="m-0 text-sm font-medium text-gray-500">
                    {label}
                  </p>
                  <p
                    className="m-0 mt-2 font-[family-name:var(--font-inter)] text-2xl font-extrabold tabular-nums tracking-tight text-[#17171B]"
                  >
                    {value}
                  </p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#78D94F]/15 text-[#17171B] transition-colors group-hover:bg-[#78D94F]">
                  <Icon size={21} />
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-6 xl:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-[#F7F8F5] px-4 py-2.5 transition focus-within:border-[#78D94F]">
                <Search className="shrink-0 text-gray-400" size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer, product or review..."
                  aria-label="Search reviews"
                  className="w-full border-0 bg-transparent text-sm outline-none"
                />
              </div>

              <select
                aria-label="Filter by review status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 outline-none transition focus:border-[#78D94F]"
              >
                <option value="All">All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>

              <select
                aria-label="Filter by rating"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 outline-none transition focus:border-[#78D94F]"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#F7F8F5] text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Rating</th>
                    <th className="px-6 py-4 font-semibold">Review</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredReviews.map((review) => (
                    <tr
                      key={review.id}
                      className="transition hover:bg-[#F7F8F5]/70"
                    >
                      <td className="px-6 py-4">
                        <p className="m-0 font-bold text-[#17171B]">
                          {review.customer}
                        </p>
                        <p className="m-0 mt-0.5 text-xs text-gray-500">
                          {review.email}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-600">
                        {review.product}
                      </td>

                      <td className="px-6 py-4">
                        <RatingStars rating={review.rating} />
                      </td>

                      <td className="max-w-[220px] px-6 py-4">
                        <p className="m-0 font-semibold text-[#17171B]">
                          {review.title}
                        </p>
                        <p className="m-0 mt-0.5 truncate text-xs text-gray-500">
                          {review.comment}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                        {review.date}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                            statusStyles[review.status]
                          }`}
                        >
                          {review.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedReview(review)}
                            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-[#F7F8F5] hover:text-[#17171B] ${focus}`}
                            aria-label={`View review by ${review.customer}`}
                          >
                            <Eye size={16} />
                          </button>

                          {review.status !== "Approved" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateReviewStatus(review.id, "Approved")
                              }
                              className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-green-600 transition hover:bg-[#78D94F]/20 ${focus}`}
                              aria-label="Approve review"
                            >
                              <Check size={16} />
                            </button>
                          )}

                          {review.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateReviewStatus(review.id, "Rejected")
                              }
                              className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-amber-600 transition hover:bg-amber-50 ${focus}`}
                              aria-label="Reject review"
                            >
                              <X size={16} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(review)}
                            className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 transition hover:bg-red-50 hover:text-red-600 ${focus}`}
                            aria-label={`Delete review by ${review.customer}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredReviews.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-14 text-center text-gray-500"
                      >
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </main>
      </div>

      {selectedReview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="review-modal-title"
                  className={`${head} m-0 text-xl font-extrabold text-[#17171B]`}
                >
                  Review Details
                </h2>
                <p className="m-0 mt-1 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                  Review #{selectedReview.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-0 bg-transparent text-gray-400 hover:bg-gray-100"
                aria-label="Close review details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl bg-[#F7F8F5] p-4">
                <p className={`${head} m-0 font-bold text-[#17171B]`}>
                  {selectedReview.customer}
                </p>
                <p className="m-0 mt-1 text-sm text-gray-500">
                  {selectedReview.email}
                </p>
              </div>

              <div>
                <p className="m-0 text-xs text-gray-400">Product</p>
                <p className="m-0 mt-1 font-semibold text-[#17171B]">
                  {selectedReview.product}
                </p>
              </div>

              <div>
                <p className="m-0 mb-2 text-xs text-gray-400">Customer Rating</p>
                <RatingStars rating={selectedReview.rating} />
              </div>

              <div>
                <p className="m-0 text-sm font-bold text-[#17171B]">
                  {selectedReview.title}
                </p>
                <p className="m-0 mt-2 rounded-2xl bg-[#F7F8F5] p-4 text-sm leading-6 text-gray-600">
                  {selectedReview.comment}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#17171B]">
                  Review Status
                </label>
                <select
                  value={selectedReview.status}
                  onChange={(e) =>
                    updateReviewStatus(
                      selectedReview.id,
                      e.target.value as ReviewStatus
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#78D94F]"
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>

              <p className="m-0 text-xs text-gray-400">
                Review changes are temporary until database storage is
                connected.
              </p>

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="cursor-pointer rounded-full border-0 bg-[#78D94F] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17171B] transition hover:bg-[#17171B] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-review-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={26} />
            </div>
            <h2
              id="delete-review-title"
              className={`${head} m-0 mt-5 text-center text-xl font-extrabold text-[#17171B]`}
            >
              Delete Review?
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to remove the review by{" "}
              <strong className="text-[#17171B]">{deleteTarget.customer}</strong>?
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="cursor-pointer rounded-full border border-gray-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="cursor-pointer rounded-full border-0 bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-red-700"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
