// components/Navbar.tsx
import { Search, ShoppingCart, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-black/30 bg-white p-4 sticky top-0 z-50 text-black px-20">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Cart and Currency */}
        <div className="flex items-center gap-2 text-lg font-bold text-black">
          <span dir='rtl'>3000 دج</span>

          <ShoppingCart className="w-8 h-8" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl relative">
          <input
            type="text"
            placeholder="...ابحث عن منتج"
            className="w-full bg-gray-100 rounded-full py-2 px-10 text-right outline-none focus:ring-2 focus:ring-black/5"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Logo and Menu */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="font-bold text-lg tracking-tighter">PRIMZO HOMME</span>
          </div>
          <div className="bg-[#1a2e1a] p-1 rounded">
            <div className="w-8 h-8 flex items-center justify-center text-white text-[8px] font-bold">PRIMZO</div>
          </div>
          <Menu className="w-6 h-6 cursor-pointer" />

        </div>
      </div>
    </nav>
  );
}