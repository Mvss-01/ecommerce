import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { Noto_Kufi_Arabic } from 'next/font/google';

const notoKufi = Noto_Kufi_Arabic({ 
  subsets: ['arabic'], 
  weight: ['400', '700'] 
});

// Step 1: Accept searchParams here
export default function Home({ 
  searchParams 
}: { 
  searchParams: { q?: string } 
}) {
  return (
    <main className={`min-h-screen bg-white ${notoKufi.className}`}> 
      {/* Step 2: Pass them into your ProductGrid component */}
      <ProductGrid searchParams={searchParams} />
    </main>
  );
}