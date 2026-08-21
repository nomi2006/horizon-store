// import React from "react";
import type { Product } from "../data/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-[30px]">      {items.map((p) => (
      <ProductCard key={p.id} product={p} />
    ))}
    </div>
  );
}
