import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

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

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await signIn(
        data.email,
        data.password
      );
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Welcome back!");
      navigate(from, { replace: true });
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
                alt="Login to your account"
                className="h-full w-full object-contain"
              />
            </div>

            {/* RIGHT LOGIN FORM */}
            <div className="flex w-full items-center justify-center px-6 py-[80px] lg:w-1/2 lg:px-[72px]">
              <div className="w-full max-w-[371px]">

                {/* Heading */}
                <div className="mb-[48px]">
                  <h1
                    className="m-0 text-[36px] font-medium leading-[44px] tracking-[0.01em] text-black"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Log in to Horizon
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
                  <div className="mb-[16px]">
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Password"
                        autoComplete="current-password"
                        className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-[8px] pr-[40px] text-[16px] leading-[24px] text-black outline-none placeholder:text-[#7D7D7D] focus:border-black focus:ring-0"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        className="absolute right-0 top-[2px] text-[13px] text-[#7D7D7D] transition-colors hover:text-black"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-2 text-[12px] text-[#DB4444]">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Forgot Password */}
                  <div className="mb-[32px] flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-[14px] leading-[24px] text-[#DB4444] transition-colors duration-200 hover:text-[#C73636]"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-[56px] w-full rounded-[4px] border-0 bg-[#DB4444] text-[16px] font-medium leading-[24px] text-white transition-colors duration-200 hover:bg-[#C73636] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {loading ? "Signing in..." : "Log In"}
                  </button>

                  {/* Register */}
                  <div className="mt-[32px] flex items-center justify-center gap-[8px]">
                    <span
                      className="text-[16px] leading-[24px] text-[#7D7D7D]"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Don't have an account?
                    </span>
                    <Link
                      to="/register"
                      className="border-b border-black pb-[1px] text-[16px] font-medium leading-[24px] text-black transition-colors duration-200 hover:border-[#DB4444] hover:text-[#DB4444]"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Sign Up
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