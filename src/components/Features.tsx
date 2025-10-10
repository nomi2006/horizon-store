import React from "react";
import { motion } from "framer-motion";
import { Clock, Mail, ShieldCheck, ShoppingCart } from "lucide-react";
import { Section } from "./Section";

export function Features() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Sapphire Crystal",
      text: "Scratch‑resistant clarity that lasts.",
    },
    {
      icon: Clock,
      title: "Swiss Movement",
      text: "Precision timekeeping you can trust.",
    },
    {
      icon: ShoppingCart,
      title: "Free Returns",
      text: "30‑day risk‑free trials.",
    },
    { icon: Mail, title: "Support 24/7", text: "Real humans, real answers." },
  ];
  return (
    <Section
      id="features"
      eyebrow="Why WristCo"
      title="Engineered to endure."
      description="We obsess over the details so you can focus on what matters."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <Icon className="h-6 w-6" />
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
