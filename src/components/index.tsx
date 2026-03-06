"use client";

import React, { useState } from 'react';
import { 
  FaShoppingCart, FaSearch, FaInstagram, 
  FaFacebookF, FaTimes 
} from 'react-icons/fa';
import { HiMenuAlt3 } from 'react-icons/hi';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center p-3 md:px-8 border-b border-gray-100 sticky top-0 bg-white z-40">
        <div className="flex items-center gap-2 font-bold text-sm">
          <FaShoppingCart className="text-lg" />
          <span className="cart-total">0 دج</span>
        </div>

        <div className="flex-1 max-w-xl mx-4 md:mx-10 bg-[#f1f3f5] rounded-full flex items-center px-4 py-2">
          <input 
            type="text" 
            placeholder="...ابحث عن منتج" 
            className="bg-transparent w-full text-right outline-none text-sm" 
            dir="rtl"
          />
          <FaSearch className="text-gray-400 ml-2" />
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-lg hidden sm:inline">La Perle</span>
          <img 
            src="/image/Atelier des fillle.png" 
            alt="Logo" 
            className="h-10 w-auto rounded"
          />
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="flex flex-col gap-1.5 p-1"
          >
            <span className="w-6 h-0.5 bg-black rounded"></span>
            <span className="w-6 h-0.5 bg-black rounded"></span>
            <span className="w-6 h-0.5 bg-black rounded"></span>
          </button>
        </div>
      </header>

      {/* --- MENU OVERLAY --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMenuOpen(false)} 
          />
          
          <div className="bg-white w-full max-w-md rounded-2xl p-8 relative z-10 text-right animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="absolute left-6 top-6 text-2xl text-gray-400 hover:text-black"
            >
              <FaTimes />
            </button>

            <div className="flex items-center justify-end gap-3 mb-10">
              <span className="font-bold text-xl">La Perle</span>
              <img src="/image/Atelier des fillle.png" alt="Logo" className="h-8 w-auto" />
            </div>

            <nav className="flex flex-col gap-6 font-bold text-lg mb-10 border-t pt-8 border-gray-100">
              <a href="#" className="hover:pr-2 transition-all">الرئيسية</a>
              <a href="#" className="hover:pr-2 transition-all">التصنيفات</a>
              <a href="#" className="hover:pr-2 transition-all">سلة التسوق</a>
              <a href="#" className="hover:pr-2 transition-all">حالة الطلب</a>
              <a href="#" className="hover:pr-2 transition-all">تواصل معنا</a>
            </nav>

            <div className="flex justify-center gap-8 text-3xl">
              <a href="#" className="text-[#E1306C] hover:scale-110 transition-transform"><FaInstagram /></a>
              <a href="#" className="text-[#1877F2] hover:scale-110 transition-transform"><FaFacebookF /></a>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-grow">
        {/* Ajoutez ici votre contenu de page (produits, etc.) */}
      </main>

      {/* --- FOOTER --- */}
 

    </div>
  );
}