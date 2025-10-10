import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Clock, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-tr from-black/10 to-transparent blur-3xl" />
        <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-gradient-to-tr from-gray-400/20 to-transparent blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="order-2 space-y-6 lg:order-1 lg:col-span-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" /> 5-year warranty
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Precision Timepieces for Modern Life
          </h1>
          <p className="text-lg text-gray-600">
            Meticulously engineered watches with sapphire crystal, surgical
            steel, and Swiss-movement options. Built to perform. Designed to
            impress.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#bestsellers"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"
            >
              Shop Best Sellers <ChevronRight className="h-4 w-4" />
            </a>
            <a
              href="#popular"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-3"
            >
              Explore Collection
            </a>
          </div>
          <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> 2-year battery
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> 50m water resistance
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2 lg:col-span-6"
        >
          <div className="relative mx-auto aspect-[5/6] w-full max-w-md overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
              alt="Hero Watch"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2 text-sm shadow-sm"
            >
              Free express shipping
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
