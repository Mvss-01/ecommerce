// components/Footer.tsx
import Image from 'next/image';

import {
  FaShoppingCart, FaSearch, FaInstagram,
  FaFacebookF, FaTimes
} from 'react-icons/fa';
import { HiMenuAlt3 } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-5 px-6 md:px-12" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Section Marque */}
        <div className="flex flex-col items-start gap-4">
          <img src="logo2.png" alt="Logo" className="w-20 mb-2" />
          <h2 className="text-2xl font-extrabold tracking-wide text-black">La Perle</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            اليكِ ولجمالكِ. حيث تجتمع الأنوثة مع الجودة العالية لتكتمل أناقتكِ اليومية
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all text-xl">
              <FaFacebookF />
            </a>
          </div>
        </div>

        {/* Boutique Links */}
        <div className='mt-5'>
          <h3 className="text-xs font-bold tracking-[0.2em] text-black mb-6 uppercase">Boutique</h3>
          <ul className="space-y-3">
            <li><a href="/contact" className="text-gray-500 hover:text-black hover:pr-2 transition-all text-[15px]">تواصل معنا</a></li>
            {/* <li><a href="#" className="text-gray-500 hover:text-black hover:pr-2 transition-all text-[15px]">حول المتجر</a></li> */}
            <li><a href="#" className="text-gray-500 hover:text-black hover:pr-2 transition-all text-[15px]">الأسئلة الشائعة</a></li>
          </ul>
        </div>

        {/* Livraison Links */}
        <div className='mt-5'>
          <h3 className="text-xs font-bold tracking-[0.2em] text-black mb-6 uppercase">التوصيل</h3>
          <ul className="space-y-3">
            <li><a href="/prix-livraison" className="text-gray-500 hover:text-black hover:pr-2 transition-all text-[15px]">أسعار التوصيل</a></li>
            {/* <li><a href="#" className="text-gray-500 hover:text-black hover:pr-2 transition-all text-[15px]">سياسة الاسترجاع</a></li> */}
          </ul>
        </div>

      </div>
    </footer>
  );
}