"use client";

import { useState, useEffect } from "react";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Noto_Kufi_Arabic } from 'next/font/google';
import CheckoutForm from "@/components/CheckoutForm";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Initialize the font outside the component
const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700']
});

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderID, setOrderID] = useState("");

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

// Add this import if not already there

const handleOrderSuccess = async () => {
  setIsSubmitting(true); // Start loading state

  try {
    // 1. Create an array of update promises
    // We loop through the cart and tell Supabase to decrement the stock
    const stockUpdatePromises = cart.map((item) => {
      return supabase
        .from('hmed-ecommerce')
        .update({ 
          // We calculate the new stock: current stock minus quantity bought
          stock: item.stock - item.quantity 
        })
        .eq('id', item.product_id); // Match the product ID
    });

    // 2. Execute all updates simultaneously
    const results = await Promise.all(stockUpdatePromises);

    // 3. Check for errors in any of the updates
    const hasError = results.some(result => result.error);
    if (hasError) {
      console.error("One or more stock updates failed");
    }

    setCart([]);
    localStorage.removeItem("cart");
    localStorage.removeItem("totalPrice");

    window.dispatchEvent(new Event("cartUpdated"));

    setSubmitted(true);

  } catch (error) {
    console.error("Error during checkout process:", error);
    alert("حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.");
  } finally {
    setIsSubmitting(false);
  }
};


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
  // if (submitted) {
  //   return (
  //     <div className={`min-h-screen bg-[#FAFAFA] p-4 md:p-8 flex items-center justify-center ${notoKufi.className}`}>
  //       <div className="text-center max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
  //         <div className="relative w-24 h-24 mx-auto mb-8">
  //           <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
  //           <div className="relative w-full h-full bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
  //             <Check size={48} className="text-green-500" />
  //           </div>
  //         </div>
  //         <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">تم استقبال طلبك بنجاح!</h1>
  //         <p className="text-gray-500 mb-8 leading-relaxed">شكراً لتسوقك معنا. سيقوم فريقنا بالاتصال بك قريباً لتأكيد تفاصيل الشحن.</p>

  //         <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-center space-x-3 space-x-reverse">
  //           <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
  //           <span className="text-sm font-medium text-gray-600">جاري العودة للرئيسية...</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (submitted) {
    return (
      <div className={`min-h-screen bg-[#FAFAFA] p-4 md:p-8 flex items-center justify-center ${notoKufi.className}`} dir="rtl">
        <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden animate-in fade-in zoom-in duration-700">

          {/* Subtle Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-400 via-emerald-500 to-green-400" />

          {/* Animated Checkmark Section */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(34,197,94,0.3)]">
              <Check size={48} className="text-white stroke-[3px] animate-in zoom-in duration-500 delay-200" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">تهانينا! تم استلام طلبك</h2>
          <p className="text-gray-500 mb-10 max-w-sm leading-relaxed">
            شكراً لتسوقك معنا. رقم طلبك هو : <span className="font-bold text-black text-lg"><br />{orderID}</span><br />
            سيتصل بك موظفونا قريباً لتأكيد الشحن.
          </p>

          {/* Visual Timeline - Makes it feel professional */}
          <div className="w-full grid grid-cols-3 gap-2 mb-10 relative">
            {[
              { label: "تم الطلب", active: true },
              { label: "تأكيد هاتفي", active: false },
              { label: "التوصيل", active: false }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step.active ? 'bg-black border-black text-white' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                  {step.active ? <Check size={18} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-xs font-bold ${step.active ? 'text-black' : 'text-gray-400'}`}>{step.label}</span>
              </div>
            ))}
            {/* Connecting Lines */}
            <div className="absolute top-5 right-[20%] left-[20%] h-0.5 bg-gray-100 -z-10"></div>
          </div>

          {/* Action Section */}
          <div className="w-full space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
            >
              العودة للمتجر الرئيسي <ArrowRight size={20} className="rotate-180" />
            </button>

            {/* Auto-redirect indicator */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#FAFAFA] py-8 px-4 md:py-12 md:px-8 ${notoKufi.className} text-black`} dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-27">

        {/* CART ITEMS - LEFT COLUMN */}
        <div className="lg:col-span-7 xl:col-span-7">
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
        <div className="lg:col-span-5">
          <CheckoutForm
            cart={cart}
            totalPrice={totalPrice}
            onSuccess={handleOrderSuccess}
            setOrderID = {setOrderID}
          />
        </div>
      </div>
    </div>
  );
}