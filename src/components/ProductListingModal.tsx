import React, { useState } from 'react';
import {
  X,
  PackagePlus,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Play,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Store,
  Tag,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { Product, Store as AppStore, User } from '../types';
import { AiProductAssetStudioModal } from './AiProductAssetStudioModal';

interface ProductListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  stores?: AppStore[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

export const CATEGORIES_LIST = [
  'Consumer Electronics & Mobile Gadgets',
  'Fashion & Apparel',
  'Home & Kitchen Essentials',
  'Personal Care & Health',
  'Packaging & Supplies',
  'Automotive & Mobile Accessories',
  'Watches & Fashion Jewelry',
  'Baby Care & Toys',
];

export const ProductListingModal: React.FC<ProductListingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  stores = [],
  onAddProduct,
}) => {
  // Form State
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(CATEGORIES_LIST[0]);
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [brand, setBrand] = useState('');
  const [warranty, setWarranty] = useState('7 Days Replacement Guarantee');
  const [supplierCostPKR, setSupplierCostPKR] = useState<number>(650);
  const [recSellingPricePKR, setRecSellingPricePKR] = useState<number>(1150);
  const [stock, setStock] = useState<number>(150);
  const [weightKg, setWeightKg] = useState<number>(0.35);
  const [moq, setMoq] = useState<number>(1);

  // Media: Images
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Media: Optional Video
  const [hasVideo, setHasVideo] = useState<boolean>(true);
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [showVideoPreview, setShowVideoPreview] = useState<boolean>(false);

  // Specifications
  const [highlights, setHighlights] = useState<string>(
    'Premium ergonomic build quality\nFast dispatch packaging\nHigh customer repeat demand'
  );
  const [whatsInTheBox, setWhatsInTheBox] = useState('1x Main Product Unit, 1x User Manual');
  const [description, setDescription] = useState('');
  const [colorVariants, setColorVariants] = useState('Standard, Black, Silver');

  // Associated Store
  const userStore = stores.find((s) => s.ownerId === currentUser.id) || stores[0];
  const [selectedStoreId, setSelectedStoreId] = useState<string>(userStore ? userStore.id : 'store-oshi');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    if (imageUrls.length <= 1) {
      setErrorMessage('Kam az kam 1 image hona zaroori hai.');
      return;
    }
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setErrorMessage('Product ka title / name darj karein.');
      return;
    }
    if (supplierCostPKR <= 0) {
      setErrorMessage('Durust wholesale / factory purchase cost enter karein.');
      return;
    }
    if (recSellingPricePKR <= supplierCostPKR) {
      setErrorMessage('Retail price factory cost se zyada honi chahiye taake munafa ho.');
      return;
    }
    if (imageUrls.length === 0) {
      setErrorMessage('Kam az kam 1 product image zaroori hai.');
      return;
    }

    const assignedStore = stores.find((s) => s.id === selectedStoreId) || userStore || stores[0];

    const highlightsArray = highlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const variantsArray = colorVariants
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const newProductData: Omit<Product, 'id'> = {
      name: productName.trim(),
      category,
      sku: sku.trim() || `SKU-${Date.now()}`,
      supplierId: currentUser.id,
      supplierName: assignedStore ? assignedStore.name : currentUser.companyName || currentUser.name,
      supplierCostPKR: Number(supplierCostPKR),
      recSellingPricePKR: Number(recSellingPricePKR),
      stock: Number(stock) || 50,
      image: imageUrls[0],
      images: imageUrls,
      videoUrl: hasVideo && videoUrl.trim() ? videoUrl.trim() : undefined,
      isActive: true,
      brand: brand.trim() || 'Direct Factory Import',
      warranty: warranty.trim() || '7 Days Replacement Warranty',
      highlights: highlightsArray,
      whatsInTheBox: whatsInTheBox.trim(),
      weightKg: Number(weightKg) || 0.3,
      description:
        description.trim() ||
        `${productName} - Wholesale product directly dispatched from verified warehouse with express delivery.`,
      rating: 4.9,
      salesCount: 1,
      isTrending: true,
      tags: ['New Arrival', 'Factory Direct'],
      moq: Number(moq) || 1,
      colorVariants: variantsArray,
      // Store Ratings
      storeId: assignedStore ? assignedStore.id : 'store-oshi',
      storeName: assignedStore ? assignedStore.name : 'Verified Manufacturer Hub',
      storeRating: assignedStore ? assignedStore.rating : 4.9,
      deliveryRating: assignedStore ? assignedStore.deliveryRating : '⚡ 2-3 Days Fast Delivery (98% On-Time)',
      reviewsCount: 12,
    };

    onAddProduct(newProductData);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="product-listing-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-3xl border border-orange-500/40 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow">
              <PackagePlus className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold text-orange-300 border border-orange-500/40 uppercase tracking-wider">
                  Wholesale & Retail Listing Engine
                </span>
                <span className="text-[11px] text-slate-400">Video + Multi-Images Supported</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                List New Product (Video & Images)
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {isSuccess && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs text-emerald-200 flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <div className="font-bold text-sm">
                Product Kamyabi se List Ho Gaya Hai! Store aur Catalog mein live add kar diya gaya hai.
              </div>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3.5">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>1. Basic Product Specifications</span>
            </h3>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Product Title / Heading *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Wireless Noise-Cancelling Bluetooth Earbuds Pro 5.3"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Category, SKU & Brand Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU-8821"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Brand / Manufacturer</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apex Audio PK"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Associated Store */}
            {stores.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-orange-400" />
                  <span>Assign to Store / Vendor Front:</span>
                </label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city}) - Rating: {s.rating} ★
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section 2: Pricing, Stock & Courier Dimensions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3.5">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5" />
              <span>2. Wholesale Pricing, Margin & Stock</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-orange-400">
                  Wholesale / Factory Cost (PKR) *
                </label>
                <input
                  type="number"
                  min="10"
                  required
                  value={supplierCostPKR}
                  onChange={(e) => setSupplierCostPKR(Number(e.target.value))}
                  className="w-full rounded-xl border border-orange-500/50 bg-slate-900 px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-400">
                  Suggested Retail Price (PKR) *
                </label>
                <input
                  type="number"
                  min="20"
                  required
                  value={recSellingPricePKR}
                  onChange={(e) => setRecSellingPricePKR(Number(e.target.value))}
                  className="w-full rounded-xl border border-emerald-500/50 bg-slate-900 px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Available Stock</label>
                <input
                  type="number"
                  min="1"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Weight (KG)</label>
                <input
                  type="number"
                  step="0.05"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Profit Margin Preview Bar */}
            <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Estimated Reseller Profit Margin per Sale:</span>
              <span className="font-mono font-bold text-emerald-400">
                PKR {(recSellingPricePKR - supplierCostPKR).toLocaleString()} (
                {supplierCostPKR > 0
                  ? (((recSellingPricePKR - supplierCostPKR) / supplierCostPKR) * 100).toFixed(0)
                  : 0}
                % Markup)
              </span>
            </div>
          </div>

          {/* Section 3: Multi-Images Upload & Gallery */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                <span>3. Product Images Gallery (Multi-Photos)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">{imageUrls.length} Photos Added</span>
            </div>

            {/* AI Studio Banner */}
            <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/50 via-slate-900 to-indigo-950/40 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Tasveer ya Video nahi hai?</div>
                  <div className="text-[10px] text-violet-300">
                    AI se 5 mukhtalif angles (Front, 45°, Lifestyle, Macro, Unboxing) aur TikTok Video Reel banwayein (Zero Copyright).
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiStudioOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Photo & Video Studio Kholein</span>
              </button>
            </div>

            {/* Image URL Input */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Image URL (Unsplash, CDN, or Direct Image Link)..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Photo</span>
              </button>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              {imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-xl border border-slate-700 bg-slate-900 overflow-hidden"
                >
                  <img src={url} alt={`product-${idx}`} className="h-full w-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-600 text-[9px] font-bold text-white px-1.5 py-0.2 rounded">
                      Main Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Product Video (OPTIONAL AS REQUESTED) */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <Video className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    4. Product Video (Optional / Ikhtiyari)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Video boosts sales conversion by 300% on Daraz & Social Media
                  </span>
                </div>
              </div>

              {/* Toggle Video On/Off */}
              <button
                type="button"
                onClick={() => setHasVideo(!hasVideo)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition border ${
                  hasVideo
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {hasVideo ? 'Video Included ✓' : 'No Video'}
              </button>
            </div>

            {hasVideo && (
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Product Video URL (MP4, Cloud Video, CDN or Direct Stream)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://example.com/product-video.mp4"
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowVideoPreview(!showVideoPreview)}
                      className="flex items-center gap-1.5 rounded-xl bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600 text-purple-200 hover:text-white px-3.5 py-2 text-xs font-bold transition"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>{showVideoPreview ? 'Hide Video Player' : 'Preview Video Player'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Embedded Video Player Preview */}
                {showVideoPreview && videoUrl && (
                  <div className="rounded-2xl border border-purple-500/40 bg-black/90 p-3 overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between pb-2 text-xs text-purple-300 font-semibold border-b border-purple-900/50">
                      <span>Live Video Player Preview</span>
                      <span className="text-[10px] text-slate-400 font-mono">{videoUrl}</span>
                    </div>
                    <div className="aspect-video w-full rounded-xl overflow-hidden mt-2 bg-slate-950 flex items-center justify-center">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full max-h-56 object-contain"
                        preload="metadata"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 5: Highlights & What's in the Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-amber-400" />
              <span>5. Daraz Bullet Highlights & Package Details</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Key Highlights (1 per line for Daraz & Shopify description)
              </label>
              <textarea
                rows={3}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="High battery backup&#10;Pure silicone construction&#10;Original sealed box"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">What's In The Box</label>
                <input
                  type="text"
                  value={whatsInTheBox}
                  onChange={(e) => setWhatsInTheBox(e.target.value)}
                  placeholder="1x Earbuds, 1x Charging Case, 1x Cable"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Color Variants (Comma separated)</label>
                <input
                  type="text"
                  value={colorVariants}
                  onChange={(e) => setColorVariants(e.target.value)}
                  placeholder="Black, White, Blue"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black px-6 py-2.5 text-xs transition shadow-lg shadow-orange-950 cursor-pointer"
            >
              <PackagePlus className="h-4 w-4" />
              <span>Publish & List Product Live</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Product Asset Studio Modal */}
      <AiProductAssetStudioModal
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        initialProductName={productName || 'Smart Wholesale Product'}
        initialCategory={category}
        onApplyToProduct={(assets) => {
          if (assets.images && assets.images.length > 0) {
            setImageUrls(assets.images);
          }
          if (assets.videoUrl) {
            setHasVideo(true);
            setVideoUrl(assets.videoUrl);
          }
          if (assets.title) setProductName(assets.title);
          if (assets.description) setDescription(assets.description);
          if (assets.highlights) setHighlights(assets.highlights);
        }}
      />
    </div>
  );
};
