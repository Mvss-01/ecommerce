import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || '';

  // <-- Build the Supabase query dynamically
  let supabaseQuery = supabase.from('hmed-ecommerce').select('*');

  // If there's a search term, filter by product name
  if (query) {
    supabaseQuery = supabaseQuery.ilike('product_name', `%${query}%`);
  }

  // Fetch the data
  const { data: products, error } = await supabaseQuery;

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <div className="grow container mx-auto px-4 pb-10 mt-20" dir="rtl"></div>

      {/* Hero Section */}
      {/* <section className="container mx-auto px-4 py-12 text-black flex flex-col items-end">
        <h1 className="text-3xl font-bold gap-2">
          منتجاتنا <span className="text-red-500">❤️</span>
        </h1>
        <p className="text-gray-500 mt-2">اكتشف أفضل المنتجات بأفضل الأسعار 🔥</p>
      </section> */}

      {query && (
        <div className="mb-10">
          {products && products.length > 0 ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black">
              "{query}" : نتائج البحث عن 
              </h2>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-medium text-gray-600">
                عذرًا، لم نتمكن من العثور على أي نتائج لـ : "{query}"
              </h2>
              <p className="text-gray-400 mt-2">جرب البحث بكلمات مختلفة</p>
            </div>
          )}
        </div>
      )}

      {/* Product Grid */}
      <section className="container mx-auto px-4 pb-20 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => {
            // Safely extract the first image URL from the JSONB array
            const firstImage = product.product_images?.[0] || '/placeholder.jpg';

            // Calculate fake discount to maintain your UI design
            // (You can add these as actual columns in Supabase later!)
            const calculatedOldPrice = Math.round(product.price * 1.6); // Makes old price 60% higher
            const discount = product.discount > 0 ? product.discount : 0

            return (
              <ProductCard
                key={product.id}
                id={product.id} // Pass the ID here! 
                name={product.product_name}
                price={product.price}
                oldPrice={calculatedOldPrice}
                product_discount={discount}
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