export type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
  createdAt: string; // ISO
};

export const products: Product[] = [
  {
    id: 1,
    name: "Apex Chrono",
    price: 299,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    tags: ["popular", "bestseller"],
    createdAt: "2025-09-20",
  },
  {
    id: 2,
    name: "Noir Classic",
    price: 229,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1200&auto=format&fit=crop",
    tags: ["popular"],
    createdAt: "2025-08-18",
  },
  {
    id: 3,
    name: "Aurora Steel",
    price: 349,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop",
    tags: ["bestseller"],
    createdAt: "2025-09-30",
  },
  {
    id: 4,
    name: "Terra Field",
    price: 189,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop",
    tags: ["recent"],
    createdAt: "2025-10-02",
  },
  {
    id: 5,
    name: "Lumen GMT",
    price: 399,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1539887163603-9b09b1c2026f?q=80&w=1200&auto=format&fit=crop",
    tags: ["popular", "recent"],
    createdAt: "2025-10-07",
  },
  {
    id: 6,
    name: "Drift Diver",
    price: 259,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop",
    tags: ["bestseller"],
    createdAt: "2025-07-11",
  },
  {
    id: 7,
    name: "Echo Minimal",
    price: 159,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop",
    tags: ["recent"],
    createdAt: "2025-09-28",
  },
  {
    id: 8,
    name: "Ember Automatic",
    price: 449,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop",
    tags: ["bestseller", "popular"],
    createdAt: "2025-06-01",
  },
];

export const navLinks = [
  { href: "#popular", label: "Popular" },
  { href: "#bestsellers", label: "Best Sellers" },
  { href: "#recent", label: "Recent" },
  { href: "#features", label: "Features" },
  { href: "#newsletter", label: "Newsletter" },
];

export const formatPrice = (n: number) => `$${n.toFixed(2)}`;
