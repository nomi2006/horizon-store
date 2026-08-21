import React from "react";
import { Link } from "react-router-dom";
import { Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-white">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 pt-12 md:pt-[80px] pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[87px]">
          {/* EXCLUSIVE */}
          <div className="w-full">
            <h3 className="m-0 text-2xl leading-[28px] font-semibold text-white mb-4">
              Exclusive
            </h3>
            <h4 className="m-0 text-xl leading-[24px] font-medium text-white mb-4">
              Subscribe
            </h4>
            <p className="m-0 text-base leading-[24px] font-normal text-white mb-4">
              Get 10% off your first order
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-[217px] h-[48px] border border-white rounded-[4px] overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="w-full h-full bg-transparent outline-none border-none px-4 pr-12 text-white text-base placeholder:text-[#7A7A7A]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-white bg-transparent border-none p-0 cursor-pointer"
              >
                <Send size={24} strokeWidth={1.5} />
              </button>
            </form>
          </div>

          {/* SUPPORT */}
          <div className="w-full">
            <h3 className="m-0 text-xl leading-[28px] font-medium text-white mb-4">
              Support
            </h3>
            <p className="m-0 text-base leading-[24px] text-white font-normal mb-4">
              111 Phase 01, Karachi,<br />DHA 1515, Pakistan.
            </p>
            <p className="m-0 text-base leading-[24px] text-white font-normal mb-4 break-all">
              muhammadnomanshahzad726@gmail.com
            </p>
            <p className="m-0 text-base leading-[24px] text-white font-normal">
              +88015-88888-9999
            </p>
          </div>

          {/* ACCOUNT */}
          <div className="w-full">
            <h3 className="m-0 text-xl leading-[28px] font-medium text-white mb-4">
              Account
            </h3>
            <div className="flex flex-col gap-4">
              <Link to="/account" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                My Account
              </Link>
              <Link to="/login" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                Login / Register
              </Link>
              <Link to="/cart" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                Cart
              </Link>
              <Link to="/wishlist" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                Wishlist
              </Link>
              <Link to="/shop" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                Shop
              </Link>
            </div>
          </div>

          {/* QUICK LINK + SOCIAL */}
          <div className="w-full">
            <h3 className="m-0 text-xl leading-[28px] font-medium text-white mb-4">
              Quick Link
            </h3>
            <div className="flex flex-col gap-4">
              <Link to="/privacy" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                Terms Of Use
              </Link>
              <Link to="/faq" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                FAQ
              </Link>
              <Link to="/contact" className="text-base leading-[24px] text-white no-underline hover:text-gray-300 transition-colors">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <a href="https://www.facebook.com/profile.php?id=100074061113250" aria-label="Facebook" className="text-white hover:text-gray-300 transition-colors cursor-pointer">
                <Facebook size={20} strokeWidth={1.8} />
              </a>
              <a href="https://x.com/noman51255" aria-label="Twitter" className="text-white hover:text-gray-300 transition-colors cursor-pointer">
                <Twitter size={20} strokeWidth={1.8} />
              </a>
              <a href="https://www.instagram.com/nomantanoli__?igsh=OGd6azFqdjgwcmo4" aria-label="Instagram" className="text-white hover:text-gray-300 transition-colors cursor-pointer">
                <Instagram size={20} strokeWidth={1.8} />
              </a>
              <a href="https://www.linkedin.com/in/noman-shahzad-28a848291?utm_source=share_via&utm_content=profile&utm_medium=member_android" aria-label="LinkedIn" className="text-white hover:text-gray-300 transition-colors cursor-pointer">
                <Linkedin size={20} strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full bg-black border-t border-[#2A2A2A] py-4">
        <p className="text-center m-0 text-base leading-[24px] text-[#666666] font-normal">
          © Copyright Horizon {currentYear}. All right reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;