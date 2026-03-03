"use client";

import React, { useState, useEffect } from "react";
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check, 
  User, Phone, MapPin, ShieldCheck 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Noto_Kufi_Arabic } from 'next/font/google';

// 1. Initialize the font outside the component
const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700']
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

    if (!formData.name.trim() || !formData.phone.trim() || !formData.wilaya) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.removeItem("cart");
      setSubmitted(true);
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0 && !submitted) {
    return (
      <div className={`min-h-screen bg-[#FAFAFA] p-4 md:p-8 flex items-center justify-center ${notoKufi.className} text-black`}>
        <div className="text-center max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag size={36} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">سلتك فارغة</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">اكتشف مجموعتنا الواسعة من المنتجات وأضف ما يعجبك إلى سلة التسوق الخاصة بك.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg hover:bg-gray-800 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse group"
            dir="rtl"
          >
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            <span>تسوق الآن</span>
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className={`min-h-screen bg-[#FAFAFA] p-4 md:p-8 flex items-center justify-center ${notoKufi.className}`}>
        <div className="text-center max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-full h-full bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <Check size={48} className="text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">تم استقبال طلبك بنجاح!</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">شكراً لتسوقك معنا. سيقوم فريقنا بالاتصال بك قريباً لتأكيد تفاصيل الشحن.</p>
          
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-center space-x-3 space-x-reverse">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-600">جاري العودة للرئيسية...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#FAFAFA] py-8 px-4 md:py-12 md:px-8 ${notoKufi.className} text-black`} dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* CART ITEMS - LEFT COLUMN */}
        <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">عربة التسوق</h2>
            <span className="bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-sm font-semibold">
              {cart.length} منتجات
            </span>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group flex gap-4 p-4 bg-white rounded-3xl border border-gray-100/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-200 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="shrink-0 w-28 h-28 md:w-32 md:h-32 bg-gray-50 rounded-2xl overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 text-base md:text-lg truncate pl-4">
                        {item.product_name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                        title="إزالة من السلة"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-500 mb-3">
                      <span className="bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        اللون: <span className="font-semibold text-gray-900">{item.selected_color}</span>
                      </span>
                      <span className="bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        المقاس: <span className="font-semibold text-gray-900">{item.selected_size}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <p className="font-black text-gray-900 text-lg md:text-xl">
                      {item.price * item.quantity} <span className="text-sm text-gray-500 font-normal">دج</span>
                    </p>
                    
                    {/* Quantity Controls - Pill Shaped */}
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full p-1 shadow-sm">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-full hover:shadow-sm transition-all text-gray-600"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded-full hover:shadow-sm transition-all text-gray-600"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200/60">
            <button
              onClick={() => {
                updateCartInStorage();
                router.push("/");
              }}
              className="text-gray-500 hover:text-black font-semibold text-sm flex items-center space-x-2 space-x-reverse transition-colors group"
            >
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              <span>العودة ومتابعة التسوق</span>
            </button>
          </div>
        </div>

        {/* CHECKOUT FORM - RIGHT COLUMN */}
        <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 sticky top-8">
            
            {/* Order Summary */}
            <div className="mb-8 pb-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-5">ملخص الطلب</h3>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between items-center">
                  <span>إجمالي المنتجات</span>
                  <span className="font-semibold text-gray-900">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} قطع
                  </span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span>الشحن والدفع</span>
                  <span className="font-medium flex items-center gap-1">
                    <ShieldCheck size={16} /> الدفع عند الاستلام
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-900">المجموع النهائي</span>
                <span className="text-2xl font-black text-gray-900">
                  {totalPrice} <span className="text-base font-normal text-gray-500">دج</span>
                </span>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-bold text-gray-900 mb-2">معلومات التوصيل</h3>

              {/* Name Input */}
              <div className="relative">
                <label htmlFor="name" className="sr-only">الاسم الكامل</label>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="الاسم الكامل"
                  className="w-full pr-11 pl-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-gray-900 placeholder-gray-400 text-sm font-medium outline-none"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Phone Input */}
              <div className="relative">
                <label htmlFor="phone" className="sr-only">رقم الهاتف</label>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="رقم الهاتف"
                  className="w-full pr-11 pl-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-gray-900 placeholder-gray-400 text-sm font-medium outline-none"
                  disabled={isSubmitting}
                  required
                  dir="ltr"
                  style={{ textAlign: 'right' }} // Keeps text right-aligned even though direction is LTR for numbers
                />
              </div>

              {/* Wilaya Select */}
              <div className="relative">
                <label htmlFor="wilaya" className="sr-only">الولاية</label>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <select
                  id="wilaya"
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleFormChange}
                  className="w-full pr-11 pl-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-gray-900 text-sm font-medium outline-none appearance-none"
                  disabled={isSubmitting}
                  required
                >
                  {wilayaList.map((wilaya) => (
                    <option key={wilaya} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow to replace default */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center overflow-hidden relative"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري تأكيد الطلب...</span>
                  </div>
                ) : (
                  "تأكيد الطلب الآن"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}