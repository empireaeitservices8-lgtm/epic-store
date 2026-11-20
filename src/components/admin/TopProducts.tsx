import LoadingImage from "@/components/LoadingImage";

const products = [
  {
    id: 1,
    name: "Astronaut Space Poster",
    category: "Posters",
    sales: 184,
    revenue: 91716,
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=150",
  },
  {
    id: 2,
    name: "Abstract Modern Art",
    category: "Canvas Prints",
    sales: 156,
    revenue: 93444,
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150",
  },
  {
    id: 3,
    name: "Vintage Aesthetic Poster",
    category: "Posters",
    sales: 132,
    revenue: 52668,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=150",
  },
  {
    id: 4,
    name: "Nature Landscape Print",
    category: "Canvas Prints",
    sales: 98,
    revenue: 53802,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=150",
  },
];

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
  const source = items && items.length > 0 ? items : products;
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
          Best performing products
        </p>
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
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
            No products match &ldquo;{searchQuery}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
