import React from 'react';
import { Noto_Kufi_Arabic } from 'next/font/google';
import Navbar from '@/components/Navbar';


const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700']
});


interface DeliveryRate {
  state: string;
  homePrice: string;
  officePrice: string;
  isZeroPrice?: boolean;
}

const deliveryData: DeliveryRate[] = [
  { state: "أدرار", homePrice: "1600 دج", officePrice: "800 دج" },
  { state: "الشلف", homePrice: "850 دج", officePrice: "450 دج" },
  { state: "الأغواط", homePrice: "1100 دج", officePrice: "600 دج" },
  { state: "أم البواقي", homePrice: "900 دج", officePrice: "400 دج" },
  { state: "باتنة", homePrice: "900 دج", officePrice: "400 دج" },
  { state: "بجاية", homePrice: "850 دج", officePrice: "400 دج" },
  { state: "بسكرة", homePrice: "1100 دج", officePrice: "600 دج" },
  { state: "بشار", homePrice: "1400 دج", officePrice: "600 دج" },
  { state: "البليدة", homePrice: "800 دج", officePrice: "400 دج" },
  { state: "البويرة", homePrice: "850 دج", officePrice: "400 دج" },
  { state: "تمنراست", homePrice: "1600 دج", officePrice: "1000 دج" },
  { state: "تبسة", homePrice: "1100 دج", officePrice: "600 دج" },
  { state: "تلمسان", homePrice: "850 دج", officePrice: "400 دج" },
  { state: "تيارت", homePrice: "850 دج", officePrice: "400 دج" },
  { state: "تيزي وزو", homePrice: "750 دج", officePrice: "350 دج" }, // Local business rate
  { state: "الجزائر", homePrice: "750 دج", officePrice: "350 دج" },
  { state: "الجلفة", homePrice: "1100 دج", officePrice: "600 دج" },
  { state: "جيجل", homePrice: "950 دج", officePrice: "400 دج" },
  { state: "سطيف", homePrice: "900 دج", officePrice: "400 دج" },
  { state: "سعيدة", homePrice: "850 دج", officePrice: "400 دج" },
  { state: "سكيكدة", homePrice: "950 دج", officePrice: "400 دج" },
  { state: "سيدي بلعباس", homePrice: "850 دج", officePrice: "350 دج" },
  { state: "عنابة", homePrice: "900 دج", officePrice: "400 دج" },
  { state: "قالمة", homePrice: "950 دج", officePrice: "400 دج" },
  { state: "قسنطينة", homePrice: "900 دج", officePrice: "400 دج" },
  { state: "المدية", homePrice: "850 دج", officePrice: "400 دج" },
  { state: "مستغانم", homePrice: "850 دج", officePrice: "350 دج" },
  { state: "المسيلة", homePrice: "900 دج", officePrice: "400 دج" },
  { state: "معسكر", homePrice: "850 دج", officePrice: "350 دج" },
  { state: "ورقلة", homePrice: "1250 دج", officePrice: "600 دج" },
  { state: "وهران", homePrice: "850 دج", officePrice: "400 دج" }, // Standardized business rate
  { state: "البيض", homePrice: "1100 دج", officePrice: "600 دج" },
  { state: "إليزي", homePrice: "1800 دج", officePrice: "1200 دج" },
  { state: "برج بوعريريج", homePrice: "900 دج", officePrice: "400 دج" },
  { state: "بومرداس", homePrice: "800 دج", officePrice: "400 دج" },
  { state: "الطارف", homePrice: "1000 دج", officePrice: "400 دج" },
  { state: "تندوف", homePrice: "1600 دج", officePrice: "1000 دج" },
  { state: "تيسيمسيلت", homePrice: "850 دج", officePrice: "400 دج" },
  { state: "الوادي", homePrice: "1200 دج", officePrice: "600 دج" },
  { state: "خنشلة", homePrice: "1000 دج", officePrice: "400 دج" },
  { state: "سوق أهراس", homePrice: "1000 دج", officePrice: "400 دج" },
  { state: "تيبازة", homePrice: "850 دج", officePrice: "350 دج" },
  { state: "ميلة", homePrice: "1000 دج", officePrice: "400 دج" },
  { state: "عين الدفلى", homePrice: "900 دج", officePrice: "400 دج" },
  { state: "النعامة", homePrice: "1400 دج", officePrice: "800 دج" },
  { state: "عين تيموشنت", homePrice: "950 دج", officePrice: "400 دج" },
  { state: "غرداية", homePrice: "1200 دج", officePrice: "600 دج" },
  { state: "غليزان", homePrice: "950 دج", officePrice: "400 دج" },
  { state: "تيميمون", homePrice: "1600 دج", officePrice: "800 دج" },
  { state: "برج باجي مختار", homePrice: "2000 دج", officePrice: "1500 دج" },
  { state: "أولاد جلال", homePrice: "1100 دج", officePrice: "600 دج" },
  { state: "بني عباس", homePrice: "1400 دج", officePrice: "600 دج" },
  { state: "عين صالح", homePrice: "1600 دج", officePrice: "1000 دج" },
  { state: "عين قزام", homePrice: "1600 دج", officePrice: "1000 دج" },
  { state: "تقرت", homePrice: "1200 دج", officePrice: "600 دج" },
  { state: "جانت", homePrice: "1800 دج", officePrice: "1200 دج" },
  { state: "المغير", homePrice: "1200 دج", officePrice: "600 دج" },
  { state: "المنيعة", homePrice: "1200 دج", officePrice: "600 دج" },
];

export default function DeliverySection() {
  return (
    <section 
      className={`${notoKufi.className} font-sans bg-[#fcfcfc] min-h-screen py-10 px-5 text-[#1a1a1a] mt-20`}
    >
      <Navbar />
      <div className="max-w-[800px] mx-auto bg-white p-8 md:p-[60px] border border-[#ececec] shadow-[0_30px_60px_rgba(0,0,0,0.05)]"   dir="rtl">
        
        {/* Header */}
        <header className="text-center mb-[60px]">
          <h1 className=" text-4xl md:text-[3rem] mb-[10px] leading-tight">
            أسعار التوصيل
          </h1>
          <div className="w-[50px] h-[0.5px] bg-black mx-auto mt-5"></div>
        </header>

        {/* Table Container */}
        <div className="border-t-2 border-[#1a1a1a]">
          
          {/* Table Header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] py-5 font-bold uppercase tracking-wider border-bottom border-[#ececec] text-sm">
            <span className="font-semibold">الولاية</span>
            <span className="text-[#555]">توصيل للمنزل</span>
            <span className="text-[#555]">توصيل للمكتب</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#ececec]">
            {deliveryData.map((item, index) => (
              <div 
                key={index} 
                className="grid grid-cols-[1.5fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] py-[18px] transition-all duration-300 ease-in-out hover:bg-[#fbfbfb] hover:pr-[10px]"
              >
                <span className="text-base font-semibold">{item.state}</span>
                <span className="text-base text-[#555]">{item.homePrice}</span>
                <span className={`text-base ${item.isZeroPrice ? 'text-black font-bold' : 'text-[#555]'}`}>
                  {item.officePrice}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}