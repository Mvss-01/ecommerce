import Link from 'next/link';

interface ProductProps {
  id: string | number;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
}

export default function ProductCard({ id, name, price, oldPrice, discount, image }: ProductProps) {
  return (
    // 'h-full' ensures cards in a grid stretch to the same height
    <Link href={`/product/${id}`} className="group flex h-full cursor-pointer">
      <div className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-200">
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
          {/* Discount Badge */}
          {discount ? (
            <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </div>
          ) : null}

          <img 
            src={image} 
            alt={name} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </div>

        {/* Content (Set to RTL for Arabic text alignment) */}
        <div className="flex flex-col flex-grow p-4 md:p-5 text-right" dir="rtl">
          <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 mb-3 group-hover:text-black transition-colors">
            {name}
          </h3>
          
          <div className="mt-auto flex flex-col space-y-4">
            {/* Pricing */}
            <div className="flex flex-row items-center gap-2">
              <span className="text-black font-bold text-lg">{price} دج</span>
              {oldPrice ? (
                <span className="text-gray-400 line-through text-xs font-medium mt-1">{oldPrice} دج</span>
              ) : null}
            </div>
            
            {/* Fake button: Replaced <button> with <span> for valid HTML inside a <Link> */}
            <span className="w-full flex items-center justify-center bg-gray-50 text-gray-900 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:shadow-md">
              أطلب الآن
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}