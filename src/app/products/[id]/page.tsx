"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Inter, Syne } from "next/font/google";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Layers,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingImage from "@/components/LoadingImage";
import {
  addToStoreCart,
  toggleStoreWishlist,
  useStoreWishlist,
} from "@/lib/store";

/* Fonts: Syne for headings, Inter for body/UI & numeric values */
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

const head = `${syne.className} font-[family-name:var(--font-syne)]`;
const valueFont = `${inter.className} font-[family-name:var(--font-inter)] tabular-nums`;
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78D94F]";

type ProductItem = {
  id: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  gallery?: string[];
  description: string;
  sku: string;
  material: string;
  finish: string;
  dimensions: string;
  availability: string;
  badge: string;
};

const products: ProductItem[] = [
  {
    id: "1",
    name: "Football Stadium Legends Metal Poster (A3)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Football",
    price: 699,
    oldPrice: 999,
    rating: 4.9,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=85",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=85",
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1000&q=85",
    ],
    description:
      "Celebrate iconic matchday nights with this HD brushed-aluminum Football Stadium Legends metal poster. Infused with fade-resistant archival inks and a tool-free magnetic wall mount for effortless installation.",
    sku: "EP-MP-FB01",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "HD Satin Metallic & UV Protective Coating",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "BESTSELLER",
  },
  {
    id: "2",
    name: "F1 Circuit Telemetry XXL Desk Pad",
    category: "Desk Pad",
    collection: "Cars, Bike & F1",
    price: 899,
    oldPrice: 1299,
    rating: 4.8,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1000&q=85",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&q=85",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&q=85",
    ],
    description:
      "Engineered for precision gaming and high-performance workspaces, this F1 Circuit Telemetry XXL Desk Pad features a high-density micro-weave surface, anti-fray 360° stitched edges, and a non-slip natural rubber base.",
    sku: "EP-DP-F102",
    material: "High-Density Micro-Weave Cloth & Natural Rubber Base",
    finish: "Water-Resistant Smooth Glide Surface",
    dimensions: "900mm × 400mm × 4mm (XXL Extended)",
    availability: "In Stock",
    badge: "NEW",
  },
  {
    id: "3",
    name: "Autographed Football Signed Jersey Frame",
    category: "Signed Jersey Frame",
    collection: "Football",
    price: 1499,
    oldPrice: 1999,
    rating: 4.9,
    reviews: 164,
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=85",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=85",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1000&q=85",
    ],
    description:
      "Museum-grade shadowbox display showcasing a tribute autographed football jersey with double-matting, laser-engraved championship plaque, and shatterproof UV-filtering acrylic glass.",
    sku: "EP-JF-FB03",
    material: "Solid Matte Black Hardwood & UV-Protected Acrylic",
    finish: "Gallery Shadowbox Display with Velvet Backing",
    dimensions: "32 in × 24 in × 1.5 in (Full Collector Size)",
    availability: "In Stock",
    badge: "POPULAR",
  },
  {
    id: "4",
    name: "Marvel & DC Superhero Metal Poster (A2)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Movie, Series & Characters (DC, Marvel)",
    price: 999,
    oldPrice: 1399,
    rating: 4.8,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1000&q=85",
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1000&q=85",
      "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=1000&q=85",
    ],
    description:
      "Command your wall with cinematic Marvel & DC superhero artwork printed on high-luminance aluminum metal. Deep blacks and electric highlights pop off the surface with zero glare.",
    sku: "EP-MP-MD04",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "High-Contrast Gloss Metallic Finish",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "TRENDING",
  },
  {
    id: "5",
    name: "Anime Shonen Neon Metal Poster (A4)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Anime",
    price: 499,
    oldPrice: 799,
    rating: 4.9,
    reviews: 136,
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&q=85",
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&q=85",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&q=85",
    ],
    description:
      "Bring electric shonen energy to your battle station or bedroom with this razor-sharp Anime Neon metal poster. Comes complete with peel-and-stick magnetic mounting — zero nails or drilling required.",
    sku: "EP-MP-AN05",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "Vibrant Neon-Infused Sublimation Coat",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "BESTSELLER",
  },
  {
    id: "6",
    name: "Pro Gaming & Characters Micro-Weave Desk Pad",
    category: "Desk Pad",
    collection: "Games and Characters",
    price: 949,
    oldPrice: 1349,
    rating: 4.8,
    reviews: 108,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=85",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&q=85",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1000&q=85",
    ],
    description:
      "Designed for competitive esports and immersive gaming setups, this extra-wide desk pad delivers pixel-accurate mouse tracking, plush 4mm wrist cushioning, and vibrant character artwork.",
    sku: "EP-DP-GC06",
    material: "Pro-Grade Micro-Textured Cloth & Anti-Slip Rubber",
    finish: "Spill-Repellent Matte Coating with Stitched Seam",
    dimensions: "900mm × 400mm × 4mm (XXL Extended)",
    availability: "In Stock",
    badge: "NEW",
  },
  {
    id: "7",
    name: "World Cricket Icon Signed Jersey Frame",
    category: "Signed Jersey Frame",
    collection: "Cricket",
    price: 1499,
    oldPrice: 2199,
    rating: 4.9,
    reviews: 84,
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&q=85",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&q=85",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=85",
    ],
    description:
      "A centerpiece collector display for true cricket fans. Features a tribute signed championship jersey mounted inside a deep hardwood frame with archival mat boards and commemorative stats.",
    sku: "EP-JF-CR07",
    material: "Solid Hardwood Frame & Archival Acid-Free Matting",
    finish: "Crystal-Clear UV-Blocking Acrylic Front",
    dimensions: "32 in × 24 in × 1.5 in (Full Collector Size)",
    availability: "In Stock",
    badge: "POPULAR",
  },
  {
    id: "8",
    name: "Gym & Motivation Mindset Metal Poster (A3)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Gym and Motivation",
    price: 649,
    oldPrice: 949,
    rating: 4.8,
    reviews: 93,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&q=85",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=85",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1000&q=85",
    ],
    description:
      "Fuel discipline and daily grit in your home gym or office with bold, high-contrast typography and athletic imagery forged onto durable aluminum metal.",
    sku: "EP-MP-GM08",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "Sweat-Proof & Moisture-Resistant Matte Metallic",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "SALE",
  },
  {
    id: "9",
    name: "Lady Boss Executive Statement Metal Poster (A3)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Lady Boss",
    price: 699,
    oldPrice: 999,
    rating: 4.9,
    reviews: 78,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=85",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=85",
    ],
    description:
      "Designed for founders, leaders, and modern studios — this Lady Boss statement metal poster pairs editorial aesthetics with sleek brushed aluminum durability.",
    sku: "EP-MP-LB09",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "Satin Editorial Metallic Finish",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "NEW",
  },
  {
    id: "10",
    name: "Championship Cricket Victory Metal Poster (A2)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Cricket",
    price: 899,
    oldPrice: 1299,
    rating: 4.8,
    reviews: 65,
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&q=85",
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&q=85",
    ],
    description:
      "Relive unforgettable stadium roars and championship victories with this large-format A2 cricket metal poster crafted with ultra-vivid thermal sublimation.",
    sku: "EP-MP-CR10",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "HD Gloss Metallic Finish",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "TRENDING",
  },
  {
    id: "11",
    name: "Superhero Multiverse Gaming Desk Pad",
    category: "Desk Pad",
    collection: "Movie, Series & Characters (DC, Marvel)",
    price: 899,
    oldPrice: 1249,
    rating: 4.7,
    reviews: 59,
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1000&q=85",
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1000&q=85",
    ],
    description:
      "Transform your desk setup with iconic DC & Marvel multiverse artwork across an expansive 900×400mm micro-weave gaming surface.",
    sku: "EP-DP-MD11",
    material: "High-Density Micro-Weave Cloth & Rubber Base",
    finish: "Anti-Fray Stitched Edges & Water-Resistant Coat",
    dimensions: "900mm × 400mm × 4mm (XXL Extended)",
    availability: "In Stock",
    badge: "FEATURED",
  },
  {
    id: "12",
    name: "Anime Cyberpunk Wide Desk Pad",
    category: "Desk Pad",
    collection: "Anime",
    price: 849,
    oldPrice: 1199,
    rating: 4.9,
    reviews: 118,
    image:
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&q=85",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&q=85",
    ],
    description:
      "Pair your mechanical keyboard and gaming mouse with neon cyberpunk anime artistry on a silky-smooth, zero-drag desk mat.",
    sku: "EP-DP-AN12",
    material: "Micro-Textured Speed Cloth & Non-Slip Rubber",
    finish: "Vibrant Sublimation Print with Overlock Stitching",
    dimensions: "900mm × 400mm × 4mm (XXL Extended)",
    availability: "In Stock",
    badge: "POPULAR",
  },
  {
    id: "13",
    name: "Supercar GT Carbon Metal Poster (A2)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Cars, Bike & F1",
    price: 949,
    oldPrice: 1349,
    rating: 4.9,
    reviews: 104,
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&q=85",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1000&q=85",
    ],
    description:
      "Precision automotive photography infused directly onto brushed metal. Captures every aerodynamic curve and carbon-fiber detail with metallic sheen.",
    sku: "EP-MP-CF13",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "Automotive Gloss Metallic Finish",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "BESTSELLER",
  },
  {
    id: "14",
    name: "Next-Gen Open World Character Metal Poster (A3)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Games and Characters",
    price: 699,
    oldPrice: 999,
    rating: 4.8,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&q=85",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=85",
    ],
    description:
      "Level up your gaming room walls with iconic open-world character artwork rendered in high-definition metallic color.",
    sku: "EP-MP-GC14",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "HD Satin Metallic Finish",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "NEW",
  },
  {
    id: "15",
    name: "Lady Boss Workspace Edition Desk Pad",
    category: "Desk Pad",
    collection: "Lady Boss",
    price: 849,
    oldPrice: 1199,
    rating: 4.8,
    reviews: 62,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=85",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&q=85",
    ],
    description:
      "Elevate your executive desk setup with a refined, spill-proof desk pad engineered for effortless daily productivity and modern style.",
    sku: "EP-DP-LB15",
    material: "Premium Micro-Weave Surface & Non-Slip Rubber Base",
    finish: "Matte Smooth-Touch Finish with Stitched Edges",
    dimensions: "900mm × 400mm × 4mm (XXL Extended)",
    availability: "In Stock",
    badge: "POPULAR",
  },
  {
    id: "16",
    name: "Relentless Hustle Gym Metal Poster (A2)",
    category: "Metal Posters (A4, A3, A2)",
    collection: "Gym and Motivation",
    price: 899,
    oldPrice: 1299,
    rating: 4.9,
    reviews: 115,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=85",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&q=85",
    ],
    description:
      "Built for relentless training environments. Heavy-duty aluminum metal poster that resists humidity and inspires peak performance every rep.",
    sku: "EP-MP-GM16",
    material: "1.15mm Aircraft-Grade Aluminum Sheet",
    finish: "High-Contrast Matte Metallic Finish",
    dimensions: "A4 (8.3×11.7 in) / A3 (11.7×16.5 in) / A2 (16.5×23.4 in)",
    availability: "In Stock",
    badge: "BESTSELLER",
  },
];

const METAL_SIZES = ["A4 (8.3 × 11.7 in)", "A3 (11.7 × 16.5 in)", "A2 (16.5 × 23.4 in)"];

function rupee(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ProductDetailsContent() {
  const params = useParams<{ id: string }>();
  const rawId = decodeURIComponent(params.id || "");
  const normalizedSlug = toSlug(rawId);
  const product =
    products.find(
      (item) =>
        item.id === rawId ||
        toSlug(item.name) === normalizedSlug ||
        toSlug(item.sku) === normalizedSlug
    ) || products[0];
  const wishlist = useStoreWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(METAL_SIZES[1]);
  const [selectedImage, setSelectedImage] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <>
        <Header />
        <main
          className={`${syne.variable} ${inter.variable} flex min-h-[70vh] flex-col items-center justify-center bg-[#F7F8F5] px-5 py-20 text-center font-[family-name:var(--font-inter)]`}
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#17171B] text-[#78D94F]">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1
            className={`${head} mt-6 text-3xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-4xl`}
          >
            Product Not Found
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
            The product you are looking for might have been moved or is no longer available.
          </p>
          <Link
            href="/shop"
            className={`mt-7 inline-flex items-center gap-2.5 rounded-full bg-[#17171B] px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white no-underline transition hover:bg-[#78D94F] hover:text-[#17171B] ${focus}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const numericId = Number(product.id);
  const isWishlisted = wishlist.includes(numericId);
  const isMetalPoster = product.category.toLowerCase().includes("metal poster");

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [
          product.image,
          product.image.replace("w=1000", "w=900"),
          product.image.replace("w=1000", "w=800"),
        ];

  const activeImage =
    selectedImage && galleryImages.includes(selectedImage)
      ? selectedImage
      : galleryImages[0];

  const handleAddToCart = () => {
    addToStoreCart(
      {
        id: numericId,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2400);
  };

  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.collection === product.collection ||
          item.category === product.category)
    )
    .slice(0, 4);

  return (
    <>
      <Header />

      <main
        className={`${syne.variable} ${inter.variable} ${inter.className} min-h-screen bg-[#F7F8F5] pb-20 font-[family-name:var(--font-inter)] text-[#17171B] sm:pb-0`}
      >
        {/* ================= DARK HERO BANNER ================= */}
        <section className="relative overflow-hidden bg-[#17171B] px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-11">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero-banners/shop-hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#17171B]/95 via-[#17171B]/75 to-[#17171B]/45" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#78D94F]/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />

          <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-3 md:flex-row md:items-end md:gap-6">
            <div>
              {/* Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                className="mb-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 sm:mb-3.5 sm:gap-2 sm:text-xs sm:tracking-[0.16em]"
              >
                <Link
                  href="/"
                  className={`text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
                >
                  HOME
                </Link>
                <span>/</span>
                <Link
                  href="/shop"
                  className={`text-gray-400 no-underline transition hover:text-[#78D94F] ${focus}`}
                >
                  SHOP
                </Link>
                <span>/</span>
                <Link
                  href={`/shop?collection=${encodeURIComponent(product.collection)}`}
                  className={`text-[#78D94F] no-underline transition hover:underline ${focus}`}
                >
                  {product.collection}
                </Link>
                <span className="hidden sm:inline">/</span>
                <span className="hidden line-clamp-1 text-white sm:inline">{product.name}</span>
              </nav>

              <p className="mb-1.5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#78D94F] sm:mb-2 sm:gap-3 sm:text-xs sm:tracking-[0.24em]">
                <span className="h-0.5 w-6 bg-[#78D94F] sm:w-8" />
                {product.category}
              </p>

              <h1
                className={`${head} max-w-3xl text-xl font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-4xl`}
              >
                {product.name}
              </h1>
            </div>

            <Link
              href="/shop"
              className={`hidden shrink-0 items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white no-underline backdrop-blur-sm transition hover:border-[#78D94F] hover:bg-[#78D94F] hover:text-[#17171B] sm:inline-flex md:self-auto ${focus}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Catalog
            </Link>
          </div>
        </section>

        {/* ================= PRODUCT SHOWCASE ================= */}
        <section className="mx-auto max-w-7xl px-3.5 py-5 sm:px-6 sm:py-9 lg:px-10 lg:py-12">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left: Gallery */}
            <div className="lg:col-span-6">
              <div className="lg:sticky lg:top-28">
                <div className="relative aspect-[4/3.6] overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_14px_35px_rgba(23,23,27,0.06)] sm:aspect-[4/4.4] sm:rounded-3xl">
                  {product.badge && (
                    <span
                      className={`${head} absolute left-3.5 top-3.5 z-10 rounded-full bg-[#78D94F] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#17171B] shadow-md sm:left-5 sm:top-5 sm:px-4 sm:py-1.5 sm:text-[11px]`}
                    >
                      {product.badge}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleStoreWishlist(numericId)}
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    className={`absolute right-3.5 top-3.5 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full border transition duration-300 sm:right-5 sm:top-5 sm:h-11 sm:w-11 ${
                      isWishlisted
                        ? "border-[#17171B] bg-[#17171B] text-[#78D94F]"
                        : "border-gray-200 bg-white/90 text-[#17171B] backdrop-blur-md hover:bg-[#17171B] hover:text-white"
                    } ${focus}`}
                  >
                    <Heart
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>

                  <LoadingImage
                    src={activeImage}
                    alt={product.name}
                    priority
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Thumbnails */}
                <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:mt-4 sm:gap-3.5">
                  {galleryImages.map((image, index) => {
                    const isActive = activeImage === image;
                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        aria-label={`View product image ${index + 1}`}
                        className={`relative aspect-[4/2.9] cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition duration-300 sm:aspect-[4/3] sm:rounded-2xl ${
                          isActive
                            ? "border-[#78D94F] ring-2 ring-[#78D94F]/30"
                            : "border-gray-200/80 opacity-75 hover:border-gray-400 hover:opacity-100"
                        } ${focus}`}
                      >
                        <LoadingImage
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Product Information Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_14px_35px_rgba(23,23,27,0.05)] sm:rounded-3xl sm:p-8 lg:p-10">
                {/* Collection & Category pills */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Link
                    href={`/shop?collection=${encodeURIComponent(product.collection)}`}
                    className="inline-flex items-center rounded-full bg-[#17171B] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#78D94F] no-underline transition hover:bg-[#78D94F] hover:text-[#17171B] sm:px-3.5 sm:text-[11px] sm:tracking-[0.14em]"
                  >
                    {product.collection}
                  </Link>
                  <span className="rounded-full bg-[#F7F8F5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-600 sm:px-3.5 sm:text-[11px] sm:tracking-[0.14em]">
                    {product.category}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className={`${head} mt-3 text-xl font-extrabold leading-[1.15] tracking-tight text-[#17171B] sm:mt-4 sm:text-3xl`}
                >
                  {product.name}
                </h2>

                {/* Rating & SKU row */}
                <div className="mt-3 flex flex-wrap items-center gap-2.5 border-b border-gray-100 pb-3.5 sm:mt-4 sm:gap-3 sm:pb-5">
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 sm:gap-1.5 sm:px-3">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className={valueFont}>{product.rating}/5</span>
                  </div>
                  <span className={`${valueFont} text-xs font-medium text-gray-500`}>
                    ({product.reviews} reviews)
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {product.availability}
                  </span>
                </div>

                {/* Price block */}
                <div className="mt-4 flex flex-wrap items-baseline gap-2.5 sm:mt-6 sm:gap-3.5">
                  <span
                    className={`${valueFont} text-2xl font-extrabold tracking-tight text-[#17171B] sm:text-4xl`}
                  >
                    {rupee(product.price)}
                  </span>
                  <span
                    className={`${valueFont} text-base font-medium text-gray-400 line-through sm:text-lg`}
                  >
                    {rupee(product.oldPrice)}
                  </span>
                  <span
                    className={`${valueFont} rounded-full bg-[#78D94F]/20 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#17171B] sm:px-3.5 sm:py-1 sm:text-xs`}
                  >
                    Save {discount}%
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-gray-500 sm:mt-1.5 sm:text-xs">
                  Inclusive of all taxes • Free shipping on orders over ₹999
                </p>

                {/* Description */}
                <p className="mt-4 text-[13px] leading-6 text-gray-600 sm:mt-5 sm:text-[15px] sm:leading-7">
                  {product.description}
                </p>

                {/* Size selector for Metal Posters */}
                {isMetalPoster && (
                  <div className="mt-4 sm:mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`${head} text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#17171B] sm:text-xs`}
                      >
                        Select Poster Size
                      </span>
                      <span className="text-[11px] font-medium text-gray-500 sm:text-xs">
                        Magnetic mount included
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                      {METAL_SIZES.map((size) => {
                        const active = selectedSize === size;
                        const [shortLabel, dims] = size.split(" (");
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`${valueFont} flex cursor-pointer flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition sm:px-3 sm:py-2.5 ${
                              active
                                ? "border-[#17171B] bg-[#17171B] text-[#78D94F] shadow-sm"
                                : "border-gray-200 bg-[#F7F8F5] text-[#17171B] hover:border-[#17171B]"
                            } ${focus}`}
                          >
                            <span className="text-xs font-extrabold sm:text-sm">
                              {shortLabel}
                            </span>
                            <span
                              className={`mt-0.5 text-[10px] font-medium ${
                                active ? "text-gray-300" : "text-gray-500"
                              }`}
                            >
                              ({dims}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Specifications table */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-[#F7F8F5] p-3.5 sm:mt-6 sm:p-5">
                  <dl className="m-0 space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="shrink-0 font-medium text-gray-500">Product SKU</dt>
                      <dd
                        className={`${valueFont} m-0 font-bold text-[#17171B]`}
                      >
                        {product.sku}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-gray-200/70 pt-2">
                      <dt className="shrink-0 font-medium text-gray-500">Material</dt>
                      <dd className="m-0 text-right font-semibold text-[#17171B]">
                        {product.material}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-gray-200/70 pt-2">
                      <dt className="shrink-0 font-medium text-gray-500">Finish</dt>
                      <dd className="m-0 text-right font-semibold text-[#17171B]">
                        {product.finish}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-gray-200/70 pt-2">
                      <dt className="shrink-0 font-medium text-gray-500">Dimensions</dt>
                      <dd
                        className={`${valueFont} m-0 text-right font-semibold text-[#17171B]`}
                      >
                        {isMetalPoster ? selectedSize : product.dimensions}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Quantity + Actions */}
                <div className="mt-5 flex flex-row items-center gap-2.5 sm:mt-7 sm:gap-3.5">
                  {/* Quantity stepper */}
                  <div className="inline-flex h-12 w-28 shrink-0 items-center justify-between rounded-full border border-gray-300 bg-[#F7F8F5] px-1.5 sm:h-13 sm:w-36 sm:px-2">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      aria-label="Decrease quantity"
                      className={`grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-base font-bold text-[#17171B] transition hover:bg-white sm:h-9 sm:w-9 sm:text-lg ${focus}`}
                    >
                      −
                    </button>

                    <span
                      className={`${valueFont} text-sm font-extrabold text-[#17171B]`}
                    >
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                      aria-label="Increase quantity"
                      className={`grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-base font-bold text-[#17171B] transition hover:bg-white sm:h-9 sm:w-9 sm:text-lg ${focus}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`${head} inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-0 px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] transition duration-300 sm:h-13 sm:gap-2.5 sm:px-7 sm:text-xs sm:tracking-[0.16em] ${
                      justAdded
                        ? "bg-[#17171B] text-[#78D94F]"
                        : "bg-[#78D94F] text-[#17171B] hover:-translate-y-0.5 hover:bg-[#17171B] hover:text-white"
                    } ${focus}`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-4 w-4 stroke-[2.6]" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 shrink-0" />
                        <span>Add to Cart</span>
                        <span className={`${valueFont} hidden sm:inline`}>
                          • {rupee(product.price * quantity)}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now & Wishlist secondary actions */}
                <div className="mt-2.5 flex flex-row gap-2.5 sm:mt-3 sm:gap-3">
                  <Link
                    href="/cart"
                    onClick={handleAddToCart}
                    className={`${head} inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#17171B] bg-transparent px-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#17171B] no-underline transition hover:bg-[#17171B] hover:text-white sm:h-12 sm:px-6 sm:text-xs sm:tracking-[0.16em] ${focus}`}
                  >
                    Buy It Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleStoreWishlist(numericId)}
                    className={`inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-[11px] font-bold uppercase tracking-[0.1em] transition sm:h-12 sm:px-5 sm:text-xs sm:tracking-[0.12em] ${
                      isWishlisted
                        ? "border-[#17171B] bg-[#17171B] text-[#78D94F]"
                        : "border-gray-200 bg-[#F7F8F5] text-[#17171B] hover:border-[#17171B]"
                    } ${focus}`}
                  >
                    <Heart
                      className="h-4 w-4"
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                    {isWishlisted ? "Saved" : "Wishlist"}
                  </button>
                </div>

                {/* Live Toast Message */}
                {justAdded && (
                  <div
                    role="status"
                    className="mt-3.5 flex items-center justify-between rounded-2xl border border-[#78D94F]/40 bg-[#78D94F]/15 px-3.5 py-2.5 text-xs font-semibold text-[#17171B] sm:mt-4 sm:px-4 sm:py-3"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-emerald-700" />
                      <span>
                        <span className={valueFont}>{quantity}</span> item(s) added to cart.
                      </span>
                    </span>
                    <Link
                      href="/cart"
                      className="shrink-0 font-extrabold uppercase tracking-[0.12em] text-[#17171B] underline hover:text-emerald-800"
                    >
                      View Cart →
                    </Link>
                  </div>
                )}

                {/* Trust Highlights */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-gray-100 pt-5 sm:mt-7 sm:gap-3 sm:pt-6">
                  <div className="flex items-start gap-2.5 rounded-xl bg-[#F7F8F5] p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#17171B] text-[#78D94F] sm:h-9 sm:w-9 sm:rounded-xl">
                      <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <div>
                      <p
                        className={`${head} text-[11px] font-extrabold uppercase tracking-wider text-[#17171B] sm:text-xs`}
                      >
                        Fast Dispatch
                      </p>
                      <p className="mt-0.5 text-[10px] leading-snug text-gray-500 sm:text-[11px]">
                        Armored packaging
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl bg-[#F7F8F5] p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#17171B] text-[#78D94F] sm:h-9 sm:w-9 sm:rounded-xl">
                      <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <div>
                      <p
                        className={`${head} text-[11px] font-extrabold uppercase tracking-wider text-[#17171B] sm:text-xs`}
                      >
                        Premium Quality
                      </p>
                      <p className="mt-0.5 text-[10px] leading-snug text-gray-500 sm:text-[11px]">
                        Archival finish
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl bg-[#F7F8F5] p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#17171B] text-[#78D94F] sm:h-9 sm:w-9 sm:rounded-xl">
                      <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <div>
                      <p
                        className={`${head} text-[11px] font-extrabold uppercase tracking-wider text-[#17171B] sm:text-xs`}
                      >
                        Easy Replacement
                      </p>
                      <p className="mt-0.5 text-[10px] leading-snug text-gray-500 sm:text-[11px]">
                        7-day protection
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl bg-[#F7F8F5] p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#17171B] text-[#78D94F] sm:h-9 sm:w-9 sm:rounded-xl">
                      <PackageCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <div>
                      <p
                        className={`${head} text-[11px] font-extrabold uppercase tracking-wider text-[#17171B] sm:text-xs`}
                      >
                        Ready to Mount
                      </p>
                      <p className="mt-0.5 text-[10px] leading-snug text-gray-500 sm:text-[11px]">
                        No drilling needed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CRAFT & QUALITY STORY ================= */}
        <section className="border-y border-gray-200/80 bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 md:grid-cols-3 lg:px-10 lg:py-14">
            <div className="md:col-span-2">
              <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#78D94F] sm:text-xs sm:tracking-[0.24em]">
                <span className="h-0.5 w-6 bg-[#78D94F] sm:w-8" />
                Craftsmanship & Overview
              </p>
              <h2
                className={`${head} mt-2.5 text-xl font-extrabold uppercase tracking-tight text-[#17171B] sm:mt-3 sm:text-3xl`}
              >
                Built for Statement <span className="text-[#78D94F]">Spaces.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-gray-600 sm:mt-4 sm:text-[15px] sm:leading-7">
                {product.description} Every Epic Store creation is inspected for color accuracy, structural durability, and edge precision before leaving our studio so it arrives ready to transform your wall or desk immediately.
              </p>
            </div>

            <div className="rounded-2xl bg-[#17171B] p-4 text-white sm:rounded-3xl sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#78D94F] text-[#17171B] sm:h-10 sm:w-10 sm:rounded-2xl">
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#78D94F] sm:text-[11px]">
                    Studio Guarantee
                  </p>
                  <h3 className={`${head} text-sm font-extrabold text-white sm:text-base`}>
                    What&apos;s in the Box
                  </h3>
                </div>
              </div>
              <ul className="mt-3.5 space-y-2 pl-0 text-xs text-gray-300 sm:mt-4 sm:space-y-2.5">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#78D94F]" />
                  1 × {product.name}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#78D94F]" />
                  Protective foam-lined studio box
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-[#78D94F]" />
                  Mounting hardware / care guide included
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-3.5 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.24em] text-[#78D94F]">
                  <span className="h-0.5 w-8 bg-[#78D94F]" />
                  You May Also Like
                </p>
                <h2
                  className={`${head} mt-2.5 text-2xl font-extrabold uppercase tracking-tight text-[#17171B] sm:text-3xl`}
                >
                  Related <span className="text-[#78D94F]">Creations.</span>
                </h2>
              </div>

              <Link
                href={`/shop?collection=${encodeURIComponent(product.collection)}`}
                className={`${head} inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#17171B] no-underline transition hover:text-[#78D94F] ${focus}`}
              >
                Explore {product.collection}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((item) => {
                const itemDiscount = Math.round(
                  ((item.oldPrice - item.price) / item.oldPrice) * 100
                );
                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white no-underline transition duration-500 hover:-translate-y-1.5 hover:border-[#17171B]/20 hover:shadow-[0_22px_50px_-14px_rgba(23,23,27,0.14)] sm:rounded-3xl"
                  >
                    <div className="relative aspect-[4/4.6] overflow-hidden bg-[#ECEEE9]">
                      {item.badge && (
                        <span
                          className={`${head} absolute left-2.5 top-2.5 z-10 rounded-full bg-[#78D94F] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#17171B] sm:left-4 sm:top-4 sm:px-3.5 sm:text-[10px]`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <LoadingImage
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                            {item.collection}
                          </span>
                          <span
                            className={`${valueFont} inline-flex items-center gap-1 text-[11px] font-bold text-[#17171B]`}
                          >
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {item.rating}
                          </span>
                        </div>

                        <h3
                          className={`${head} mt-1.5 line-clamp-2 text-sm font-extrabold leading-snug text-[#17171B] transition-colors group-hover:text-[#78D94F] sm:text-base`}
                        >
                          {item.name}
                        </h3>
                      </div>

                      <div className="mt-3 flex items-baseline gap-2 border-t border-gray-100 pt-3">
                        <span
                          className={`${valueFont} text-base font-extrabold text-[#17171B] sm:text-lg`}
                        >
                          {rupee(item.price)}
                        </span>
                        <span
                          className={`${valueFont} text-xs text-gray-400 line-through`}
                        >
                          {rupee(item.oldPrice)}
                        </span>
                        <span
                          className={`${valueFont} ml-auto rounded-full bg-[#78D94F]/20 px-2 py-0.5 text-[10px] font-extrabold text-[#17171B]`}
                        >
                          -{itemDiscount}%
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur-md shadow-[0_-8px_24px_rgba(23,23,27,0.08)] sm:hidden">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-gray-500">
            {isMetalPoster ? selectedSize.split(" ")[0] : product.category}
          </p>
          <p className={`${valueFont} text-lg font-extrabold leading-tight text-[#17171B]`}>
            {rupee(product.price * quantity)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`${head} inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-0 px-6 text-xs font-extrabold uppercase tracking-[0.14em] transition ${
            justAdded
              ? "bg-[#17171B] text-[#78D94F]"
              : "bg-[#78D94F] text-[#17171B]"
          } ${focus}`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4 stroke-[2.5]" />
              Added
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>

      <Footer />
    </>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="min-h-[60vh] bg-[#F7F8F5]" />
          <Footer />
        </>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
