"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Plus, Minus, AlertCircle, Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Noto_Kufi_Arabic } from "next/font/google";
import Navbar from "@/components/Navbar";

// Initialize font outside component
const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"]
});

export default function ProductClientPage({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  // Set defaults based on first items in database
  const [selectedSize, setSelectedSize] = useState(product.available_sizes.at(-1));
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Cart and notification states
  const [stockMessage, setStockMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const [isAdding, setIsAdding] = useState(false);
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);

  // Dynamic pricing calculations
  const oldPrice = Math.round(product.price * 1.5);
  const discount = product.discount > 0 ? product.discount : 0;
  const finalPrice = discount > 0
    ? product.price * (1 - discount / 100)
    : product.price;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > product.stock) {
      setMessageType("error");
      setStockMessage(`عذراً، الكمية المتاحة هي ${product.stock} فقط`);
      setTimeout(() => setStockMessage(""), 3000);
      return;
    }
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    setMessageType("");
    setStockMessage("");
  };

  const addToCart = async () => {
    if (quantity > product.stock) {
      setMessageType("error");
      setStockMessage(`عذراً، الكمية المتاحة هي ${product.stock} فقط`);
      setTimeout(() => setStockMessage(""), 3000);
      return;
    }

    setIsAdding(true);

    try {
      const existingCart = localStorage.getItem("cart");
      const cart = existingCart ? JSON.parse(existingCart) : [];


      const cartItem = {
        id: `${product.id}-${selectedColor}-${selectedSize}`,
        product_id: product.id,
        product_name: product.product_name,
        price: finalPrice,
        quantity: quantity,
        selected_color: selectedColor,
        selected_size: selectedSize,
        image_url: product.product_images[0],
        stock: product.stock,
      };

      const existingItemIndex = cart.findIndex(
        (item: any) =>
          item.product_id === product.id &&
          item.selected_color === selectedColor &&
          item.selected_size === selectedSize
      );

      if (existingItemIndex !== -1) {
        const newQty = cart[existingItemIndex].quantity + quantity;
        if (newQty > product.stock) {
          setMessageType("error");
          setStockMessage(`عذراً، الكمية المتاحة هي ${product.stock} فقط`);
          setTimeout(() => setStockMessage(""), 3000);
          setIsAdding(false);
          return;
        }
        cart[existingItemIndex].quantity = newQty;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      setMessageType("success");
      setStockMessage("تمت الإضافة إلى السلة بنجاح!");
      setShowCheckoutButton(true);

      setTimeout(() => {
        setStockMessage("");
        setMessageType("");
        setShowCheckoutButton(false);
      }, 5000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessageType("error");
      setStockMessage("حدث خطأ أثناء الإضافة");
      setTimeout(() => setStockMessage(""), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${notoKufi.className} mt-20`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16" dir="rtl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7">

          {/* LEFT: IMAGE GALLERY (Native RTL puts this on the right) */}
          <div className="lg:col-span-6 flex flex-col gap-4 items-center lg:items-start">

            {/* Main Image Container */}
            <div className="relative w-full max-w-[500px] lg:max-w-none aspect-4/5 sm:aspect-square lg:aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden group border border-gray-100 mx-auto lg:mx-0">
              <img
                src={product.product_images[currentImgIndex]}
                alt={product.product_name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Navigation Arrows */}
              {product.product_images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImgIndex(i => i === 0 ? product.product_images.length - 1 : i - 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md text-gray-800 rounded-full flex items-center justify-center shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImgIndex(i => i === product.product_images.length - 1 ? 0 : i + 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md text-gray-800 rounded-full flex items-center justify-center shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.product_images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.product_images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${currentImgIndex === idx ? "border-black" : "border-transparent hover:border-gray-200"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS (Native RTL puts this on the left) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 flex flex-col gap-8">

              {/* Header & Pricing */}
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {product.product_name}
                </h1>

                <div className="flex items-center gap-4">
                  {/* The Active Price (either discounted or normal) */}
                  <span className={`text-3xl font-bold ${discount > 0 ? "text-red-600" : "text-gray-600"} `}>
                    {finalPrice.toLocaleString()} د.ج
                  </span>

                  {/* Only show the old price and badge if a discount exists */}
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {product.price.toLocaleString()} د.ج
                      </span>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide">
                        وفّر {discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-base">
                {product.description}
              </p>

              <hr className="border-gray-100" />

              {/* Colors */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">اللون</span>
                  <span className="text-sm text-gray-500">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color: any) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"
                        }`}
                      aria-label={`Select ${color}`}
                    >
                      <span
                        className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">المقاس</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.available_sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 border ${selectedSize === size
                        ? "border-black bg-black text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-gray-900">الكمية</span>
                <div className="flex items-center w-full sm:w-48 bg-gray-50 border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isAdding}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600"
                  >
                    <Plus size={18} />
                  </button>
                  <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={isAdding}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600"
                  >
                    <Minus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-gray-600 font-medium">إجمالي المبلغ:</span>
                <span className="text-2xl font-bold text-black">
                  {(finalPrice * quantity).toLocaleString()} د.ج
                </span>
              </div>

              {/* Actions & Notifications */}
              <div className="flex flex-col gap-4 pt-2">
                {/* Dynamic Alert */}
                {stockMessage && (
                  <div className={`flex items-center justify-between p-4 rounded-xl border ${messageType === "error"
                    ? "bg-red-50 border-red-100 text-red-800"
                    : "bg-green-50 border-green-100 text-green-800"
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className="flex items-center gap-3">
                      {messageType === "error" ? <AlertCircle size={20} /> : <Check size={20} />}
                      <span className="font-semibold text-sm">{stockMessage}</span>
                    </div>
                    {showCheckoutButton && messageType === "success" && (
                      <button
                        onClick={() => router.push("/checkout")}
                        className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-900 transition-colors"
                      >
                        إتمام الطلب
                      </button>
                    )}
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={addToCart}
                  disabled={isAdding}
                  className="group relative w-full bg-black text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-gray-900 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl shadow-black/10"
                >
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري الإضافة...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                      <span>أضف إلى سلَّة التسوق</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}