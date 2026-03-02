"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Noto_Kufi_Arabic } from 'next/font/google';

// 1. Initialize the font outside the component
const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'] // Optional: specify weights if needed
});

const wilayaList = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة",
  "بئر الشاعر", "بليدة", "البويرة", "تمنراست", "تلمسان", "تيارت", "تيسمسيلت",
  "الجزائر", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "قسنطينة",
  "قالمة", "غردايا", "قرقرة", "الجلفة", "جندوبة", "خنشلة", "خميس مليانة",
  "الدالية", "دراعة", "الدلس", "الوادي", "وهران", "ورقلة", "وسيلة"
];

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  selected_color: string;
  selected_size: string;
  image_url: string;
  stock: number;
}

interface FormData {
  name: string;
  phone: string;
  wilaya: string;
}

export default function CheckoutClientPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    wilaya: wilayaList[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart:", error);
        setCart([]);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    localStorage.setItem("totalPrice", total.toString());
  }, [cart]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        // Validate against stock
        if (newQuantity > item.stock) {
          alert(`عذراً، الكمية المتاحة من هذا المنتج هي ${item.stock} فقط`);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCart(updatedCart);
    updateCartInStorage(updatedCart);
  };

  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter((item) => item.id !== itemId);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateCartInStorage = (updatedCart?: CartItem[]) => {
    const cartToSave = updatedCart || cart;
    localStorage.setItem("cart", JSON.stringify(cartToSave));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim() || !formData.phone.trim() || !formData.wilaya) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear cart and show success message
      localStorage.removeItem("cart");
      setSubmitted(true);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0 && !submitted) {
    return (
      <div className={`min-h-screen bg-white p-4 md:p-8 flex items-center justify-center ${notoKufi.className} text-black`}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">سلتك فارغة</h1>
          <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
            dir="rtl"
          >
            <ArrowRight size={20} />
            <span>العودة إلى المتجر</span>
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تم استقبال طلبك</h1>
          <p className="text-gray-600 mb-2">شكراً لك على تسوقك معنا</p>
          <p className="text-sm text-gray-500 mb-8">سيتم إعادة التوجيه إلى الصفحة الرئيسية خلال قليل...</p>
          <div className="inline-block text-sm font-mono text-gray-500">
            جاري الانتظار...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 p-4 md:p-8 ${notoKufi.className} text-black`} dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS - LEFT COLUMN (takes 2/3 on large screens) */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">منتجاتك</h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  {/* Product Image */}
                  <div className="shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base mb-2 truncate">
                      {item.product_name}
                    </h3>
                    <div className="text-xs md:text-sm text-gray-600 space-y-1 mb-3">
                      <p>اللون: <span className="font-semibold text-gray-800">{item.selected_color}</span></p>
                      <p>المقاس: <span className="font-semibold text-gray-800">{item.selected_size}</span></p>
                    </div>
                    <p className="font-bold text-red-600 text-sm md:text-base">
                      {item.price * item.quantity} دج
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="إزالة من السلة"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  updateCartInStorage();
                  router.push("/");
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1 space-x-reverse"
              >
                <ArrowRight size={16} />
                <span>متابعة التسوق</span>
              </button>
            </div>
          </div>
        </div>

        {/* CHECKOUT FORM - RIGHT COLUMN (takes 1/3 on large screens) */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-4">
            {/* Order Summary */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">ملخص الطلب</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>عدد المنتجات:</span>
                  <span className="font-semibold text-gray-800">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>عدد العناصر المختلفة:</span>
                  <span className="font-semibold text-gray-800">{cart.length}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">
                <span>الإجمالي:</span>
                <span className="text-red-600">{totalPrice} دج</span>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-gray-800 mb-6">بيانات الطلب</h3>

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="أدخل رقم هاتفك"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Wilaya Select */}
              <div>
                <label htmlFor="wilaya" className="block text-sm font-semibold text-gray-700 mb-2">
                  الولاية
                </label>
                <select
                  id="wilaya"
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right bg-white"
                  disabled={isSubmitting}
                  required
                >
                  {wilayaList.map((wilaya) => (
                    <option key={wilaya} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 bg-black text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    جاري المعالجة...
                  </>
                ) : (
                  "إتمام الطلب"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                سيتم الاتصال بك قريباً لتأكيد الطلب
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
