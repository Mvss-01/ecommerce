"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    FaUser, FaPhoneAlt, FaLayerGroup, FaBuilding,
    FaShoppingCart, FaLocationArrow, FaCheckCircle, FaArrowRight
} from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';
import { getWilayaList, getBaladyiatsForWilaya } from '@dzcode-io/leblad';

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CheckoutFormProps {
    cart: any[];
    totalPrice: number;
    onSuccess: () => void;
    setOrderID: React.Dispatch<React.SetStateAction<string>>;
}

interface WilayaOption {
    id: number;
    name: string;
    originalName: string;
}

const deliveryRates: Record<string, { home: number; office: number }> = {
    "1": { home: 1600, office: 800 },    // Adrar
    "2": { home: 850, office: 450 },     // Chlef
    "3": { home: 1100, office: 600 },    // Laghouat
    "4": { home: 900, office: 400 },     // Oum El Bouaghi
    "5": { home: 900, office: 400 },     // Batna
    "6": { home: 850, office: 400 },     // Béjaïa
    "7": { home: 1100, office: 600 },    // Biskra
    "8": { home: 1400, office: 600 },    // Béchar
    "9": { home: 800, office: 400 },     // Blida
    "10": { home: 850, office: 400 },    // Bouira
    "11": { home: 1600, office: 1000 },  // Tamanrasset
    "12": { home: 1100, office: 600 },   // Tébessa
    "13": { home: 850, office: 400 },    // Tlemcen
    "14": { home: 850, office: 400 },    // Tiaret
    "15": { home: 750, office: 350 },    // Tizi Ouzou
    "16": { home: 750, office: 350 },    // Alger
    "17": { home: 1100, office: 600 },   // Djelfa
    "18": { home: 950, office: 400 },    // Jijel
    "19": { home: 900, office: 400 },    // Sétif
    "20": { home: 850, office: 400 },    // Saïda
    "21": { home: 950, office: 400 },    // Skikda
    "22": { home: 850, office: 350 },    // Sidi Bel Abbès
    "23": { home: 900, office: 400 },    // Annaba
    "24": { home: 950, office: 400 },    // Guelma
    "25": { home: 900, office: 400 },    // Constantine
    "26": { home: 850, office: 400 },    // Médéa
    "27": { home: 850, office: 350 },    // Mostaganem
    "28": { home: 900, office: 400 },    // M'Sila
    "29": { home: 850, office: 350 },    // Mascara
    "30": { home: 1250, office: 600 },   // Ouargla
    "31": { home: 850, office: 400 },    // Oran
    "32": { home: 1100, office: 600 },   // El Bayadh
    "33": { home: 1800, office: 1200 },  // Illizi
    "34": { home: 900, office: 400 },    // Bordj Bou Arreridj
    "35": { home: 800, office: 400 },    // Boumerdès
    "36": { home: 1000, office: 400 },   // El Tarf
    "37": { home: 1600, office: 1000 },  // Tindouf
    "38": { home: 850, office: 400 },    // Tissemsilt
    "39": { home: 1200, office: 600 },   // El Oued
    "40": { home: 1000, office: 400 },   // Khenchela
    "41": { home: 1000, office: 400 },   // Souk Ahras
    "42": { home: 850, office: 350 },    // Tipaza
    "43": { home: 1000, office: 400 },   // Mila
    "44": { home: 900, office: 400 },    // Aïn Defla
    "45": { home: 1400, office: 800 },   // Naâma
    "46": { home: 950, office: 400 },    // Aïn Témouchent
    "47": { home: 1200, office: 600 },   // Ghardaïa
    "48": { home: 950, office: 400 },    // Relizane
    "49": { home: 1600, office: 800 },   // Timimoun
    "50": { home: 2000, office: 1500 },  // Bordj Badji Mokhtar
    "51": { home: 1100, office: 600 },   // Ouled Djellal
    "52": { home: 1400, office: 600 },   // Béni Abbès
    "53": { home: 1600, office: 1000 },  // In Salah
    "54": { home: 1600, office: 1000 },  // In Guezzam
    "55": { home: 1200, office: 600 },   // Touggourt
    "56": { home: 1800, office: 1200 },  // Djanet
    "57": { home: 1200, office: 600 },   // El M'Ghair
    "58": { home: 1200, office: 600 },   // El Meniaa
};

export default function CheckoutForm({ cart, totalPrice, onSuccess, setOrderID }: CheckoutFormProps) {
    // 1. SAFELY Get the list of all wilayas with unique keys and defensive checks
    const wilayaOptions: WilayaOption[] = useMemo(() => {
        const list = getWilayaList();
        console.log("Debug Leblad Data:", list[0]); // Check your console to see the real keys!

        if (!list) return [];

        return list.map((w: any, index: number) => {
            // Try to find the ID in common property names used by the library
            const rawId = w.matricule || w.id || w.code || (index + 1);
            const strId = String(rawId);

            return {
                id: parseInt(strId),
                // This will now show the 2-digit number followed by the name
                name: `${strId.padStart(2, '0')} - ${w.name_ar || 'ولاية غير معروفة'}`,
                originalName: w.name_ar || ''
            };
        });
    }, []);

    const [selectedWilaya, setSelectedWilaya] = useState("");
    const [communes, setCommunes] = useState<any[]>([]);
    const [phoneError, setPhoneError] = useState("");
    const [deliveryType, setDeliveryType] = useState("domocile");
    const [generatedOrderId, setGeneratedOrderId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        commune: "",
        address: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // 2. Fetch Baladiyat whenever selectedWilaya changes
    useEffect(() => {
        if (selectedWilaya) {
            const matricule = parseInt(selectedWilaya);
            try {
                const baladiyats = getBaladyiatsForWilaya(matricule);
                setCommunes(baladiyats || []);
            } catch (err) {
                console.error("Error fetching communes:", err);
                setCommunes([]);
            }
        } else {
            setCommunes([]);
        }
        // Reset commune selection when wilaya changes
        setFormData(prev => ({ ...prev, commune: "" }));
    }, [selectedWilaya]);

    const getDeliveryPrice = () => {
        if (!selectedWilaya) return 0;

        // selectedWilaya is the ID (1, 2, 3...)
        const rate = deliveryRates[selectedWilaya];

        if (!rate) return 0;

        return deliveryType === "domocile" ? rate.home : rate.office;
    };

    const deliveryPrice = getDeliveryPrice();
    const finalTotal = totalPrice + deliveryPrice;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPhoneError("")

        if (!cart || cart.length === 0) {
            alert("سلة التسوق فارغة");
            return;
        }

        setIsSubmitting(true);

        if (formData.phone.length !== 10) {
            setPhoneError("يجب أن يتكون رقم الهاتف من 10 أرقام");
            setIsSubmitting(false);
            return;
        }

        const shortId = Math.random().toString(36).substring(2, 7).toUpperCase();
        const orderId = `ORD-${shortId}`;
        setGeneratedOrderId(orderId);

        const currentWilaya = wilayaOptions.find(w => w.id.toString() === selectedWilaya);
        const fullAddress = `${currentWilaya?.originalName || ''}, ${formData.commune}`;

        try {
            const formattedProducts = cart.map(item => ({
                name: item.product_name,
                quantity: item.quantity,
                color: item.selected_color || 'N/A',
                size: item.selected_size || 'N/A',
                price: item.price
            }));

            const { error } = await supabase
                .from("client-orders")
                .insert([
                    {
                        order_id: orderId,
                        client_name: formData.name,
                        phone_number: formData.phone,
                        adress: fullAddress,
                        delivery_type: deliveryType,
                        products: formattedProducts,
                        total: finalTotal,
                        status: 'pending',
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                // This will print the SPECIFIC reason for the failure in your browser console
                console.error("Supabase Insertion Error:", error.message, error.details, error.hint);
                throw error;
            }

            setIsSubmitted(true);
            setOrderID(orderId);
            onSuccess();

        } catch (error) {
            console.error("Order insertion failed:", error);
            alert("حدث خطأ أثناء تأكيد الطلب. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white w-full p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-2">تم استلام طلبك بنجاح!</h2>
                <p className="text-gray-500 mb-8">سنتصل بك قريباً لتأكيد الطلب عبر الهاتف.</p>

                <div className="w-full bg-gray-50 rounded-2xl p-4 mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">رقم الطلب:</span>
                        <span className="font-bold text-black">{generatedOrderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">المبلغ الإجمالي:</span>
                        <span className="font-bold text-green-600">{finalTotal} دج</span>
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    العودة للمتجر <FaArrowRight className="text-xs" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white w-full p-6 rounded-[2.5rem] shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">معلومات الشحن</h3>

                <div className="space-y-3">
                    <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50 focus-within:bg-white focus-within:border-black transition-all">
                        <FaUser className="text-gray-400 ml-3" />
                        <input
                            type="text"
                            placeholder="الإسم الكامل"
                            className="w-full outline-none text-sm bg-transparent text-black"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1"> {/* Wrapper for input + error */}
                        <div className={`flex items-center border ${phoneError ? 'border-red-500' : 'border-gray-100'} rounded-2xl p-4 bg-gray-50 focus-within:bg-white focus-within:border-black transition-all`}>
                            <FaPhoneAlt className="text-gray-400 ml-3" />
                            <input
                                type="tel"
                                placeholder="رقم الهاتف"
                                className="w-full outline-none text-sm bg-transparent text-black"
                                dir='rtl'
                                required
                                maxLength={10}
                                value={formData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, phone: val });
                                    // Clear error message when user starts fixing it
                                    if (val.length === 10) setPhoneError("");
                                }}
                            />
                        </div>
                        {/* Error Message Display */}
                        {phoneError && (
                            <p className="text-red-500 text-xs pr-5">
                                {phoneError}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Wilaya Select */}
                    <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50">
                        <FaLayerGroup className="text-gray-400 ml-3" />
                        <select
                            className="w-full outline-none text-sm bg-transparent cursor-pointer text-black"
                            onChange={(e) => setSelectedWilaya(e.target.value)}
                            value={selectedWilaya}
                            required
                        >
                            <option value="">اختر الولاية</option>
                            {wilayaOptions.map((w) => (
                                <option key={`wil-opt-${w.id}`} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Commune Select */}
                    <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50">
                        <FaBuilding className="text-gray-400 ml-3" />
                        <select
                            className="w-full outline-none text-sm bg-transparent cursor-pointer text-black"
                            required
                            value={formData.commune}
                            onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                            disabled={!selectedWilaya}
                        >
                            <option value="">{selectedWilaya ? "اختر البلدية" : "اختر الولاية أولاً"}</option>
                            {communes.map((c, index) => (
                                <option key={`com-opt-${index}-${c.name_en || 'c'}`} value={c.name_ar}>
                                    {c.name_ar}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* <div className="flex items-center border border-gray-100 rounded-2xl p-4 bg-gray-50 focus-within:bg-white focus-within:border-black transition-all">
                    <FaLocationArrow className="text-gray-400 ml-3" />
                    <input
                        type="text"
                        placeholder="العنوان الكامل"
                        className="w-full outline-none text-sm bg-transparent text-black"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div> */}

                <div className="py-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">نوع التوصيل (Yalidine)</h3>
                    <div className="flex gap-4">
                        {['domocile', 'bureau'].map((type) => (
                            <label key={type} className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${deliveryType === type ? 'bg-black text-white' : 'bg-white text-black border-gray-100'}`}>
                                <input
                                    type="radio"
                                    name="delivery"
                                    value={type}
                                    checked={deliveryType === type}
                                    onChange={(e) => setDeliveryType(e.target.value)}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium">
                                    {type === 'domocile' ? 'المنزل' : 'المكتب'}
                                </span>                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">سعر المنتجات</span>
                        <span className="font-bold text-black">{totalPrice} دج</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">سعر التوصيل</span>
                        <span className="text-black font-medium">
                            {selectedWilaya ? `${deliveryPrice} دج` : "حدد الولاية أولاً"}
                        </span>
                    </div>
                    <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-black">الإجمالي</span>
                        <span className="text-2xl font-black text-green-600">{finalTotal} دج</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-black'} text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99]`}
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