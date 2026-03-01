// src/app/product/[id]/page.tsx
import { createClient } from '@supabase/supabase-js';
import ProductClientPage from './ProductClientPage';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  console.log("Searching for ID:", id); // Check your terminal for this!

  // Try to find the product by id
  const { data: product, error } = await supabase
    .from('hmed-ecommerce')
    .select('*')
    .eq('id', id);

  // Better error handling
  if (error) {
    console.log("Supabase Error:", error.message);
    return notFound();
  }

  if (!product || product.length === 0) {
    console.log("No product found with ID:", id);
    return notFound();
  }

  return <ProductClientPage product={product[0]} />;
}