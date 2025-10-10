import React, { useMemo } from "react";
import { Section } from "./Section";
import { products as all } from "../data/products";
import type { Product } from "../data/products";
import { ProductGrid } from "./ProductGrid";

export function PopularSection() {
  const items = useMemo<Product[]>(
    () => all.filter((p) => p.tags?.includes("popular")).slice(0, 8),
    []
  );
  return (
    <Section
      id="popular"
      eyebrow="Trending Now"
      title="Popular Picks"
      description="Fan favorites with timeless designs and everyday durability."
    >
      <ProductGrid items={items} />
    </Section>
  );
}

export function BestSellersSection() {
  const items = useMemo<Product[]>(
    () => all.filter((p) => p.tags?.includes("bestseller")).slice(0, 8),
    []
  );
  return (
    <Section
      id="bestsellers"
      eyebrow="Top Rated"
      title="Best Sellers"
      description="Our most-loved timepieces, trusted by thousands."
    >
      <ProductGrid items={items} />
    </Section>
  );
}

export function RecentSection() {
  const items = useMemo<Product[]>(
    () =>
      all
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8),
    []
  );
  return (
    <Section
      id="recent"
      eyebrow="Just In"
      title="Recent Arrivals"
      description="Fresh releases and limited drops straight from the studio."
    >
      <ProductGrid items={items} />
    </Section>
  );
}
