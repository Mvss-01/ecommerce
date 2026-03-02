// components/Footer.tsx
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t bg-white py-5 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Brand Logo Section */}
          <div className="flex flex-col items-center md:items-start order-1 md:order-3">
            <div className="bg-[#1a2e1a] p-2 rounded mb-2">
               <div className="w-12 h-12 flex items-center justify-center text-white text-[10px] font-bold">
                 PRIMZO
               </div>
            </div>
            <span className="font-bold text-sm tracking-widest text-gray-400">PRIMZO</span>
          </div>

          {/* Boutique Links */}
          <div className="flex flex-col items-center md:items-center flex-1 order-2">
            <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wider">Boutique</h4>
            <ul className="space-y-2 text-center">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery Section */}
          <div className="flex flex-col items-center md:items-end flex-1 order-3 md:order-1">
            <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wider">التوصيل</h4>
            <ul className="space-y-2 text-center md:text-right">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">
                  أسعار التوصيل
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright (Optional addition for a finished look) */}
        <div className="border-t mt-12 pt-6 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} PRIMZO HOMME. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}