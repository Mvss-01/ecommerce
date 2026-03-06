"use client"
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  ChevronDown,
  Layers
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Types & Interfaces ---

type OrderStatus = 'Pending' | 'Confirmed' | 'Canceled';

interface Product {
  id: number;
  product_name: string;
  price: number;
  colors: string[];
  available_sizes: string[];
  product_images: string[];
  stock: number;
  discount: number
}

interface OrderItem {
  productId: number;
  name: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customer: string;
  date: string;
}

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'add-product'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // --- 1. Fetch Products from Supabase ---
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hmed-ecommerce')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error("Error fetching:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. Save (Create or Update) to Supabase ---
  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    setLoading(true);

    if (editingProduct) {
      const { error } = await supabase
        .from('hmed-ecommerce')
        .update(productData) // This will now include the new product_images array
        .eq('id', editingProduct.id);

      if (error) alert("Update failed: " + error.message);
    } else {
      const { error } = await supabase
        .from('hmed-ecommerce')
        .insert([productData]); // This inserts all fields including the image URLs

      if (error) alert("Insert failed: " + error.message);
    }

    setEditingProduct(null);
    await fetchProducts();
    setActiveTab('inventory');
  };

  // --- 3. Delete from Supabase ---
  const deleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product from the database?")) {
      setLoading(true);
      const { error } = await supabase
        .from('hmed-ecommerce')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Delete failed");
      } else {
        setProducts(products.filter(p => p.id !== id));
      }
      setLoading(false);
    }
  };

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-7721",
      items: [
        { productId: 1, name: "Classic Oversized Tee", color: "Black", size: "L", quantity: 2, unitPrice: 3500 },
        { productId: 2, name: "Heavyweight Hoodie", color: "Navy", size: "M", quantity: 1, unitPrice: 6800 }
      ],
      total: 13800,
      status: "Pending",
      customer: "Ahmed K.",
      date: "2023-10-24"
    },
    {
      id: "ORD-8810",
      items: [
        { productId: 2, name: "Heavyweight Hoodie", color: "Navy", size: "M", quantity: 1, unitPrice: 6800 }
      ],
      total: 6800,
      status: "Confirmed",
      customer: "Sara M.",
      date: "2023-10-23"
    }
  ]);


  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: p.id } : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
    }
    setActiveTab('inventory');
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-600 flex items-center gap-2">
            <Package size={28} />
            <span>MODA</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            Inventory
          </button>
          <button
            onClick={() => { setEditingProduct(null); setActiveTab('add-product'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'add-product' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <PlusCircle size={20} />
            Add Product
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShoppingCart size={20} />
            Client Orders
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-500">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">DZ</div>
            <div className="text-sm">
              <p className="font-medium text-slate-800">Admin User</p>
              <p className="text-xs">Algeria Store</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-slate-500">Manage your clothing business with ease.</p>
          </div>
        </header>

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-lg transition-all">
                <div className="h-100 bg-slate-100 relative overflow-hidden">
                  <img src={product.product_images[0]} alt={product.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => { setEditingProduct(product); setActiveTab('add-product'); }}
                      className="p-2 bg-white/90 backdrop-blur rounded-full text-slate-600 hover:text-indigo-600 shadow-sm transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 bg-white/90 backdrop-blur rounded-full text-slate-600 hover:text-red-600 shadow-sm transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-800">{product.product_name}</h3>
                  <p className="text-indigo-600 font-bold mt-1 text-xl">{product.price} DZD</p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {product.available_sizes.reverse().map(s => (
                      <span key={s} className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded text-slate-600 uppercase">{s}</span>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    {product.colors.map(c => (
                      <div key={c} className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: c.toLowerCase() }} title={c}></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add-product' && (
          <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <ProductForm
              onSave={handleSaveProduct}
              initialData={editingProduct}
              onCancel={() => setActiveTab('inventory')}
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Products (Qty)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-48">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors align-top">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-400 block mb-1">{order.id}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold">
                          <Clock size={10} /> {order.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col border-l-2 border-indigo-100 pl-3">
                              <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                              <div className="flex gap-2 items-center mt-0.5">
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase">{item.size}</span>
                                <span className="text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-600 font-bold uppercase">{item.color}</span>
                                <span className="text-[10px] text-slate-400 font-bold">×{item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{order.customer}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-indigo-600 whitespace-nowrap">{order.total.toLocaleString()} DZD</p>
                        <p className="text-[10px] text-slate-400 font-medium">{order.items.length} unique items</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusDropdown
                          currentStatus={order.status}
                          onStatusChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Sub-components ---

interface StatusDropdownProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
}

function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusConfig: Record<OrderStatus, { color: string; icon: React.ReactNode }> = {
    Pending: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock size={14} /> },
    Confirmed: { color: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle2 size={14} /> },
    Canceled: { color: "bg-red-100 text-red-700 border-red-200", icon: <XCircle size={14} /> }
  };

  const options: OrderStatus[] = ['Pending', 'Confirmed', 'Canceled'];

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all hover:shadow-sm ${statusConfig[currentStatus].color}`}
      >
        <div className="flex items-center gap-2">
          {statusConfig[currentStatus].icon}
          {currentStatus}
        </div>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map(option => (
              <button
                key={option}
                onClick={() => {
                  onStatusChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center gap-2 ${currentStatus === option ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
              >
                {statusConfig[option].icon}
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface ProductFormProps {
  onSave: (product: Omit<Product, 'id'>) => void;
  initialData: Product | null;
  onCancel: () => void;
}

function ProductForm({ onSave, initialData, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(initialData ? {
    product_name: initialData.product_name,
    price: initialData.price,
    colors: initialData.colors,
    available_sizes: initialData.available_sizes,
    product_images: initialData.product_images,
    stock: initialData.stock,
    discount: initialData.discount
  } : {
    product_name: '',
    price: 0,
    colors: [],
    available_sizes: [],
    product_images: [],
    stock: 0,
    discount: 0
  });

  const [currentColor, setCurrentColor] = useState('');
  const [currentSize, setCurrentSize] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleAddColor = () => {
    if (currentColor && !formData.colors.includes(currentColor)) {
      setFormData({ ...formData, colors: [...formData.colors, currentColor] });
      setCurrentColor('');
    }
  };

  const handleAddSize = () => {
    if (currentSize && !formData.available_sizes.includes(currentSize)) {
      setFormData({ ...formData, available_sizes: [currentSize, ...formData.available_sizes] });
      setCurrentSize('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const files = Array.from(e.target.files);
      const newImageUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${Date.now()}-${fileName}`;

        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        product_images: [...prev.product_images, ...newImageUrls]
      }));

    } catch (error) {
      alert('Error uploading image!');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name || formData.price <= 0) return;
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
          <input
            type="text"
            required
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Linen Summer Shirt"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Price (DZD)</label>
          <div className="relative">
            <input
              type="number"
              required
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              placeholder="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">DZD</span>
          </div>
        </div>

        {/* <div>
           <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Stock</label>
           <input 
            type="number" 
            value={formData.stock || ''}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            placeholder="0"
          />
        </div> */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Discount</label>
          <input
            type="number"
            value={formData.discount || ''}
            onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            Colors <span className="text-[10px] font-normal text-slate-400">(Enter to add)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none"
              placeholder="Black, White..."
            />
            <button type="button" onClick={handleAddColor} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              <PlusCircle size={20} className="text-slate-600" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 min-h-[32px]">
            {formData.colors.map(c => (
              <span key={c} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md flex items-center gap-1 border border-indigo-100 uppercase">
                {c}
                <button type="button" className="hover:text-indigo-900 ml-1" onClick={() => setFormData({ ...formData, colors: formData.colors.filter(x => x !== c) })}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Sizes</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentSize}
              onChange={(e) => setCurrentSize(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none"
              placeholder="S, M, L..."
            />
            <button type="button" onClick={handleAddSize} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              <PlusCircle size={20} className="text-slate-600" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 min-h-[32px]">
            {/* toReversed() creates a shallow copy, so it won't break your state */}
            {formData.available_sizes.toReversed().map(s => (
              <span key={s} className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md flex items-center gap-1 uppercase border border-slate-200">
                {s}
                <button
                  type="button"
                  className="hover:text-slate-900 ml-1"
                  onClick={() => {
                    // No need to reverse inside the filter; just filter the original state
                    setFormData({
                      ...formData,
                      available_sizes: formData.available_sizes.filter(x => x !== s)
                    });
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Product Images {uploading && <span className="text-indigo-600 animate-pulse">(Uploading...)</span>}
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Click to upload images</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
          {/* Preview Gallery */}
          {formData.product_images.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto py-2">
              {formData.product_images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, product_images: formData.product_images.filter((_, i) => i !== idx) })}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-t border-slate-100 pt-8 mt-4">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
        >
          {initialData ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}