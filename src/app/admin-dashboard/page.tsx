"use client"
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Trash2,
  Edit3,
  Clock,
  Upload,
  ChevronDown,
  Layers,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { Noto_Kufi_Arabic } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr'

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700']
});

 const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
// --- Types & Interfaces ---

type OrderStatus = 'pending' | 'confirmed' | 'canceled';

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
  name: string;
  color: string;
  size: string;
  quantity: number;
}

interface Order {
  id: number;
  order_id: string;
  products: OrderItem[];
  total: number;
  status: OrderStatus;
  client_name: string;
  phone_number: string;
  adress: string;
  delivery_type: string;
  created_at: string;
}

// --- Main App Component ---

export default function App() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Inventaire' | 'orders' | 'ajoute-produits'>('Inventaire');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      router.push('/admin-login'); // Redirect to your login page
      router.refresh();
    }
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
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) alert("Update failed: " + error.message);
    } else {
      const { error } = await supabase
        .from('hmed-ecommerce')
        .insert([productData]);

      if (error) alert("Insert failed: " + error.message);
    }

    setEditingProduct(null);
    await fetchProducts();
    setActiveTab('Inventaire');
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

  // --- Delete Order from Supabase ---
  const deleteOrder = async (orderId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('client-orders')
      .delete()
      .eq('order_id', orderId);

    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
    } else {
      setOrders(orders.filter(order => order.order_id !== orderId));
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('client-orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('client-orders')
      .update({ status: newStatus })
      .eq('order_id', orderId);

    if (error) {
      alert("Failed to update status");
    } else {
      setOrders(orders.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: p.id } : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
    }
    setActiveTab('Inventaire');
  };

  const navigateTab = (tab: 'Inventaire' | 'orders' | 'ajoute-produits') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600 flex items-center gap-2">
          <Package size={24} />
          <span>La Perle</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l md:border-l-0 md:border-r border-slate-200 flex flex-col h-screen transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:top-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-600 flex items-center gap-2">
            <Package size={28} />
            <span>La Perle</span>
          </Link>
          <button
            className="md:hidden text-slate-500 hover:bg-slate-100 p-1 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <button
            onClick={() => navigateTab('Inventaire')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'Inventaire' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            L'inventaire
          </button>
          <button
            onClick={() => { setEditingProduct(null); navigateTab('ajoute-produits'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ajoute-produits' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <PlusCircle size={20} />
            Ajouter un produit
          </button>
          <button
            onClick={() => navigateTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShoppingCart size={20} />
            Commandes clients
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-500">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">DZ</div>
            <div className="text-sm">
              <p className="font-medium text-slate-800">Admin User</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
        <header className="mb-6 md:mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-sm md:text-base text-slate-500">Gérez votre entreprise de vêtements en toute simplicité.</p>
          </div>
        </header>

        {activeTab === 'Inventaire' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-lg transition-all">
                <div className="h-120 sm:h-110 bg-slate-100 relative overflow-hidden">
                  <img src={product.product_images[0]} alt={product.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => { setEditingProduct(product); navigateTab('ajoute-produits'); }}
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
                  <h3 className="font-bold text-lg text-slate-800 truncate">{product.product_name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {product.stock} en stock
                  </span>
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

        {activeTab === 'ajoute-produits' && (
          <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <ProductForm
              onSave={handleSaveProduct}
              initialData={editingProduct}
              onCancel={() => navigateTab('Inventaire')}
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col w-full">
            <div className="overflow-x-auto w-full pb-27">
              <table className={`w-full text-left border-collapse min-w-250 xl:min-w-full ${notoKufi.className}`}>
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Commande</th>
                    <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase">Produits</th>
                    <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Client</th>
                    <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Numéro</th>
                    <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase min-w-50 xl:min-w-50">Adresse</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Type de livraison</th>
                    <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Total</th>
                    <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-500 uppercase w-30 whitespace-nowrap">Statut</th>
                    <th className="text-xs font-bold text-slate-500 uppercase text-center whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
                    <tr key={order.order_id} className="hover:bg-slate-50/50 transition-colors align-top">
                      <td className="px-4 md:px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-400 block mb-1">{order.order_id}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold whitespace-nowrap">
                          <Clock size={10} /> {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 min-w-50">
                        <div className="space-y-3">
                          {order.products.map((item, idx) => (
                            <div key={idx} className="flex flex-col border-l-2 border-indigo-100 pl-3">
                              <p className="font-semibold text-sm text-slate-800">{item.name}</p>
                              <div className="flex gap-2 items-center text-[10px] font-bold uppercase">
                                <span className="text-slate-500">{item.size}</span>
                                <span className="text-indigo-400">{item.color}</span>
                                <span className="text-slate-400">×{item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 font-bold text-sm text-slate-700 whitespace-nowrap">{order.client_name}</td>
                      <td className="px-4 md:px-6 py-4 text-sm font-bold text-slate-700 whitespace-nowrap">{order.phone_number}</td>
                      <td className="px-4 md:px-6 py-4 text-[14px] md:text-[15px] text-black xl:max-w-none wrap-break-word leading-tight">{order.adress}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-slate-100 text-[10px] rounded font-bold uppercase text-slate-600 whitespace-nowrap">{order.delivery_type}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <p className="font-bold text-indigo-600 whitespace-nowrap">{order.total.toLocaleString()} DZD</p>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <StatusDropdown
                          currentStatus={order.status}
                          onStatusChange={(newStatus) => updateOrderStatus(order.order_id, newStatus)}
                        />
                      </td>
                      <td className="px-4 md:px-6 py-4 text-center">
                        <button
                          onClick={() => deleteOrder(order.order_id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Supprimer la commande"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && !loading && <div className="p-10 text-center text-slate-400">Aucune commande trouvée.</div>}
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

  const config: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "En Attente" },
    confirmed: { color: "bg-green-100 text-green-700 border-green-200", label: "Confirmé" },
    canceled: { color: "bg-red-100 text-red-700 border-red-200", label: "Annulé" }
  };

  const options: OrderStatus[] = ['pending', 'confirmed', 'canceled'];

  const safeConfig = config[currentStatus] || {
    color: "bg-slate-100 text-slate-700 border-slate-200",
    label: currentStatus || "Inconnu"
  };

  return (
    <div className="relative w-full ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all hover:shadow-sm ${safeConfig.color}`}
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          {safeConfig.label}
        </div>
        <ChevronDown size={14} className={`transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
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
                {config[option].label}
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
    stock: initialData.stock ?? 0, // Ensure fallback
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

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

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
        <div className="">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nom Produit</label>
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
          <label className="block text-sm font-semibold text-slate-700 mb-2">Prix (DZD)</label>
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
          <label className="block text-sm font-semibold text-slate-700 mb-2">Quantité en Stock</label>
          <div className="relative">
            <input
              type="number"
              required
              min="0"
              value={formData.stock || ''}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              placeholder="0"
            />
            <Layers className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Remise</label>
          <input
            type="number"
            value={formData.discount || ''}
            onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            Couleurs <span className="text-[10px] font-normal text-slate-400">(Saisir pour ajouter)</span>
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
          <div className="mt-2 flex flex-wrap gap-2 min-h-8">
            {formData.colors.map(c => (
              <span key={c} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md flex items-center gap-1 border border-indigo-100 uppercase">
                {c}
                <button type="button" className="hover:text-indigo-900 ml-1 p-1" onClick={() => setFormData({ ...formData, colors: formData.colors.filter(x => x !== c) })}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Tailles</label>
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
          <div className="mt-2 flex flex-wrap gap-2 min-h-8">
            {formData.available_sizes.toReversed().map(s => (
              <span key={s} className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md flex items-center gap-1 uppercase border border-slate-200">
                {s}
                <button
                  type="button"
                  className="hover:text-slate-900 ml-1 p-1"
                  onClick={() => {
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
            Images du produit {uploading && <span className="text-indigo-600 animate-pulse">(Téléchargement...)</span>}
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Cliquez pour ajouter des images</p>
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
          {formData.product_images.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto py-2">
              {formData.product_images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 shrink-0 rounded-lg border border-slate-200 overflow-hidden group">
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

      <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-8 mt-4">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] w-full"
        >
          {initialData ? 'Mettre à jour le produit' : 'Créer le produit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors w-full sm:w-auto"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}