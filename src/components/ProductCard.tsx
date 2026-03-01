// components/ProductCard.tsx
import Link from 'next/link'; // Import the Link component

interface ProductProps {
  id: string | number; // Added id to the props
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
}

export default function ProductCard({ id, name, price, oldPrice, discount, image }: ProductProps) {
  return (
    <Link href={`/product/${id}`} className="group">
    <div className="group rounded-lg overflow-hidden flex flex-col bg-white text-black hover:cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden rounded-2xl">
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{discount}%
        </span>
        <img 
          src={image} 
          alt={name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 text-center space-y-2">
        <h3 className="font-semibold text-gray-800 uppercase text-sm">{name}</h3>
        <div className="flex flex-col items-center">
          <p className="text-gray-400 line-through text-xs">{oldPrice} دج</p>
          <p className="text-black font-bold">{price} دج</p>
        </div>
        
        <button className="w-full border-2 border-black py-2 rounded-md font-bold hover:bg-black hover:text-white transition-colors">
          أطلب
        </button>
      </div>
    </div>
    </Link>
  );
}