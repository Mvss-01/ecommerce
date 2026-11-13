"use client";

import React, { useState, useEffect } from 'react';
import {
    FaUser, FaPhoneAlt, FaLayerGroup, FaBuilding,
    FaShoppingCart, FaCheckCircle, FaArrowRight
} from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';
import { getWilayaList, getBaladyiatsForWilaya } from '@dzcode-io/leblad';

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const localWilayaNames = new Map<number, string>(
    getWilayaList().map((wilaya: { mattricule: number; name_ar: string }) => [
        wilaya.mattricule,
        wilaya.name_ar,
    ] as const),
);

interface CheckoutFormProps {
    cart: Array<{
        product_name: string;
        quantity: number;
        selected_color: string;
        selected_size: string;
        price: number;
    }>;
    totalPrice: number;
    onSuccess: () => void;
    setOrderID: React.Dispatch<React.SetStateAction<string>>;
}

interface GuepexWilaya {
    id: number;
    name: string;
}

interface GuepexCommune {
    id: number;
    name: string;
}

interface DeliveryFees {
    home: number;
    office: number;
}

async function fetchGuepex<T>(url: string, signal: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal });
    const result: unknown = await response.json();

    if (!response.ok) {
        const errorMessage = (
            typeof result === "object"
            && result !== null
            && "error" in result
            && typeof result.error === "string"
        ) ? result.error : "تعذر تحميل بيانات التوصيل.";
        throw new Error(errorMessage);
    }

    return result as T;
}

export default function CheckoutForm({ cart, totalPrice, onSuccess, setOrderID }: CheckoutFormProps) {
    const [selectedWilaya, setSelectedWilaya] = useState("");
    const [wilayaOptions, setWilayaOptions] = useState<GuepexWilaya[]>([]);
    const [communes, setCommunes] = useState<GuepexCommune[]>([]);
    const [deliveryFees, setDeliveryFees] = useState<DeliveryFees | null>(null);
    const [isLoadingWilayas, setIsLoadingWilayas] = useState(true);
    const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);
    const [isLoadingFees, setIsLoadingFees] = useState(false);
    const [locationError, setLocationError] = useState("");
    const [feesError, setFeesError] = useState("");
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

    useEffect(() => {
        const controller = new AbortController();
        fetchGuepex<{ data: GuepexWilaya[] }>("/api/guepex?resource=wilayas", controller.signal)
            .then(({ data }) => {
                if (!Array.isArray(data)) throw new Error("تعذر تحميل قائمة الولايات.");
                setWilayaOptions(data.map(wilaya => ({
                    ...wilaya,
                    name: localWilayaNames.get(wilaya.id) ?? wilaya.name,
                })));
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;
                console.error("Error fetching Guepex wilayas:", error);
                setLocationError(error instanceof Error ? error.message : "تعذر تحميل قائمة الولايات.");
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoadingWilayas(false);
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        setCommunes([]);
        setDeliveryFees(null);
        setLocationError("");
        setFeesError("");
        setFormData(prev => ({ ...prev, commune: "" }));
        if (!selectedWilaya) {
            setIsLoadingCommunes(false);
            return;
        }

        const controller = new AbortController();
        setIsLoadingCommunes(true);
        fetchGuepex<{ data: GuepexCommune[] }>(
            `/api/guepex?resource=communes&wilayaId=${selectedWilaya}`,
            controller.signal,
        )
            .then(({ data }) => {
                if (!Array.isArray(data)) throw new Error("تعذر تحميل قائمة البلديات.");
                const localCommuneNames = new Map<number, string>(
                    getBaladyiatsForWilaya(Number(selectedWilaya))
                        .map((commune: { code: number; name_ar: string }) => [
                            commune.code,
                            commune.name_ar,
                        ] as const),
                );
                setCommunes(data.map(commune => ({
                    ...commune,
                    name: localCommuneNames.get(commune.id) ?? commune.name,
                })));
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;
                console.error("Error fetching Guepex communes:", error);
                setLocationError(error instanceof Error ? error.message : "تعذر تحميل قائمة البلديات.");
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoadingCommunes(false);
            });
        return () => controller.abort();
    }, [selectedWilaya]);

    useEffect(() => {
        setDeliveryFees(null);
        setFeesError("");
        if (!selectedWilaya || !formData.commune) {
            setIsLoadingFees(false);
            return;
        }

        const controller = new AbortController();
        setIsLoadingFees(true);
        fetchGuepex<{ data: DeliveryFees }>(
            `/api/guepex?resource=fees&wilayaId=${selectedWilaya}&communeId=${formData.commune}`,
            controller.signal,
        )
            .then(({ data }) => {
                if (typeof data?.home !== "number" || typeof data?.office !== "number") {
                    throw new Error("لا تتوفر أسعار توصيل لهذه البلدية.");
                }
                setDeliveryFees(data);
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;
                console.error("Error fetching Guepex delivery fees:", error);
                setFeesError(error instanceof Error ? error.message : "تعذر حساب سعر التوصيل.");
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoadingFees(false);
            });
        return () => controller.abort();
    }, [selectedWilaya, formData.commune]);

    const selectedWilayaDetails = wilayaOptions.find(
        wilaya => String(wilaya.id) === selectedWilaya,
    );
    const selectedCommuneDetails = communes.find(
        commune => String(commune.id) === formData.commune,
    );
    const deliveryPrice = deliveryFees
        ? deliveryType === "domocile" ? deliveryFees.home : deliveryFees.office
        : 0;
    const finalTotal = totalPrice + deliveryPrice;

    const getSelectedDeliveryLabel = () => {
        if (isLoadingFees) return "جارٍ حساب السعر...";
        if (feesError) return "تعذر حساب السعر";
        if (!selectedWilaya || !formData.commune) return "حدد الولاية والبلدية أولاً";
        return `${deliveryPrice} دج`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPhoneError("")

        if (!cart || cart.length === 0) {
            alert("سلة التسوق فارغة");
            return;
        }

        if (!deliveryFees) {
            setFeesError("يرجى انتظار حساب سعر التوصيل قبل تأكيد الطلب.");
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

        const fullAddress = `${selectedWilayaDetails?.name || ''}, ${selectedCommuneDetails?.name || ''}`;

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
                            onChange={(e) => {
                                setDeliveryFees(null);
                                setSelectedWilaya(e.target.value);
                            }}
                            value={selectedWilaya}
                            required
                        >
                            <option value="">
                                {isLoadingWilayas ? "جارٍ تحميل الولايات..." : "اختر الولاية"}
                            </option>
                            {wilayaOptions.map((wilaya) => (
                                <option key={wilaya.id} value={wilaya.id}>
                                    {String(wilaya.id).padStart(2, "0")} - {wilaya.name}
                                </option>
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
                            onChange={(e) => {
                                setDeliveryFees(null);
                                setFormData({ ...formData, commune: e.target.value });
                            }}
                            disabled={!selectedWilaya || isLoadingCommunes}
                        >
                            <option value="">
                                {isLoadingCommunes
                                    ? "جارٍ تحميل البلديات..."
                                    : selectedWilaya ? "اختر البلدية" : "اختر الولاية أولاً"}
                            </option>
                            {communes.map((commune) => (
                                <option key={commune.id} value={commune.id}>
                                    {commune.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {(locationError || (!isLoadingWilayas && wilayaOptions.length === 0)) && (
                    <p className="text-red-500 text-xs" role="alert">
                        {locationError || "لا توجد ولايات متاحة للتوصيل حالياً."}
                    </p>
                )}
                {feesError && (
                    <p className="text-red-500 text-xs" role="alert">{feesError}</p>
                )}

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
                    <h3 className="text-sm font-bold text-gray-700 mb-3">نوع التوصيل (Guepex)</h3>
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
                                    {deliveryFees && (
                                        <span className="block text-xs font-normal">
                                            {type === 'domocile' ? deliveryFees.home : deliveryFees.office} دج
                                        </span>
                                    )}
                                </span>
                            </label>
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
                            {getSelectedDeliveryLabel()}
                        </span>
                    </div>
                    <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-black">الإجمالي</span>
                        <span className="text-2xl font-black text-green-600">{finalTotal} دج</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !deliveryFees}
                    className={`w-full ${isSubmitting || !deliveryFees ? 'bg-gray-400' : 'bg-black'} text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99]`}
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