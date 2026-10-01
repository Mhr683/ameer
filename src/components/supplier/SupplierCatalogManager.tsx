import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  DollarSign,
  Box,
  Layers,
  Search,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  Tag,
  Download,
  Upload,
  X,
  Trash2,
  Check,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { Product, ProductVariant, User } from '../../types';

interface SupplierCatalogManagerProps {
  currentUser: User;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateCost: (productId: string, newCost: number) => void;
  onToggleActive?: (productId: string) => void;
}

export const SupplierCatalogManager: React.FC<SupplierCatalogManagerProps> = ({
  currentUser,
  products,
  onAddProduct,
  onUpdateStock,
  onUpdateCost,
  onToggleActive,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvImportModal, setShowCsvImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [approvalFilter, setApprovalFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);
  const [editingCostId, setEditingCostId] = useState<string | null>(null);
  const [tempCostValue, setTempCostValue] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // New Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Consumer Electronics');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Factory Direct');
  const [warranty, setWarranty] = useState('7 Days Checking Warranty');
  const [wholesaleCost, setWholesaleCost] = useState<number>(1200);
  const [retailPrice, setRetailPrice] = useState<number>(2200);
  const [stock, setStock] = useState<number>(100);
  const [weightKg, setWeightKg] = useState<number>(0.35);
  const [description, setDescription] = useState('');
  
  // Media
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Variant Builder State (Color & Size Variants)
  const [enableVariants, setEnableVariants] = useState(false);
  const [colorInput, setColorInput] = useState('Black, Silver, Navy');
  const [sizeInput, setSizeInput] = useState('Standard, XL');
  const [generatedVariants, setGeneratedVariants] = useState<ProductVariant[]>([]);

  // Regenerate variants matrix
  const handleBuildVariants = () => {
    const colors = colorInput.split(',').map((c) => c.trim()).filter(Boolean);
    const sizes = sizeInput.split(',').map((s) => s.trim()).filter(Boolean);
    const variants: ProductVariant[] = [];

    colors.forEach((col) => {
      sizes.forEach((sz) => {
        variants.push({
          id: `var-${Date.now()}-${col}-${sz}`,
          sku: `${(sku || 'SKU').toUpperCase()}-${col.toUpperCase().slice(0, 3)}-${sz.toUpperCase().slice(0, 2)}`,
          name: `${col} / ${sz}`,
          attributes: { Color: col, Size: sz },
          stock: Math.round(stock / (colors.length * sizes.length || 1)),
          priceModifierPKR: 0,
        });
      });
    });
    setGeneratedVariants(variants);
    showToast(`Generated ${variants.length} color & size variant SKUs!`);
  };

  // Add image
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  // Submit product
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      alert('Please fill in Product Name and SKU.');
      return;
    }

    const mainImg = imageUrls[0] || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80';

    onAddProduct({
      name,
      category,
      sku: sku.toUpperCase().trim(),
      supplierId: currentUser.id,
      supplierName: currentUser.companyName || currentUser.name,
      supplierCostPKR: Number(wholesaleCost),
      recSellingPricePKR: Number(retailPrice),
      stock: Number(stock),
      isActive: true,
      brand,
      warranty,
      image: mainImg,
      images: imageUrls,
      videoUrl: videoUrl.trim() || undefined,
      weightKg: Number(weightKg),
      description: description || `${name} - Factory direct wholesale product with warranty.`,
      rating: 5.0,
      salesCount: 0,
      status: 'APPROVED', // High tier suppliers approved immediately
      colorVariants: colorInput.split(',').map((c) => c.trim()).filter(Boolean),
      variants: enableVariants && generatedVariants.length > 0 ? generatedVariants : undefined,
    });

    setShowAddModal(false);
    showToast(`Product "${name}" (${sku}) listed successfully in wholesale catalog!`);

    // Reset Form
    setName('');
    setSku('');
    setDescription('');
    setGeneratedVariants([]);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;

    // Simulated approval status
    const status = p.status || (p.salesCount && p.salesCount > 0 ? 'APPROVED' : 'APPROVED');
    const matchesApproval = 
      approvalFilter === 'ALL' ||
      (approvalFilter === 'APPROVED' && status === 'APPROVED') ||
      (approvalFilter === 'PENDING' && status === 'PENDING_MODERATION') ||
      (approvalFilter === 'REJECTED' && status === 'REJECTED');

    return matchesSearch && matchesCat && matchesApproval;
  });

  // Export Catalog CSV
  const handleExportCSV = () => {
    const headers = 'ID,Name,SKU,Category,WholesaleCostPKR,RecSellingPricePKR,Stock,Status\n';
    const rows = filteredProducts
      .map(
        (p) =>
          `"${p.id}","${p.name.replace(/"/g, '""')}","${p.sku}","${p.category}",${p.supplierCostPKR},${p.recSellingPricePKR},${p.stock},"${p.isActive ? 'ACTIVE' : 'INACTIVE'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Wholesale_Catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Wholesale catalog exported to CSV successfully!');
  };

  // Mock CSV Import parser
  const handleSimulateCSVImport = () => {
    const sampleProduct: Omit<Product, 'id'> = {
      name: 'Wireless Bluetooth RGB Gaming Headset with Mic',
      category: 'Audio & Gadgets',
      sku: `GAMING-RGB-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: currentUser.id,
      supplierName: currentUser.companyName || currentUser.name,
      supplierCostPKR: 1450,
      recSellingPricePKR: 2490,
      stock: 250,
      isActive: true,
      brand: 'ProGamer PK',
      warranty: '7 Days Check Warranty',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80'],
      rating: 4.8,
      status: 'APPROVED',
      weightKg: 0.45,
      description: 'Bulk CSV imported batch with factory warranty and sealed retail packaging.',
    };

    onAddProduct(sampleProduct);
    setShowCsvImportModal(false);
    showToast('CSV Batch Upload complete! 1 new wholesale product imported.');
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-600 text-white px-5 py-3 shadow-2xl flex items-center gap-3 border border-emerald-400 font-bold text-sm">
          <CheckCircle className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 border border-emerald-500/30">
                MODULE 2
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Product & Catalog Listing (Samaan ki Uploading)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Add new wholesale products with Color/Size Variant Builder, inline stock management (In Stock / Out of Stock toggle to prevent overselling), and Bulk CSV tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 text-xs font-bold transition cursor-pointer"
              title="Download CSV catalog"
            >
              <Download className="h-4 w-4 text-slate-400" />
              <span>Export CSV</span>
            </button>

            {/* Bulk CSV Import */}
            <button
              onClick={() => setShowCsvImportModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 px-3.5 py-2.5 text-xs font-bold transition cursor-pointer"
              title="Bulk import catalog via Excel or CSV"
            >
              <Upload className="h-4 w-4 text-purple-400" />
              <span>Bulk CSV Import</span>
            </button>

            {/* Add New Product Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-black shadow-md transition cursor-pointer"
            >
              <Plus className="h-4 w-4 fill-slate-950" />
              <span>+ Add Product (Variant Builder)</span>
            </button>
          </div>
        </div>

        {/* Filter Sub-bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Approval Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-slate-500 mr-1 font-semibold">Status:</span>
            {(['ALL', 'APPROVED', 'PENDING', 'REJECTED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setApprovalFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  approvalFilter === filter
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {filter === 'ALL'
                  ? 'All Products'
                  : filter === 'APPROVED'
                  ? 'Approved by Admin'
                  : filter === 'PENDING'
                  ? 'Pending Moderation'
                  : 'Rejected / Revision'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search SKU, Product Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Product & SKU</th>
                <th className="p-3.5">Wholesale Base Price</th>
                <th className="p-3.5">Suggested Retail</th>
                <th className="p-3.5">Stock Manager</th>
                <th className="p-3.5">Oversell Prevention</th>
                <th className="p-3.5">Approval Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
                    <Box className="h-10 w-10 mx-auto mb-2 text-slate-600 opacity-50" />
                    <p className="text-sm font-semibold">No products found matching the criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLowStock = product.stock <= 10;

                  return (
                    <tr key={product.id} className="hover:bg-slate-800/50 transition">
                      {/* Product & SKU */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop&q=80'}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate max-w-[220px]" title={product.name}>
                              {product.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[10px] bg-slate-800 text-amber-300 px-1 rounded">
                                {product.sku}
                              </span>
                              <span className="text-[10px] text-slate-400">{product.category}</span>
                              {product.colorVariants && product.colorVariants.length > 0 && (
                                <span className="text-[9px] bg-purple-900/60 text-purple-300 px-1 rounded">
                                  {product.colorVariants.length} Variants
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Wholesale Base Price with inline edit */}
                      <td className="p-3.5">
                        {editingCostId === product.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempCostValue}
                              onChange={(e) => setTempCostValue(Number(e.target.value))}
                              className="w-20 rounded bg-slate-950 border border-amber-500 px-1.5 py-0.5 text-xs text-white font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                onUpdateCost(product.id, tempCostValue);
                                setEditingCostId(null);
                                showToast(`Wholesale price updated to PKR ${tempCostValue.toLocaleString()}`);
                              }}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setEditingCostId(null)}
                              className="p-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => {
                              setEditingCostId(product.id);
                              setTempCostValue(product.supplierCostPKR);
                            }}
                            className="cursor-pointer group flex items-center gap-1"
                            title="Click to edit Wholesale Cost"
                          >
                            <span className="font-mono font-bold text-emerald-400 text-sm">
                              PKR {product.supplierCostPKR.toLocaleString()}
                            </span>
                            <Edit2 className="h-3 w-3 text-slate-600 opacity-0 group-hover:opacity-100 transition" />
                          </div>
                        )}
                      </td>

                      {/* Suggested Retail */}
                      <td className="p-3.5 font-mono text-slate-300">
                        PKR {product.recSellingPricePKR.toLocaleString()}
                      </td>

                      {/* Stock Manager (Direct number & +50 quick increment) */}
                      <td className="p-3.5">
                        {editingStockId === product.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempStockValue}
                              onChange={(e) => setTempStockValue(Number(e.target.value))}
                              className="w-16 rounded bg-slate-950 border border-amber-500 px-1.5 py-0.5 text-xs text-white font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                onUpdateStock(product.id, tempStockValue);
                                setEditingStockId(null);
                                showToast(`Stock for ${product.sku} updated to ${tempStockValue} units!`);
                              }}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="p-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div 
                              onClick={() => {
                                setEditingStockId(product.id);
                                setTempStockValue(product.stock);
                              }}
                              className="cursor-pointer group flex items-center gap-1"
                              title="Click to edit stock level directly"
                            >
                              <span className={`font-mono font-black text-sm ${
                                product.stock === 0
                                  ? 'text-rose-400'
                                  : isLowStock
                                  ? 'text-amber-400'
                                  : 'text-white'
                              }`}>
                                {product.stock}
                              </span>
                              <span className="text-[10px] text-slate-500">units</span>
                              <Edit2 className="h-3 w-3 text-slate-600 opacity-0 group-hover:opacity-100 transition" />
                            </div>

                            {/* +50 Quick Add Button */}
                            <button
                              onClick={() => {
                                onUpdateStock(product.id, product.stock + 50);
                                showToast(`Added +50 units to ${product.sku}! Total: ${product.stock + 50}`);
                              }}
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 transition"
                              title="Add +50 Units to Warehouse"
                            >
                              +50
                            </button>

                            {isLowStock && product.stock > 0 && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                                Low Stock
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* In Stock / Out of Stock Switch to prevent overselling */}
                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            if (onToggleActive) {
                              onToggleActive(product.id);
                            } else {
                              // If no toggle prop, set stock to 0 or restore
                              const newStock = product.stock > 0 ? 0 : 50;
                              onUpdateStock(product.id, newStock);
                            }
                            showToast(
                              product.isActive && product.stock > 0
                                ? `Marked ${product.sku} OUT OF STOCK (Overselling blocked)`
                                : `Marked ${product.sku} IN STOCK (Available on marketplace)`
                            );
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                            product.isActive && product.stock > 0
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${product.isActive && product.stock > 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{product.isActive && product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Approval Status */}
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          <span>Approved by Admin</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setEditingStockId(product.id);
                            setTempStockValue(product.stock);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] transition"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal with Variant Builder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">Add New Wholesale Product (Variant Builder)</h3>
                <p className="text-xs text-slate-400">List factory direct inventory with size/color variants and suggested retail margins.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
              {/* Row 1: Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-300">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vintage T9 Professional Hair & Beard Trimmer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Warehouse SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. T9-TRIMMER-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white font-mono uppercase focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Category, Brand, Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option>Consumer Electronics</option>
                    <option>Home & Kitchen Essentials</option>
                    <option>Fashion & Apparel</option>
                    <option>Personal Care & Health</option>
                    <option>Audio & Gadgets</option>
                    <option>Baby & Toys</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Weight (Kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <label className="font-bold text-emerald-400">Wholesale Base Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={wholesaleCost}
                    onChange={(e) => setWholesaleCost(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-emerald-500/50 px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Your wholesale net payout per unit</div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Suggested Retail (PKR)</label>
                  <input
                    type="number"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white font-mono focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Recommended dropship price</div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-amber-400">Available Stock (Units) *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-amber-500/50 px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-500">Instant warehouse inventory</div>
                </div>
              </div>

              {/* Variant Builder Toggle & Inputs */}
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-400" />
                    <span className="font-bold text-purple-200">Color & Size Variant Builder</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableVariants}
                      onChange={(e) => setEnableVariants(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-0"
                    />
                    <span className="text-[11px] text-purple-300 font-semibold">Enable Variants</span>
                  </label>
                </div>

                {enableVariants && (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-semibold">Color Variants (comma-separated)</label>
                        <input
                          type="text"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          placeholder="Black, Silver, Navy"
                          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 font-semibold">Size Variants (comma-separated)</label>
                        <input
                          type="text"
                          value={sizeInput}
                          onChange={(e) => setSizeInput(e.target.value)}
                          placeholder="Standard, M, L, XL"
                          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleBuildVariants}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition cursor-pointer"
                    >
                      Generate Variant SKUs Matrix
                    </button>

                    {generatedVariants.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {generatedVariants.map((v) => (
                          <span key={v.id} className="bg-slate-800 text-purple-200 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-mono">
                            {v.sku} ({v.name})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Image URLs Gallery */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300">Product Image URLs (Multi-Image Gallery)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold"
                  >
                    + Add Image
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt="Uploaded preview" className="h-12 w-12 rounded-lg object-cover border border-slate-700" />
                      <button
                        type="button"
                        onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                >
                  Confirm & List Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Bulk Excel / CSV Catalog Import</h3>
              <button
                onClick={() => setShowCsvImportModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Upload a CSV file containing your complete warehouse catalog. Standard columns:
              <br />
              <code className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded text-[11px] block mt-1">
                Title, SKU, Category, WholesalePrice, SuggestedPrice, Stock, Weight
              </code>
            </p>

            <div className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-6 text-center cursor-pointer transition">
              <Upload className="h-8 w-8 mx-auto text-purple-400 mb-2" />
              <span className="text-xs font-bold text-white block">Click to select CSV File</span>
              <span className="text-[10px] text-slate-500">Supports .csv and .xlsx up to 10MB</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const sampleCsv = 'Title,SKU,Category,WholesalePrice,SuggestedPrice,Stock,Weight\nSample Gaming Mouse,MOUSE-RGB-01,Audio & Gadgets,1200,2100,100,0.25';
                  const blob = new Blob([sampleCsv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'catalog_sample_template.csv';
                  a.click();
                }}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                Download Sample Template
              </button>

              <button
                onClick={handleSimulateCSVImport}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Import Sample Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
