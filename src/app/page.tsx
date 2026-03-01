import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { Noto_Kufi_Arabic } from 'next/font/google';

// 1. Initialize the font outside the component
const notoKufi = Noto_Kufi_Arabic({ 
  subsets: ['arabic'], 
  weight: ['400', '700'] // Optional: specify weights if needed
});

export default function Home() {
  return (
    // 2. Use .className to get the actual CSS class string
    <main className={`min-h-screen bg-white ${notoKufi.className}`}> 
      <ProductGrid />
    </main>
  );
}