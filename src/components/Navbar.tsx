import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close mobile menu and account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }

      if (accountRef.current && !accountRef.current.contains(target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus with Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    setIsAccountOpen(false);
    setIsMenuOpen(false);

    await signOut();

    navigate('/');
  };

  const handleAccountClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsAccountOpen((prev) => !prev);
  };

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Main navigation
  // Logout is intentionally NOT included here.
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
    ...(user ? [] : [{ name: 'Sign Up', path: '/register' }]),
  ];

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-[72px]">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 h-full">
          <div className="flex items-center justify-between h-full">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors duration-200">
                Horizon
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 h-full">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`
                    relative text-[15px] font-normal text-gray-700
                    transition-all duration-150 ease-in-out
                    ${
                      hoveredLink === link.name
                        ? 'font-bold text-gray-900'
                        : ''
                    }
                    h-full flex items-center
                  `}
                >
                  {link.name}

                  <span
                    className={`
                      absolute bottom-0 left-0 h-[2px] bg-gray-900
                      transition-all duration-150 ease-in-out
                      ${
                        hoveredLink === link.name
                          ? 'w-full opacity-100'
                          : 'w-0 opacity-0'
                      }
                    `}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-5">

              {/* Search */}
              <div className="relative flex items-center">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="What are you looking for?"
                        className="w-[180px] md:w-[240px] h-[38px] px-4 pr-10 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors duration-200"
                      />

                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Submit search"
                      >
                        <svg
                          className="w-[18px] h-[18px]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close search"
                    >
                      <svg
                        className="w-[18px] h-[18px]"
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
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                    aria-label="Search"
                  >
                    <svg
                      className="w-[22px] h-[22px]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                aria-label="Wishlist"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="text-gray-600 hover:text-gray-900 transition-colors p-1 relative"
                aria-label="Cart"
              >
                <svg
                  className="w-[22px] h-[22px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>

                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={handleAccountClick}
                  className={`
                    flex items-center justify-center
                    transition-all duration-200
                    focus:outline-none
                    ${
                      user
                        ? 'w-[32px] h-[32px] rounded-full bg-red-500 text-white hover:bg-red-600'
                        : 'text-gray-600 hover:text-gray-900 p-1'
                    }
                  `}
                  aria-label={user ? 'Account menu' : 'Login'}
                  aria-expanded={user ? isAccountOpen : undefined}
                >
                  <svg
                    className={user ? 'w-[19px] h-[19px]' : 'w-[22px] h-[22px]'}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 21a8 8 0 00-16 0m12-12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </button>

                {/* Logged-in Account Dropdown */}
                {user && isAccountOpen && (
                  <div className="absolute right-0 top-[44px] w-[235px] rounded-md overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950 shadow-2xl border border-white/10">
                    <div className="py-2">

                      {/* Manage My Account */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-white hover:bg-white/10 transition-colors"
                      >
                        <svg
                          className="w-[18px] h-[18px] flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 21a8 8 0 00-16 0m12-12a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span>Manage My Account</span>
                      </button>

                      {/* My Order */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('/orders');
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-white hover:bg-white/10 transition-colors"
                      >
                        <svg
                          className="w-[18px] h-[18px] flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 6h8M8 10h8M8 14h5"
                          />
                        </svg>
                        <span>My Order</span>
                      </button>

                      {/* My Cancellations */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('/orders');
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-white hover:bg-white/10 transition-colors"
                      >
                        <svg
                          className="w-[18px] h-[18px] flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 7h6m-8 4h10m-8 4h6m5-12H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 19l6-6m0 6l-6-6"
                          />
                        </svg>
                        <span>My Cancellations</span>
                      </button>

                      {/* My Reviews */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('/orders');
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-white hover:bg-white/10 transition-colors"
                      >
                        <svg
                          className="w-[18px] h-[18px] flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 17.3l5.15 3.1-1.37-5.87 4.56-3.95-6.02-.51L12 4.5 9.68 10.07l-6.02.51 4.56 3.95-1.37 5.87L12 17.3z"
                          />
                        </svg>
                        <span>My Reviews</span>
                      </button>

                      {/* Divider */}
                      <div className="my-1 border-t border-white/10" />

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-left text-[14px] text-white hover:bg-white/10 transition-colors"
                      >
                        <svg
                          className="w-[18px] h-[18px] flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12H3m0 0l4-4m-4 4l4 4M21 4v16a2 2 0 01-2 2H9"
                          />
                        </svg>
                        <span>Logout</span>
                      </button>

                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="mobile-nav-panel lg:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-down overflow-y-auto max-h-[80vh]"
          >
            <div className="max-w-[1170px] mx-auto px-4 py-4">
              <div className="flex flex-col gap-3">

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="flex-1 h-[42px] px-4 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-l-md focus:outline-none focus:border-gray-400"
                  />

                  <button
                    type="submit"
                    className="h-[42px] px-4 bg-gray-900 text-white rounded-r-md hover:bg-gray-800 transition-colors"
                    aria-label="Search"
                  >
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </form>

                {/* Mobile Main Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[15px] font-normal text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-150 py-1"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Wishlist */}
                <Link
                  to="/wishlist"
                  className="text-[15px] font-normal text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-150 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>

                {/* Mobile Cart */}
                <Link
                  to="/cart"
                  className="text-[15px] font-normal text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-150 py-1 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart

                  {cartItemCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Mobile Account */}
                {user ? (
                  <>
                    <div className="border-t border-gray-200 pt-3 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full text-left text-[15px] font-normal text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-150 py-1"
                      >
                        Manage My Account
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/orders');
                        }}
                        className="w-full text-left text-[15px] font-normal text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-150 py-1 mt-2"
                      >
                        My Order
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left text-[15px] font-normal text-red-500 hover:text-red-600 transition-colors py-1 mt-2"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/login');
                    }}
                    className="text-left text-[15px] font-normal text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-150 py-1"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
