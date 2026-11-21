import LoadingImage from "@/components/LoadingImage";

export type TopProductItem = {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  image: string;
};

export default function TopProducts({
  searchQuery = "",
  items,
}: {
  searchQuery?: string;
  items?: TopProductItem[];
}) {
  const isLoading = items === undefined;
  const source = items ?? [];
  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? source.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
    : source;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
      <div className="mb-6">
        <h2 className="m-0 font-[family-name:var(--font-syne)] text-xl font-extrabold text-[#17171B]">
          Top Selling Products
        </h2>
        <p className="m-0 mt-1 text-sm text-gray-500">
          Live revenue &amp; units from database orders
        </p>
      </div>

      <div className="space-y-4">
          {
            isLoading?(
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-3 rounded-2xl p-2"
                >
                  <span className="h-7 w-7 shrink-0 rounded-full bg-gray-200" />
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                  <div className="h-4 w-16 rounded bg-gray-200" />
                </div>
              ))
        ) : filtered.length > 0 ? (
          filtered.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[#F7F8F5]"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#78D94F]/15 text-xs font-extrabold text-[#17171B]">
                0{index + 1}
              </span>

              <LoadingImage
                src={product.image}
                alt={product.name}
                wrapperClassName="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100"
              />

              <div className="min-w-0 flex-1">
                <h3 className="m-0 truncate text-sm font-bold text-[#17171B]">
                  {product.name}
                </h3>
                <p className="m-0 mt-1 text-xs text-gray-400">
                  {product.category} · {product.sales} sold
                </p>
              </div>

              <p className="m-0 shrink-0 font-[family-name:var(--font-inter)] text-sm font-extrabold tabular-nums text-[#17171B]">
                ₹{product.revenue.toLocaleString("en-IN")}
              </p>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-gray-400">
            {searchQuery.trim()
              ? `No products match "${searchQuery}".`
              : "No completed product sales recorded yet."}
          </p>
        )}
      </div>
    </div>
  );
}
