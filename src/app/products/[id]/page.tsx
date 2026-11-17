
"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const products = [
  {
    id: "1",
    name: "Astronaut Space Poster",
    category: "Posters",
    price: 499,
    oldPrice: 799,
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1000",
    description:
      "Bring the beauty of space into your home with this stunning astronaut-inspired wall poster. Designed to add a modern and creative touch to your bedroom, living room or workspace.",
    sku: "EP-POST-001",
    material: "Premium poster paper",
    finish: "Matte finish",
    availability: "In Stock",
    badge: "BESTSELLER",
  },
  {
    id: "2",
    name: "Abstract Modern Art",
    category: "Canvas Prints",
    price: 599,
    oldPrice: 899,
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1000",
    description:
      "Give your walls a contemporary look with this abstract modern art print. A beautiful choice for homes, offices and creative spaces.",
    sku: "EP-CAN-002",
    material: "Premium canvas",
    finish: "Textured finish",
    availability: "In Stock",
    badge: "NEW",
  },
  {
    id: "3",
    name: "Vintage Aesthetic Poster",
    category: "Posters",
    price: 399,
    oldPrice: 599,
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000",
    description:
      "Add a timeless vintage aesthetic to your room with this carefully selected art print.",
    sku: "EP-POST-003",
    material: "Premium poster paper",
    finish: "Matte finish",
    availability: "In Stock",
    badge: "POPULAR",
  },
  {
    id: "4",
    name: "Nature Landscape Print",
    category: "Canvas Prints",
    price: 549,
    oldPrice: 799,
    rating: 4.8,
    reviews: 72,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000",
    description:
      "Bring a peaceful natural atmosphere into your space with this beautiful landscape artwork.",
    sku: "EP-CAN-004",
    material: "Premium canvas",
    finish: "Matte finish",
    availability: "In Stock",
    badge: "NEW",
  },
  {
    id: "5",
    name: "Minimalist Wall Art",
    category: "Metal Posters",
    price: 699,
    oldPrice: 999,
    rating: 4.6,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000",
    description:
      "A clean and minimal art piece designed for modern interiors and stylish workspaces.",
    sku: "EP-MET-005",
    material: "Metal",
    finish: "Premium finish",
    availability: "In Stock",
    badge: "FEATURED",
  },
  {
    id: "6",
    name: "Creative Art Print",
    category: "Posters",
    price: 449,
    oldPrice: 699,
    rating: 4.9,
    reviews: 108,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1000",
    description:
      "A colourful creative art print to make your walls more expressive and inspiring.",
    sku: "EP-POST-006",
    material: "Premium poster paper",
    finish: "Matte finish",
    availability: "In Stock",
    badge: "POPULAR",
  },
  {
    id: "7",
    name: "Modern Room Decor",
    category: "Tapestries",
    price: 799,
    oldPrice: 1199,
    rating: 4.7,
    reviews: 52,
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000",
    description:
      "Refresh your interior with a modern decorative piece that adds character to your room.",
    sku: "EP-TAP-007",
    material: "Fabric",
    finish: "Printed finish",
    availability: "In Stock",
    badge: "NEW",
  },
  {
    id: "8",
    name: "Colorful Abstract Art",
    category: "Stickers",
    price: 299,
    oldPrice: 499,
    rating: 4.8,
    reviews: 93,
    image:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1000",
    description:
      "Add a fun splash of colour to your everyday accessories and creative spaces.",
    sku: "EP-STK-008",
    material: "Self-adhesive material",
    finish: "Glossy finish",
    availability: "In Stock",
    badge: "POPULAR",
  },
];

function ProductDetailsContent() {
  const params = useParams<{ id: string }>();
  const product = products.find((item) => item.id === params.id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
          <h1 className="text-3xl font-bold text-[#17171B]">
            Product Not Found
          </h1>
          <p className="mt-3 text-gray-500">
            The product you are looking for does not exist.
          </p>
          <Link
            href="/shop"
            className="mt-6 rounded-full bg-[#78D94F] px-7 py-3 font-semibold text-[#17171B] transition hover:bg-[#65c83d]"
          >
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  const galleryImages = [
    product.image,
    product.image.replace("w=1000", "w=800"),
    product.image.replace("w=1000", "w=600"),
  ];

  const activeImage = selectedImage || galleryImages[0];

  const addToCart = () => {
    setCartMessage(`${quantity} item(s) added to your demo cart.`);
  };

  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== product.id && item.category === product.category
    )
    .slice(0, 3);

  return (
    <>
      <Header />

      <main className="bg-white">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-5 py-5 text-sm text-gray-500 md:px-8">
          <Link href="/" className="hover:text-[#78D94F]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#78D94F]">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#17171B]">{product.name}</span>
        </div>

        {/* Product Details */}
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 md:grid-cols-2 md:px-8 lg:gap-16">
          {/* Product Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-[#F5F5F5]">
              <span className="absolute left-5 top-5 z-10 rounded-full bg-[#78D94F] px-4 py-2 text-xs font-bold text-[#17171B]">
                {product.badge}
              </span>

              <img
                src={activeImage}
                alt={product.name}
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-xl border-2 ${
                    activeImage === image
                      ? "border-[#78D94F]"
                      : "border-transparent"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-28 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#17171B] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-sm font-semibold text-[#17171B]">
                {product.rating}/5
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviews} customer reviews)
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-[#17171B]">
                ₹{product.price}
              </span>
              <span className="text-lg text-gray-400 line-through">
                ₹{product.oldPrice}
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                {discount}% OFF
              </span>
            </div>

            <p className="mt-7 leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mt-7 space-y-3 border-y border-gray-200 py-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Product SKU</span>
                <span className="font-semibold text-[#17171B]">
                  {product.sku}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Material</span>
                <span className="font-semibold text-[#17171B]">
                  {product.material}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Finish</span>
                <span className="font-semibold text-[#17171B]">
                  {product.finish}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Availability</span>
                <span className="font-semibold text-green-600">
                  {product.availability}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-7">
              <p className="mb-3 text-sm font-semibold text-[#17171B]">
                Quantity
              </p>

              <div className="flex h-12 w-36 items-center justify-between rounded-full border border-gray-300 px-4">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="text-xl text-[#17171B] hover:text-[#78D94F]"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="font-semibold text-[#17171B]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="text-xl text-[#17171B] hover:text-[#78D94F]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={addToCart}
                className="flex-1 rounded-full bg-[#78D94F] px-7 py-4 font-bold text-[#17171B] transition hover:bg-[#65c83d]"
              >
                Add to Cart
              </button>

              <Link
                href="/cart"
                className="flex-1 rounded-full border border-[#17171B] px-7 py-4 text-center font-bold text-[#17171B] transition hover:bg-[#17171B] hover:text-white"
              >
                Buy Now
              </Link>
            </div>

            {cartMessage && (
              <p
                role="status"
                className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700"
              >
                {cartMessage}
              </p>
            )}

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#F7F7F7] p-4">
                <p className="font-semibold text-[#17171B]">
                  Free Delivery
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  On eligible orders
                </p>
              </div>
              <div className="rounded-xl bg-[#F7F7F7] p-4">
                <p className="font-semibold text-[#17171B]">
                  Secure Payment
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Safe checkout experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section className="border-t border-gray-100 bg-[#F8F8F8]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#78D94F]">
              Product Information
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#17171B]">
              About This Product
            </h2>
            <p className="mt-5 max-w-3xl leading-8 text-gray-600">
              {product.description} Every Epic Store product is presented
              with a focus on style, creativity and everyday spaces. Please
              check the product specifications and final product details
              before placing your order.
            </p>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <div className="mb-9 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[#78D94F]">
                  You May Also Like
                </p>
                <h2 className="mt-2 text-3xl font-bold text-[#17171B]">
                  Related Products
                </h2>
              </div>

              <Link
                href="/shop"
                className="text-sm font-semibold text-[#17171B] hover:text-[#65c83d]"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-bold text-[#17171B]">
                      {item.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-[#17171B]">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-yellow-500">
                        ★ {item.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductDetailsContent />
    </Suspense>
  );
}
