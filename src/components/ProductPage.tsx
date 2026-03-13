"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Plus, Minus } from "lucide-react";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("black");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  
  const colors = [
    { id: "black", label: "أسود", hex: "bg-black" },
    { id: "gray", label: "رمادي", hex: "bg-gray-300" },
  ];

  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Product Details */}
        <div className="flex flex-col space-y-8 order-2 lg:order-1" dir="rtl">
          
          {/* Header & Title */}
          <div className="text-right">
            <h1 className="text-3xl font-bold text-slate-800 mb-4" dir="ltr" style={{ textAlign: "right" }}>
              Ensemble Baggy Promo
            </h1>
            <div className="text-gray-600 space-y-2 text-[15px] leading-relaxed font-medium">
              <p>🚨 أونصومبل تاع 490ألف ❌ راهو ب290ألف ✅ الجودة مضمونة 🎯 ألبس و عاود 🔥</p>
              <p>القماش قطن تاع وقتوا مبيتحببش 💯 و المقاسات متوفرة XS S M L XL XXL</p>
            </div>
          </div>

          {/* Pricing Header */}
          <div className="flex justify-between items-center w-full" dir="ltr">
            {/* Discount Badge */}
            <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shadow-md shadow-red-200">
              -41%
            </div>
            
            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 line-through text-lg font-medium">4900 دج</span>
              <span className="text-red-600 font-bold text-2xl">2900 دج</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Color Selection */}
          <div className="flex flex-col space-y-3">
            <span className="text-gray-800 font-semibold">الألوان</span>
            <div className="flex justify-start space-x-4 space-x-reverse">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className="flex items-center space-x-2 space-x-reverse cursor-pointer group"
                >
                  <span className="text-gray-600 font-medium group-hover:text-black transition-colors">
                    {color.label}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.id
                        ? "border-gray-800 p-0.5"
                        : "border-transparent"
                    }`}
                  >
                    <div className={`w-full h-full rounded-full ${color.hex}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col space-y-3">
            <span className="text-gray-800 font-semibold">المقاسات</span>
            <div className="flex flex-wrap gap-3" dir="ltr">
              {sizes.reverse().map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-md border text-sm font-semibold transition-all
                    ${
                      selectedSize === size
                        ? "border-black bg-gray-50 text-black"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Total */}
          <div className="flex justify-between items-center pt-4" dir="ltr">
            {/* Total Display */}
            <div className="text-red-600 font-bold text-xl">
              {2900 * quantity} دج
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
              <button
                onClick={handleDecrease}
                className="p-3 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-10 text-center font-semibold text-gray-800">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="p-3 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <span className="text-gray-800 font-semibold" dir="rtl">
              إجمالي المنتج
            </span>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-300">
            أضف إلى سلَّة التسوق
          </button>
          
          {/* Bottom Left Optional Image (As seen in the original screenshot) */}
          <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden relative mt-4">
             {/* Replace with actual secondary image */}
             <div className="absolute inset-0 bg-linear-to-t from-gray-500 to-gray-300 flex items-center justify-center text-white">
                Secondary Model Image
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Main Image Carousel */}
        <div className="relative order-1 lg:order-2">
          <div className="relative w-full aspect-4/5 bg-[#a8a19b] rounded-2xl overflow-hidden group shadow-sm">
            
            {/* Placeholder for the actual main product image */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              {/* Note: In a real app, use next/image here */}
              <div className="w-full h-full object-cover bg-black/10 flex items-center justify-center">
                 <span className="text-gray-700 font-medium">Main Product Image (Flat lay)</span>
              </div>
            </div>

            {/* Graphic Sticker Overlay (The 290 ألف tag) */}
            <div className="absolute top-1/4 right-8 bg-pink-200/90 rotate-[-35deg] px-6 py-2 rounded-xl shadow-xl backdrop-blur-sm border border-pink-300">
               <span className="text-red-600 font-bold text-2xl tracking-tighter" dir="rtl">290ألف ✅😨</span>
            </div>

            {/* Left Arrow */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
              <ChevronLeft size={24} />
            </button>

            {/* Right Arrow */}
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}