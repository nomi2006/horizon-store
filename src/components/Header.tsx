import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Menu, ShoppingCart, X } from "lucide-react";
import { navLinks } from "../data/products";

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2 font-bold">
          <Clock className="h-6 w-6" /> WristCo
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium hover:text-black/70"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#"
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white"
          >
            Shop
          </a>
        </nav>
        <button
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-white md:hidden"
          >
            <div className="space-y-2 px-4 py-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#"
                className="mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
              >
                <ShoppingCart className="h-4 w-4" /> Shop
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
