// components/Navbar.tsx
"use client";

import { Search, ShoppingCart, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // <-- Import these
import { Noto_Kufi_Arabic } from 'next/font/google';

const notoKufi = Noto_Kufi_Arabic({ 
  subsets: ['arabic'], 
  weight: ['400', '700'] 
});

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

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
    <nav className={`border-b border-black/30 bg-white p-4 sticky top-0 z-50 text-black px-20 ${notoKufi.className}`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Cart and Currency */}
        <Link href="/checkout" className="flex items-center gap-2 text-lg font-bold text-black hover:text-gray-700 transition-colors relative">
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

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="...ابحث عن منتج"
            className="w-full bg-gray-100 rounded-full py-2 px-10 text-right outline-none focus:ring-2 focus:ring-black/5"
          />
          <button type="submit" className="absolute left-3 top-2.5">
            <Search className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
          </button>
        </form>

        {/* Logo and Menu */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="font-bold text-lg tracking-tighter">PRIMZO HOMME</span>
            </div>
          </Link>
          <div className='p-2 hover:bg-gray-200 rounded-lg transition duration-100'>
            <Menu className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
}