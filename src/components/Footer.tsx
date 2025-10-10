// import React from "react";
import { Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <a href="#" className="flex items-center gap-2 font-bold">
            <Clock className="h-5 w-5" /> WristCo
          </a>
          <p className="mt-3 text-sm text-gray-600">
            Precision watches designed in Vancouver, shipped worldwide.
          </p>
        </div>
        {[
          {
            title: "Shop",
            links: ["All Watches", "Men", "Women", "Accessories"],
          },
          {
            title: "Company",
            links: ["About", "Careers", "Sustainability", "Press"],
          },
          {
            title: "Support",
            links: ["Help Center", "Warranty", "Shipping", "Returns"],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-black/70">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-gray-500 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} WristCo. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-black/70">
              Privacy
            </a>
            <a href="#" className="hover:text-black/70">
              Terms
            </a>
            <a href="#" className="hover:text-black/70">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
