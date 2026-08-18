import React from "react";
import { Link } from "react-router-dom";
import { Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        relative
        w-full
        h-[440px]
        bg-black
        text-white
        overflow-hidden
      "
    >
      {/* ================= MAIN FOOTER CONTENT ================= */}
      <div
        className="
          w-[1170px]
          h-[236px]
          mx-auto
          pt-[80px]
          grid
          grid-cols-[217px_286px_212px_1fr]
          gap-[87px]
        "
      >
        {/* ================= EXCLUSIVE ================= */}
        <div className="w-[217px] h-[188px]">
          <h3
            className="
              m-0
              p-0
              text-[24px]
              leading-[28px]
              font-semibold
              text-white
              mb-[24px]
            "
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            Exclusive
          </h3>

          <h4
            className="
              m-0
              p-0
              text-[20px]
              leading-[24px]
              font-medium
              text-white
              mb-[16px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Subscribe
          </h4>

          <p
            className="
              m-0
              p-0
              text-[16px]
              leading-[24px]
              font-normal
              text-white
              mb-[16px]
              whitespace-nowrap
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            Get 10% off your first order
          </p>

          {/* EMAIL INPUT */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="
              relative
              w-[217px]
              h-[48px]
              border
              border-white
              rounded-[4px]
              overflow-hidden
            "
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="
                w-full
                h-full
                bg-transparent
                outline-none
                border-none
                px-[16px]
                pr-[48px]
                text-white
                text-[16px]
                placeholder:text-[#7A7A7A]
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            />

            <button
              type="submit"
              aria-label="Subscribe"
              className="
                absolute
                right-[10px]
                top-1/2
                -translate-y-1/2
                flex
                items-center
                justify-center
                text-white
                cursor-pointer
                bg-transparent
                border-none
                p-0
              "
            >
              <Send
                size={24}
                strokeWidth={1.5}
              />
            </button>
          </form>
        </div>

        {/* ================= SUPPORT ================= */}
        <div className="w-[286px]">
          <h3
            className="
              m-0
              p-0
              text-[20px]
              leading-[28px]
              font-medium
              text-white
              mb-[16px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Support
          </h3>

          <p
            className="
              m-0
              p-0
              text-[16px]
              leading-[24px]
              text-white
              font-normal
              mb-[16px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            111 Phase 01, Karachi,
            <br />
            DHA 1515, Pakistan.
          </p>

          <p
            className="
              m-0
              p-0
              text-[16px]
              leading-[24px]
              text-white
              font-normal
              mb-[16px]
              whitespace-nowrap
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            muhammadnomanshahzad726@gmail.com
          </p>

          <p
            className="
              m-0
              p-0
              text-[16px]
              leading-[24px]
              text-white
              font-normal
              whitespace-nowrap
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            +88015-88888-9999
          </p>
        </div>

        {/* ================= ACCOUNT ================= */}
        <div className="w-[212px]">
          <h3
            className="
              m-0
              p-0
              text-[20px]
              leading-[28px]
              font-medium
              text-white
              mb-[16px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Account
          </h3>

          <div className="flex flex-col gap-[16px]">
            <Link
              to="/account"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              My Account
            </Link>

            <Link
              to="/login"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              Login / Register
            </Link>

            <Link
              to="/cart"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              Cart
            </Link>

            <Link
              to="/wishlist"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              Wishlist
            </Link>

            <Link
              to="/shop"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              Shop
            </Link>
          </div>
        </div>

        {/* ================= QUICK LINK ================= */}
        <div className="w-full">
          <h3
            className="
              m-0
              p-0
              text-[20px]
              leading-[28px]
              font-medium
              text-white
              mb-[16px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Quick Link
          </h3>

          <div className="flex flex-col gap-[16px]">
            <Link
              to="/privacy"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              Terms Of Use
            </Link>

            <Link
              to="/faq"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              FAQ
            </Link>

            <Link
              to="/contact"
              className="
                text-[16px]
                leading-[24px]
                text-white
                no-underline
                hover:text-gray-300
                transition-colors
              "
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              Contact
            </Link>
          </div>

          {/* ================= SOCIAL ICONS ================= */}
          <div className="flex items-center gap-[24px] mt-[28px]">
            <a
              href="https://www.facebook.com/profile.php?id=100074061113250"
              aria-label="Facebook"
              className="
                text-white
                hover:text-gray-300
                transition-colors
                cursor-pointer
              "
            >
              <Facebook size={20} strokeWidth={1.8} />
            </a>

            <a
              href="https://x.com/noman51255"
              aria-label="Twitter"
              className="
                text-white
                hover:text-gray-300
                transition-colors
                cursor-pointer
              "
            >
              <Twitter size={20} strokeWidth={1.8} />
            </a>

            <a
              href="https://www.instagram.com/nomantanoli__?igsh=OGd6azFqdjgwcmo4"
              aria-label="Instagram"
              className="
                text-white
                hover:text-gray-300
                transition-colors
                cursor-pointer
              "
            >
              <Instagram size={20} strokeWidth={1.8} />
            </a>

            <a
              href="https://www.linkedin.com/in/noman-shahzad-28a848291?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              aria-label="LinkedIn"
              className="
                text-white
                hover:text-gray-300
                transition-colors
                cursor-pointer
              "
            >
              <Linkedin size={20} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div
        className="
          absolute
          left-0
          bottom-0
          w-full
          h-[60px]
          bg-black
          border-t
          border-[#2A2A2A]
        "
      >
        <div
          className="
            w-[1170px]
            h-full
            mx-auto
            flex
            items-center
            justify-center
          "
        >
          <p
            className="
              m-0
              p-0
              text-[16px]
              leading-[24px]
              text-[#666666]
              font-normal
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            © Copyright Horizon {currentYear}. All right reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;