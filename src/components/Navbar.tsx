import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Temporary: Check if user is logged in via localStorage or session
  // This is a placeholder until auth is properly implemented
  const user = null; // Will be replaced with actual auth

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-red-600 transition-colors">
                Horizon
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors">
                Home
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors">
                Contact
              </Link>
              <Link to="/about" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors">
                About
              </Link>
              {user ? (
                <button
                  onClick={() => {/* logout logic */}}
                  className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors">
                  Sign Up
                </Link>
              )}
            </div>

            {/* Desktop Right Icons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What are you looking for?"
                      className="w-48 lg:w-64 px-4 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-r hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    aria-label="Search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="text-gray-600 hover:text-red-600 transition-colors relative"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="text-gray-600 hover:text-red-600 transition-colors relative"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {/* Cart count - will be implemented when cart is available */}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div ref={menuRef} className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
              <div className="flex flex-col gap-3">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-r hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>

                <Link to="/" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/contact" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                <Link to="/about" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                {user ? (
                  <>
                    <Link to="/profile" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      My Account
                    </Link>
                    <button
                      onClick={() => {/* logout logic */}}
                      className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                )}
                <Link to="/wishlist" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Wishlist
                </Link>
                <Link to="/cart" className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;