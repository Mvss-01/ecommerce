"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Plus, Minus } from "lucide-react";

export default function ProductClientPage({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  
  // Set defaults based on first items in database
  const [selectedSize, setSelectedSize] = useState(product.available_sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Dynamic pricing calculations
  const oldPrice = Math.round(product.price * 1.5);
  const discount = 33; // You could also store this in DB

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* DETAILS COLUMN */}
        <div className="flex flex-col space-y-8 order-2 lg:order-1" dir="rtl">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-slate-800 mb-4" style={{ textAlign: "right" }}>
              {product.product_name}
            </h1>
            <div className="text-gray-600 space-y-2 text-[15px] leading-relaxed font-medium">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="flex justify-between items-center w-full" dir="ltr">
            <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
              -{discount}%
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 line-through text-lg font-medium">{oldPrice} دج</span>
              <span className="text-red-600 font-bold text-2xl">{product.price} دج</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* DYNAMIC COLORS */}
          <div className="flex flex-col space-y-3">
            <span className="text-gray-800 font-semibold">الألوان</span>
            <div className="flex justify-start space-x-4 space-x-reverse">
              {product.colors.map((color: any) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className="flex items-center space-x-2 space-x-reverse cursor-pointer group"
                >
                  <span className="text-gray-600 font-medium group-hover:text-black">{color.name}</span>
                  <div className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name ? "border-gray-800 p-[2px]" : "border-transparent"}`}>
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC SIZES */}
          <div className="flex flex-col space-y-3">
            <span className="text-gray-800 font-semibold">المقاسات</span>
            <div className="flex flex-wrap gap-3" dir="ltr">
              {product.available_sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-md border text-sm font-semibold transition-all
                    ${selectedSize === size ? "border-black bg-gray-50 text-black" : "border-gray-200 bg-gray-50 text-gray-600"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY & TOTAL */}
          <div className="flex justify-between items-center pt-4" dir="ltr">
            <div className="text-red-600 font-bold text-xl">{product.price * quantity} دج</div>
            <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3"><Minus size={18} /></button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-3"><Plus size={18} /></button>
            </div>
            <span className="text-gray-800 font-semibold" dir="rtl">إجمالي المنتج</span>
          </div>

          <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">
            أضف إلى سلَّة التسوق
          </button>
        </div>

        {/* IMAGE COLUMN */}
        <div className="relative order-1 lg:order-2">
          <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden group">
            <img 
              src={product.product_images[currentImgIndex]?.image_url} 
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
            
            {/* Price Sticker */}
            <div className="absolute top-1/4 right-8 bg-pink-200/90 rotate-[-35deg] px-6 py-2 rounded-xl shadow-xl border border-pink-300">
               <span className="text-red-600 font-bold text-2xl" dir="rtl">{product.price} دج ✅</span>
            </div>

            {/* Navigation Arrows */}
            {product.product_images.length > 1 && (
              <>
                <button onClick={() => setCurrentImgIndex(i => i === 0 ? product.product_images.length - 1 : i - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center"><ChevronLeft /></button>
                <button onClick={() => setCurrentImgIndex(i => i === product.product_images.length - 1 ? 0 : i + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center"><ChevronRight /></button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}