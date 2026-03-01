// app/page.tsx
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Home() {
  // Fetch data directly from your Supabase table
  const { data: products, error } = await supabase
    .from('hmed-ecommerce')
    .select('*');

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-black flex flex-col items-end">
        <h1 className="text-3xl font-bold gap-2">
          منتجاتنا <span className="text-red-500">❤️</span>
        </h1>
        <p className="text-gray-500 mt-2">اكتشف أفضل المنتجات بأفضل الأسعار 🔥</p>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => {
            // Safely extract the first image URL from the JSONB array
            const firstImage = product.product_images?.[0]?.image_url || '/placeholder.jpg';
            
            // Calculate fake discount to maintain your UI design
            // (You can add these as actual columns in Supabase later!)
            const calculatedOldPrice = Math.round(product.price * 1.6); // Makes old price 60% higher
            const calculatedDiscount = Math.round(((calculatedOldPrice - product.price) / calculatedOldPrice) * 100);

            return (
              <ProductCard 
                key={product.id}
                id={product.id} // Pass the ID here! 
                name={product.product_name}
                price={product.price}
                oldPrice={calculatedOldPrice}
                discount={calculatedDiscount}
                image={firstImage}
              />
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}