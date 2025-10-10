import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "../data/products";
import { formatPrice } from "../data/products";

const Stars = ({ rating }: { rating: number }) => (
  <div className="mt-1 flex items-center gap-1 text-amber-500">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.round(rating) ? "fill-current" : ""}`}
      />
    ))}
  </div>
);

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.tags?.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <Stars rating={product.rating} />
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{formatPrice(product.price)}</p>
            <p className="text-xs text-gray-500">incl. taxes</p>
          </div>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border bg-black px-4 py-2.5 text-white transition hover:bg-gray-900">
          <ShoppingCart className="h-4 w-4" /> Add to cart
        </button>
      </div>
    </motion.div>
  );
}
