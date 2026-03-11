"use client";

// Added new icons for the modern menu layout
import {
  Search, ShoppingCart, Menu, X, Home,
  Grid, ShoppingBag, Package, Phone, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Noto_Kufi_Arabic } from 'next/font/google';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700']
});

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    // 1. Unified function to update both Count and Total Price
    const updateCartData = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);

          // Calculate total quantity
          const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartCount(count);

          // Calculate total price
          const total = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          setTotalPrice(total);

        } catch (error) {
          console.error("Error loading cart:", error);
          setCartCount(0);
          setTotalPrice(0);
        }
      } else {
        setCartCount(0);
        setTotalPrice(0);
      }
    };

    // Initial load
    updateCartData();

    // 2. Listen for changes
    const handleStorageChange = () => updateCartData();
    const handleCartUpdated = () => updateCartData();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div className="bg-white flex flex-col">
      {/* Changed px-20 to px-4 md:px-20 for mobile optimization */}
      <nav className={`border-b border-black/30 bg-white p-4 fixed top-0 left-0 w-full z-50 text-black px-4 md:px-20 ${notoKufi.className}`}>
        {/* Added flex-wrap for mobile dropping */}
        <div className="container flex flex-wrap items-center justify-between gap-4">

          {/* Cart and Currency - Mobile: Top Left, PC: Left */}
          <Link href="/checkout" className="order-1 flex items-center gap-2 text-lg font-bold text-black hover:text-gray-700 transition-colors relative">
            <span dir='rtl'>{totalPrice} دج</span>
            <div className="relative">
              <ShoppingCart className="w-8 h-8" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* Search Bar - Mobile: Bottom Row (w-full), PC: Middle (md:w-auto md:flex-1) */}
          <form onSubmit={handleSearch} className="hidden md:block order-3 w-full md:order-2 md:w-auto md:flex-1 max-w-3xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="...ابحث عن منتج"
              className="w-full bg-black/5 rounded-full py-2 px-10 text-right outline-none focus:ring-2 focus:ring-black/5"
            />
            <button type="submit" className="absolute left-3 top-2.5">
              <Search className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
            </button>
          </form>

          {/* Logo and Menu Button - Mobile: Top Right, PC: Right */}
          <div className="order-2 md:order-3 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex items-center gap-5">
                <span className="font-bold text-lg tracking-tighter hidden sm:block text-black">La Perle</span>
                <img
                  src="/logo2.png"
                  alt="Logo"
                  className="h-12 w-auto rounded"
                />
              </div>
            </Link>
            <div className='p-2 hover:bg-gray-100 rounded-full transition duration-200'>
              <button onClick={() => setIsMenuOpen(true)} className="flex flex-col gap-1.5 p-1">
                <Menu className="w-6 h-6 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MODERN MOBILE MENU DRAWER --- */}
      <div
        className={`fixed inset-0 z-[100] ${isMenuOpen ? "visible" : "invisible"
          } ${notoKufi.className}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out transform-gpu ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xl tracking-tight text-black">La Perle</span>
              <img src="/logo2.png" alt="Logo" className="h-10 w-auto rounded" />
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 md:hidden">
            <form onSubmit={handleSearch} className="order-3 w-full md:order-2 md:w-auto md:flex-1 max-w-3xl relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="...ابحث عن منتج"
                className="w-full bg-black/5 rounded-full py-2 px-10 text-right text-black outline-none focus:ring-2 focus:ring-black/5"
              />
              <button onClick={() => setIsMenuOpen(false)} type="submit" className="absolute left-3 top-2.5">
                <Search className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="flex flex-col gap-2" dir="rtl">
              {[
                { label: "الرئيسية", icon: Home, href: "/" },
                // { label: "التصنيفات", icon: Grid, href: "#" },
                { label: "سلة التسوق", icon: ShoppingBag, href: "/checkout" },
                // { label: "حالة الطلب", icon: Package, href: "#" },
                { label: "تواصل معنا", icon: Phone, href: "#" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4 text-gray-600 group-hover:text-black font-semibold text-lg">
                    <item.icon className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                    {item.label}
                  </div>
                  <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:-translate-x-1 transition-transform" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-6">
            <a
              href="#"
              className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all hover:scale-110"
            >
              <FaInstagram className="text-xl" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all hover:scale-110"
            >
              <FaFacebookF className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}