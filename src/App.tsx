// import React from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import {
  PopularSection,
  BestSellersSection,
  RecentSection,
} from "./components/Collections";
import { Features } from "./components/Features";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 text-gray-900">
      <div className="relative isolate bg-black py-2 text-center text-sm text-white">
        <span>✨ Fall Sale: Up to 30% off select models</span>
      </div>
      <Header />
      <Hero />
      <PopularSection />
      <BestSellersSection />
      <RecentSection />
      <Features />
      <Newsletter />
      <Footer />
      <BackToTop />
    </div>
  );
}
