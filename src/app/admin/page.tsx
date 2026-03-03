"use client"
import React, { useState } from 'react';
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

// --- Types & Interfaces ---

type OrderStatus = 'Pending' | 'Confirmed' | 'Canceled';

interface Product {
  id: number;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  images: string[];
  stock: number;
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
  
  const [products, setProducts] = useState<Product[]>([
    { 
      id: 1, 
      name: "Classic Oversized Tee", 
      price: 3500, 
      colors: ["Black", "White", "Sand"], 
      sizes: ["S", "M", "L", "XL"],
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
      stock: 45
    },
    { 
      id: 2, 
      name: "Heavyweight Hoodie", 
      price: 6800, 
      colors: ["Charcoal", "Navy"], 
      sizes: ["M", "L", "XL"],
      images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"],
      stock: 12
    }
  ]);

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

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: p.id } : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
    }
    setActiveTab('inventory');
  };

  const deleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600 flex items-center gap-2">
            <Package size={28} />
            <span>MODA</span>
          </h1>
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
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
                  <h3 className="font-bold text-lg text-slate-800">{product.name}</h3>
                  <p className="text-indigo-600 font-bold mt-1 text-xl">{product.price.toLocaleString()} DZD</p>
                  
                  <div className="mt-4 flex flex-wrap gap-1">
                    {product.sizes.map(s => (
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
              onSave={handleAddProduct} 
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
    name: initialData.name,
    price: initialData.price,
    colors: initialData.colors,
    sizes: initialData.sizes,
    images: initialData.images,
    stock: initialData.stock
  } : {
    name: '',
    price: 0,
    colors: [],
    sizes: [],
    images: [],
    stock: 0
  });

  const [currentColor, setCurrentColor] = useState('');
  const [currentSize, setCurrentSize] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAddColor = () => {
    if (currentColor && !formData.colors.includes(currentColor)) {
      setFormData({ ...formData, colors: [...formData.colors, currentColor] });
      setCurrentColor('');
    }
  };

  const handleAddSize = () => {
    if (currentSize && !formData.sizes.includes(currentSize)) {
      setFormData({ ...formData, sizes: [...formData.sizes, currentSize] });
      setCurrentSize('');
    }
  };

  const handleAddImage = () => {
    if (imageUrl) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) return;
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Stock</label>
           <input 
            type="number" 
            value={formData.stock || ''}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
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
                 <button type="button" className="hover:text-indigo-900 ml-1" onClick={() => setFormData({...formData, colors: formData.colors.filter(x => x !== c)})}>×</button>
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
                onChange={(e) => setCurrentSize(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none"
                placeholder="S, M, L..."
              />
              <button type="button" onClick={handleAddSize} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                <PlusCircle size={20} className="text-slate-600" />
              </button>
           </div>
           <div className="mt-2 flex flex-wrap gap-2 min-h-[32px]">
             {formData.sizes.map(s => (
               <span key={s} className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md flex items-center gap-1 uppercase border border-slate-200">
                 {s}
                 <button type="button" className="hover:text-slate-900 ml-1" onClick={() => setFormData({...formData, sizes: formData.sizes.filter(x => x !== s)})}>×</button>
               </span>
             ))}
           </div>
        </div>

        <div className="md:col-span-2">
           <label className="block text-sm font-semibold text-slate-700 mb-2">Image URLs</label>
           <div className="flex gap-2">
            <input 
                type="text" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none"
                placeholder="Paste image link here..."
              />
              <button type="button" onClick={handleAddImage} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                <Upload size={20} className="text-slate-600" />
              </button>
           </div>
           {formData.images.length > 0 && (
              <div className="mt-3 flex gap-3 overflow-x-auto py-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden shadow-sm group">
                    <img src={img} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                      className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
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