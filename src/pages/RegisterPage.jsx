import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

import authImage from "../assets/login-signup-page.jpg";
import TopBar from "../components/TopBar";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.11-1.09.31-1.59V7.88H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.12l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
      />
    </svg>
  );
}

function PageHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const openSearch = () => {
    setIsSearchOpen(true);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    closeSearch();
  };

  return (
    <header className="w-full bg-white">
      <TopBar />

      <nav className="h-[76px] border-b border-[#E5E5E5] bg-white">
        <div className="mx-auto flex h-full w-full max-w-[1170px] items-center px-5">

          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 text-2xl font-bold tracking-tight text-gray-900 transition-colors duration-200 hover:text-gray-700"
          >
            Horizon
          </Link>

          {/* Navbar Content */}
          <div className="ml-auto flex h-full flex-1 items-center">

            {/* Center Navigation */}
            <div className="flex flex-1 items-center justify-center">
              <div className="flex items-center gap-[40px]">

                <Link
                  to="/"
                  className="text-[14px] leading-[24px] text-black transition-all duration-200 hover:underline hover:underline-offset-[5px]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Home
                </Link>

                <Link
                  to="/contact"
                  className="text-[14px] leading-[24px] text-black transition-all duration-200 hover:underline hover:underline-offset-[5px]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Contact
                </Link>

                <Link
                  to="/about"
                  className="text-[14px] leading-[24px] text-black transition-all duration-200 hover:underline hover:underline-offset-[5px]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  About
                </Link>

                <Link
                  to="/register"
                  className="text-[14px] leading-[24px] text-black transition-all duration-200 hover:underline hover:underline-offset-[5px]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Sign Up
                </Link>

              </div>
            </div>

            {/* Search */}
            <div className="relative flex flex-shrink-0 items-center">

              {isSearchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center"
                >
                  <div className="relative">

                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What are you looking for?"
                      className="h-[38px] w-[240px] rounded-md border border-gray-200 bg-gray-50 px-4 pr-10 text-sm text-gray-900 transition-colors duration-200 focus:border-gray-400 focus:outline-none"
                    />

                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                      aria-label="Submit search"
                    >
                      <Search
                        size={18}
                        strokeWidth={1.5}
                      />
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={closeSearch}
                    className="ml-2 text-gray-400 transition-colors hover:text-gray-600"
                    aria-label="Close search"
                  >
                    <svg
                      className="h-[18px] w-[18px]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={openSearch}
                  className="p-1 text-gray-600 transition-colors hover:text-gray-900"
                  aria-label="Search"
                >
                  <Search
                    size={22}
                    strokeWidth={1.5}
                  />
                </button>
              )}

            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}

function PageFooter() {
  return (
    <footer className="w-full bg-black text-white">
      <div className="mx-auto w-full max-w-[1170px] px-5 pt-[80px] pb-[76px]">

        <div className="grid grid-cols-[217px_286px_212px_1fr] gap-[87px]">

          {/* Subscribe */}
          <div>
            <h3
              className="m-0 mb-[24px] text-[24px] font-semibold leading-[28px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Exclusive
            </h3>

            <h4
              className="m-0 mb-[16px] text-[20px] font-medium leading-[24px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Subscribe
            </h4>

            <p
              className="m-0 mb-[16px] text-[16px] leading-[24px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Get 10% off your first order
            </p>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="relative h-[48px] w-[217px] overflow-hidden rounded-[4px] border border-white"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="h-full w-full border-0 bg-transparent px-[16px] pr-[48px] text-[16px] text-white outline-none placeholder:text-[#7A7A7A]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />

              <button
                type="submit"
                className="absolute right-[10px] top-1/2 flex -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-white"
                aria-label="Subscribe"
              >
                <Send size={22} strokeWidth={1.5} />
              </button>
            </form>
          </div>

          {/* Support */}
          <div>
            <h3
              className="m-0 mb-[16px] text-[20px] font-medium leading-[28px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Support
            </h3>

            <div
              className="space-y-[12px] text-[16px] leading-[24px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <p className="m-0">
                111 Bijoy sarani, Dhaka,
                <br />
                DH 1515, Bangladesh.
              </p>

              <p className="m-0">exclusive@gmail.com</p>
              <p className="m-0">+88015-88888-9999</p>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3
              className="m-0 mb-[16px] text-[20px] font-medium leading-[28px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Account
            </h3>

            <div
              className="flex flex-col gap-[16px] text-[16px] leading-[24px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <Link to="/account">My Account</Link>
              <Link to="/login">Login / Register</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/shop">Shop</Link>
            </div>
          </div>

          {/* Quick Link */}
          <div>
            <h3
              className="m-0 mb-[16px] text-[20px] font-medium leading-[28px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Quick Link
            </h3>

            <div
              className="flex flex-col gap-[16px] text-[16px] leading-[24px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms Of Use</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          {/* Download App */}
          <div className="min-w-0">
            <h3
              className="m-0 mb-[16px] text-[20px] font-medium leading-[28px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Download App
            </h3>

            <p
              className="m-0 mb-[8px] text-[12px] leading-[18px] text-[#B5B5B5]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Save $3 with App New User Only
            </p>

            <div className="flex items-center gap-[10px]">
              <QrCode />

              <div className="flex flex-col gap-[5px]">
                <PlayStoreBadge />
                <AppStoreBadge />
              </div>
            </div>

            <div className="mt-[24px] flex items-center gap-[24px]">
              <a href="#" aria-label="Facebook">
                <Facebook size={20} strokeWidth={1.7} />
              </a>

              <a href="#" aria-label="Twitter">
                <Twitter size={20} strokeWidth={1.7} />
              </a>

              <a href="#" aria-label="Instagram">
                <Instagram size={20} strokeWidth={1.7} />
              </a>

              <a href="#" aria-label="LinkedIn">
                <Linkedin size={20} strokeWidth={1.7} />
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="flex h-[60px] items-center justify-center border-t border-[#2A2A2A]">
        <p
          className="m-0 text-[16px] leading-[24px] text-[#666666]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          © Copyright Rimel 2022. All right reserved
        </p>
      </div>
    </footer>
  );
}

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const { error } = await signUp(
        data.email,
        data.password,
        data.fullName
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-black">

      <PageHeader />

      <main className="w-full bg-white">
        <section className="w-full">

          <div className="mx-auto flex min-h-[900px] w-full max-w-[1440px] items-center">

            {/* LEFT IMAGE */}
            <div className="hidden w-1/2 self-stretch items-center justify-center overflow-hidden rounded-r-[4px] bg-[#CBE4E8] lg:flex">
              <img
                src={authImage}
                alt="Create an account"
                className="h-full w-full object-contain"
              />
            </div>

            {/* RIGHT FORM */}
            <div className="flex w-full items-center justify-center px-6 py-[80px] lg:w-1/2 lg:px-[72px]">
              <div className="w-full max-w-[371px]">
                <div className="mb-[48px]">
                  <h1
                    className="m-0 text-[36px] font-medium leading-[44px] tracking-[0.01em] text-black"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Create an account
                  </h1>
                  <p
                    className="m-0 mt-[16px] text-[16px] leading-[24px] text-black"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Enter your details below
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full"
                >

                  {/* Name */}
                  <div className="mb-[40px]">
                    <input
                      id="fullName"
                      type="text"
                      {...register("fullName")}
                      placeholder="Name"
                      autoComplete="name"
                      className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-[8px] text-[16px] leading-[24px] text-black outline-none placeholder:text-[#7D7D7D] focus:border-black focus:ring-0"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-[12px] text-[#DB4444]">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-[40px]">
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="Email or Phone Number"
                      autoComplete="email"
                      className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-[8px] text-[16px] leading-[24px] text-black outline-none placeholder:text-[#7D7D7D] focus:border-black focus:ring-0"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                    {errors.email && (
                      <p className="mt-2 text-[12px] text-[#DB4444]">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-[32px]">
                    <input
                      id="password"
                      type="password"
                      {...register("password")}
                      placeholder="Password"
                      autoComplete="new-password"
                      className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-[8px] text-[16px] leading-[24px] text-black outline-none placeholder:text-[#7D7D7D] focus:border-black focus:ring-0"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                    {errors.password && (
                      <p className="mt-2 text-[12px] text-[#DB4444]">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Create Account */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-[56px] w-full rounded-[4px] border-0 bg-[#DB4444] text-[16px] font-medium leading-[24px] text-white transition-colors duration-200 hover:bg-[#C73636] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={() =>
                      toast.error(
                        "Google sign-up is not configured yet."
                      )
                    }
                    className="mt-[16px] flex h-[56px] w-full items-center justify-center gap-[12px] rounded-[4px] border border-[#7D7D7D] bg-white text-[16px] font-medium leading-[24px] text-black transition-colors duration-200 hover:bg-[#F5F5F5]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <GoogleIcon />
                    <span>Sign up with Google</span>
                  </button>

                  {/* Login */}
                  <div className="mt-[32px] flex items-center justify-center gap-[8px]">
                    <span
                      className="text-[16px] leading-[24px] text-[#7D7D7D]"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Already have an account?
                    </span>
                    <Link
                      to="/login"
                      className="border-b border-black pb-[1px] text-[16px] font-medium leading-[24px] text-black hover:border-[#DB4444] hover:text-[#DB4444]"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Log in
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}