"use client";

import React, { useState, useEffect } from 'react';
import {
    FaUser, FaPhoneAlt, FaLayerGroup, FaBuilding,
    FaShoppingCart, FaLocationArrow, FaCheckCircle, FaArrowRight
} from 'react-icons/fa';
import { SupabaseClient } from '@supabase/supabase-js';
// Liste des 58 Wilayas d'Algérie
const wilayas = [
    "01 أدرار", "02 الشلف", "03 الأغواط", "04 أم البواقي", "05 باتنة", "06 بجاية", "07 بسكرة", "08 بشار", "09 البليدة", "10 البويرة",
    "11 تمنراست", "12 تبسة", "13 تلمسان", "14 تيارت", "15 تيزي وزو", "16 الجزائر", "17 الجلفة", "18 جيجل", "19 سطيف", "20 سعيدة",
    "21 سكيكدة", "22 سيدي بلعباس", "23 عنابة", "24 قالمة", "25 قسنطينة", "26 المدية", "27 مستغانم", "28 المسيلة", "29 معسكر", "30 ورقلة",
    "31 وهران", "32 البيض", "33 إليزي", "34 برج بوعريريج", "35 بومرداس", "36 الطارف", "37 تندوف", "38 تسمسيلت", "39 الوادي", "40 خنشلة",
    "41 سوق أهراس", "42 تيبازة", "43 ميلة", "44 عين الدفلى", "45 النعامة", "46 عين تموشنت", "47 غرداية", "48 غليزان", "49 المغير", "50 المنيعة",
    "51 أولاد جلال", "52 برج باجي مختار", "53 بني عباس", "54 تيميمون", "55 تقرت", "56 جانت", "57 إن صالح", "58 إن قزام"
];

// Exemple de données pour les communes
const communesData: Record<string, string[]> = {
    "16 الجزائر": ["الجزائر الوسطى", "سيدي امحمد", "المدنية", "بلوزداد", "باب الوادي", "بولوغين", "القصبة", "وادي قريش", "بئر مراد رايس", "الأبيار", "حيدرة", "بن عكنون", "بوزريعة", "بني مسوس", "دالي ابراهيم"],
    "09 البليدة": ["البليدة", "الشبلي", "بوعينان", "بوفاريك", "الصومعة", "موزاية", "العفرون", "أولاد يعيش"],
    "31 وهران": ["وهران", "قديل", "بئر الجير", "عين الترك", "أرزيو", "بطيوة", "السانية"],
    "35 بومرداس": ["بومرداس", "بودواو", "الثنية", "دلس", "تيجلابين", "خميس الخشنة", "حمادي"]
};

interface CheckoutFormProps {
    cart: any[]; // Make sure to pass the cart array from CheckoutClientPage
    totalPrice: number;
    onSuccess: () => void;
}

export default function CheckoutForm({ cart, totalPrice, onSuccess }: CheckoutFormProps) {
    const [selectedWilaya, setSelectedWilaya] = useState("");
    const [communes, setCommunes] = useState<string[]>([]);
    const [deliveryType, setDeliveryType] = useState("home");

    // Capture form text inputs
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        commune: "",
        address: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (selectedWilaya && communesData[selectedWilaya]) {
            setCommunes(communesData[selectedWilaya]);
        } else {
            setCommunes(selectedWilaya ? ["البلدية المركزية"] : []);
        }
        // Reset commune when wilaya changes
        setFormData(prev => ({ ...prev, commune: "" }));
    }, [selectedWilaya]);

    const getDeliveryPrice = () => {
        if (!selectedWilaya) return 0;
        const wilayaNumber = parseInt(selectedWilaya.substring(0, 2));
        const basePrice = wilayaNumber <= 29 ? 500 : 700;
        const extraFee = deliveryType === "home" ? 200 : 0;
        return basePrice + extraFee;
    };

    const deliveryPrice = getDeliveryPrice();
    const finalTotal = totalPrice + deliveryPrice;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prevent empty cart submission
        if (!cart || cart.length === 0) {
            alert("سلة التسوق فارغة");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Format products into desired JSONB structure
            const formattedProducts = cart.map(item => ({
                name: item.product_name,
                quantity: item.quantity,
                color: item.selected_color,
                size: item.selected_size
            }));

            // 2. Send to Supabase
            // Note: If you want to save phone, wilaya, and address, add those columns to your table 
            // and include them in this object.
            const { error } = await SupabaseClient
                .from("client-orders")
                .insert([
                    {
                        client_name: formData.name,
                        products: formattedProducts,
                        total_price: finalTotal // Make sure this column name matches your database (e.g., total_price or total)
                    }
                ]);

            if (error) throw error;

            // 3. Trigger success UI
            setIsSubmitted(true);
            
            // Optional: You can still call onSuccess() here to clear the cart in the parent
            onSuccess(); 

        } catch (error) {
            console.error("Order failed", error);
            alert("حدث خطأ أثناء تأكيد الطلب. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white w-full p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-2">تم استلام طلبك بنجاح!</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    شكراً لثقتكم بنا. سنتصل بك قريباً عبر الهاتف لتأكيد العنوان وموعد التوصيل.
                </p>

                <div className="w-full bg-gray-50 rounded-2xl p-4 mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">رقم الطلب:</span>
                        <span className="font-bold text-black">#DZ-{Math.floor(Math.random() * 90000) + 10000}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">المبلغ الإجمالي:</span>
                        <span className="font-bold text-green-600">{finalTotal} دج</span>
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                >
                    العودة للمتجر <FaArrowRight className="text-xs" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white w-full p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 lg:sticky lg:top-8">
            {/* Added onSubmit handler to the form element */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">معلومات الزبون</h3>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50 focus-within:bg-white focus-within:border-black transition-all">
                        <FaUser className="text-gray-400 ml-3" />
                        <input 
                            type="text" 
                            placeholder="الإسم واللقب" 
                            className="w-full outline-none text-sm bg-transparent text-black" 
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50 focus-within:bg-white focus-within:border-black transition-all">
                        <FaPhoneAlt className="text-gray-400 ml-3" />
                        <input 
                            type="tel" 
                            placeholder="رقم الهاتف" 
                            className="w-full outline-none text-sm bg-transparent text-black" 
                            dir='rtl' 
                            required 
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50">
                        <FaLayerGroup className="text-gray-400 ml-3" />
                        <select
                            className="w-full outline-none text-sm bg-transparent cursor-pointer text-black"
                            onChange={(e) => setSelectedWilaya(e.target.value)}
                            value={selectedWilaya}
                            required
                        >
                            <option value="">الولاية</option>
                            {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50">
                        <FaBuilding className="text-gray-400 ml-3" />
                        <select 
                            className="w-full outline-none text-sm bg-transparent cursor-pointer text-black" 
                            required
                            value={formData.commune}
                            onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                        >
                            <option value="">البلدية</option>
                            {communes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50 focus-within:bg-white focus-within:border-black transition-all">
                    <FaLocationArrow className="text-gray-400 ml-3" />
                    <input 
                        type="text" 
                        placeholder="العنوان الكامل" 
                        className="w-full outline-none text-sm bg-transparent text-black" 
                        required 
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>

                <div className="py-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">مكان التوصيل</h3>
                    <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 border border-gray-100 rounded-xl cursor-pointer  ${deliveryType === 'home' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                            <input
                                type="radio"
                                name="delivery"
                                value="home"
                                checked={deliveryType === "home"}
                                onChange={(e) => setDeliveryType(e.target.value)}
                                className="hidden"
                            />
                            <span className="text-sm font-medium">للمنزل</span>
                        </label>

                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 border border-gray-100 rounded-xl cursor-pointer ${deliveryType === 'office' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                            <input
                                type="radio"
                                name="delivery"
                                value="office"
                                checked={deliveryType === "office"}
                                onChange={(e) => setDeliveryType(e.target.value)}
                                className="hidden"
                            />
                            <span className="text-sm font-medium">المكتب</span>
                        </label>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-2xl p-5 mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">سعر المنتجات</span>
                        <span className="font-bold text-black">{totalPrice} دج</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">سعر التوصيل</span>
                        <span className="text-black font-medium">
                            {selectedWilaya ? `${deliveryPrice} دج` : "يحدد لاحقاً"}
                        </span>
                    </div>
                    <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-black">الإجمالي</span>
                        <span className="text-2xl font-black text-green-600">
                            {finalTotal} دج
                        </span>
                    </div>
                </div>

                {/* Changed onClick to form submission logic */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-black'} text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98]`}
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>تأكيد الطلب <FaShoppingCart /></>
                    )}
                </button>
            </form>
        </div>
    );
}