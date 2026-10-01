import React, { useState, useRef } from 'react';
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Boxes,
  ArrowRight,
  Sparkles,
  Layers,
  Store as StoreIcon,
  Check,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, Store as AppStore, User } from '../types';
import { AiProductAssetStudioModal } from './AiProductAssetStudioModal';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  stores?: AppStore[];
  onImportSuccess: (newProducts: Product[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  stores = [],
  onImportSuccess,
}) => {
  const [importStatus, setImportStatus] = useState<'IDLE' | 'PARSING' | 'SUCCESS'>('IDLE');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedRowForStudio, setSelectedRowForStudio] = useState<any | null>(null);
  const [aiSuccessToast, setAiSuccessToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAutoFillAiImages = () => {
    const updated = parsedRows.map((row) => {
      const q = (row.name || '').toLowerCase();
      let matchedImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
      if (q.includes('trimmer') || q.includes('hair') || q.includes('shav')) {
        matchedImg = 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80';
      } else if (q.includes('cook') || q.includes('kitchen') || q.includes('press') || q.includes('samosa')) {
        matchedImg = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80';
      } else if (q.includes('earbud') || q.includes('headphone') || q.includes('audio')) {
        matchedImg = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80';
      } else if (q.includes('boxer') || q.includes('shirt') || q.includes('cloth')) {
        matchedImg = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80';
      }

      return {
        ...row,
        image: matchedImg,
        videoUrl: row.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        aiGenerated: true,
      };
    });

    setParsedRows(updated);
    setAiSuccessToast('✨ AI Studio: All CSV items auto-filled with copyright-free multi-angle photos & video ads!');
    setTimeout(() => setAiSuccessToast(null), 3500);
  };

  if (!isOpen) return null;

  const sampleCsvContent = `Product Name,SKU,Category,Wholesale Cost PKR,Retail Price PKR,Stock,Weight KG,Image URL,Video URL
Wireless Noise Cancelling Earbuds,SKU-EAR-99,Consumer Electronics & Mobile Gadgets,1250,2299,150,0.25,https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80,https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
Pack of 3 Cotton Summer Boxer Shorts,SKU-BOX-03,Fashion & Apparel,650,1199,220,0.3,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80,
Stainless Steel Garlic Press Crusher,SKU-GAR-01,Home & Kitchen Essentials,280,699,350,0.18,https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80,
Magnetic Dashboard Car Phone Holder,SKU-CAR-M4,Automotive & Mobile Accessories,390,899,180,0.12,https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80,`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'yourmart_bulk_products_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setErrorMessage('');
    setImportStatus('PARSING');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);

        if (lines.length <= 1) {
          setErrorMessage('CSV file mein koi product data nahi mila.');
          setImportStatus('IDLE');
          return;
        }

        // Parse CSV lines
        const dataRows: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim());
          if (cols.length >= 3 && cols[0]) {
            dataRows.push({
              name: cols[0],
              sku: cols[1] || `SKU-${Date.now()}-${i}`,
              category: cols[2] || 'Consumer Electronics & Mobile Gadgets',
              cost: Number(cols[3]) || 500,
              price: Number(cols[4]) || 950,
              stock: Number(cols[5]) || 100,
              weight: Number(cols[6]) || 0.3,
              image:
                cols[7] ||
                'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
              videoUrl: cols[8] || '',
            });
          }
        }

        if (dataRows.length === 0) {
          setErrorMessage('CSV parse nahi ho saki. Baraye meherbani sample template use karein.');
          setImportStatus('IDLE');
        } else {
          setParsedRows(dataRows);
          setImportStatus('SUCCESS');
        }
      } catch (err) {
        setErrorMessage('File read karne mein masla hua. Standard CSV format use karein.');
        setImportStatus('IDLE');
      }
    };
    reader.readAsText(file);
  };

  const handleSimulateDemo = () => {
    setFileName('demo_factory_wholesale_inventory.csv');
    setImportStatus('PARSING');
    setTimeout(() => {
      setParsedRows([
        {
          name: 'Fast Wireless Magnetic PowerBank 10000mAh',
          sku: 'SKU-PB-10K',
          category: 'Consumer Electronics & Mobile Gadgets',
          cost: 1450,
          price: 2650,
          stock: 120,
          weight: 0.35,
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        },
        {
          name: 'Kitchen Ultra-Sharp Ceramic Knife Set (6 Pcs)',
          sku: 'SKU-CK-6PC',
          category: 'Home & Kitchen Essentials',
          cost: 890,
          price: 1750,
          stock: 85,
          weight: 0.65,
          image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80',
          videoUrl: '',
        },
        {
          name: 'Summer Casual Sports Jogger Track Pants',
          sku: 'SKU-JG-TRK',
          category: 'Fashion & Apparel',
          cost: 620,
          price: 1190,
          stock: 200,
          weight: 0.4,
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        },
        {
          name: '12 Inches Courier Flyer Bags with Pocket (100 Pcs)',
          sku: 'SKU-FLY-12IN',
          category: 'Packaging & Supplies',
          cost: 750,
          price: 1250,
          stock: 300,
          weight: 0.9,
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80',
          videoUrl: '',
        },
      ]);
      setImportStatus('SUCCESS');
    }, 800);
  };

  const handleCommit = () => {
    if (parsedRows.length === 0) return;

    const assignedStore = stores.find((s) => s.ownerId === currentUser.id) || stores[0];

    const newProducts: Product[] = parsedRows.map((r, i) => ({
      id: `prod-bulk-${Date.now()}-${i}`,
      name: r.name,
      sku: r.sku,
      category: r.category,
      supplierId: currentUser.id,
      supplierName: assignedStore ? assignedStore.name : currentUser.companyName || currentUser.name,
      supplierCostPKR: r.cost,
      recSellingPricePKR: r.price,
      stock: r.stock,
      isActive: true,
      image: r.image,
      images: [r.image],
      videoUrl: r.videoUrl ? r.videoUrl : undefined,
      brand: 'Direct Factory Import',
      warranty: '7 Days Check Warranty',
      weightKg: r.weight || 0.3,
      description: `${r.name} - Factory wholesale product available for instant COD dispatch.`,
      rating: 4.8,
      salesCount: 15,
      isTrending: true,
      tags: ['Bulk Import', 'Wholesale'],
      moq: 1,
      // Store Ratings
      storeId: assignedStore ? assignedStore.id : 'store-oshi',
      storeName: assignedStore ? assignedStore.name : 'Oshi Logistics & Direct Sourcing',
      storeRating: assignedStore ? assignedStore.rating : 4.9,
      deliveryRating: assignedStore ? assignedStore.deliveryRating : '⚡ 2-3 Days Fast Delivery (98% On-Time)',
      reviewsCount: 24,
    }));

    onImportSuccess(newProducts);
    onClose();
  };

  return (
    <div
      id="bulk-import-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-3xl border border-emerald-500/40 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  Bulk Catalog Onboarding
                </span>
                <span className="text-[11px] text-slate-400">CSV & Excel Support</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Bulk Product Import (CSV)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSample}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition"
              title="Download pre-formatted CSV template"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Sample CSV Template</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Upload Area */}
          <div className="rounded-3xl border-2 border-dashed border-slate-700 bg-slate-950/80 p-6 sm:p-8 text-center space-y-3 hover:border-emerald-500/50 transition">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Upload className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">CSV File Drag & Drop Karein ya Select Karein</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Product Name, SKU, Category, Wholesale Cost, Retail Price, Images aur Video URLs include karein.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 text-xs transition shadow-lg cursor-pointer"
              >
                Browse CSV File
              </button>

              <button
                type="button"
                onClick={handleSimulateDemo}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold px-4 py-2 text-xs transition"
              >
                Load Demo Products CSV
              </button>

              <button
                type="button"
                onClick={handleDownloadSample}
                className="sm:hidden rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold px-3 py-2 text-xs"
              >
                Download Sample
              </button>
            </div>

            {fileName && (
              <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs text-emerald-400 font-mono">
                Selected: {fileName}
              </span>
            )}
          </div>

          {/* Parsed Rows Preview */}
          {parsedRows.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Validated Products Ready to Publish ({parsedRows.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Tamam products automatically aapke store aur wholesale catalog mein live ho jayenge.
                  </span>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-xs font-bold font-mono">
                  <Check className="h-3 w-3" />
                  <span>Syntax Validated</span>
                </span>
              </div>

              {/* AI Auto Fill Banner */}
              <div className="rounded-xl border border-violet-500/40 bg-violet-950/40 p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400 shrink-0" />
                  <span className="text-xs text-slate-300">
                    Agar CSV me tasweerain na hon to AI se <strong>5 Multi-Angle Photos aur Video Ads</strong> auto-generate karwayein.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillAiImages}
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition cursor-pointer shadow flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Multi-Angle Auto-Fill</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-[10px] uppercase font-bold text-slate-400 sticky top-0">
                    <tr>
                      <th className="p-2.5">Product Title</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5">Wholesale Cost</th>
                      <th className="p-2.5">Retail Price</th>
                      <th className="p-2.5">Stock</th>
                      <th className="p-2.5">Media</th>
                      <th className="p-2.5 text-right">AI Studio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {parsedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-bold text-white max-w-[200px] truncate">
                          {row.name}
                        </td>
                        <td className="p-2.5 font-mono text-slate-400">{row.sku}</td>
                        <td className="p-2.5 font-mono text-orange-400 font-bold">
                          PKR {row.cost.toLocaleString()}
                        </td>
                        <td className="p-2.5 font-mono text-emerald-400 font-bold">
                          PKR {row.price.toLocaleString()}
                        </td>
                        <td className="p-2.5 font-bold text-slate-200">{row.stock}</td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <img src={row.image} alt="" className="h-6 w-6 rounded object-cover border border-slate-700" />
                            {row.videoUrl ? (
                              <Video className="h-3.5 w-3.5 text-purple-400" />
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </div>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedRowForStudio(row)}
                            className="px-2 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/40 text-[10px] font-bold transition cursor-pointer inline-flex items-center gap-1"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>AI Studio</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={parsedRows.length === 0}
              onClick={handleCommit}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-black px-6 py-2.5 text-xs transition shadow-lg shadow-emerald-950 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Import All {parsedRows.length} Products to Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Asset Studio Modal for Specific Row */}
      {selectedRowForStudio && (
        <AiProductAssetStudioModal
          isOpen={!!selectedRowForStudio}
          onClose={() => setSelectedRowForStudio(null)}
          initialProductName={selectedRowForStudio.name}
          initialCategory={selectedRowForStudio.category}
          onApplyToProduct={(assets) => {
            if (assets.images && assets.images.length > 0) {
              setParsedRows((prev) =>
                prev.map((r) =>
                  r.sku === selectedRowForStudio.sku
                    ? {
                        ...r,
                        image: assets.images[0],
                        videoUrl: assets.videoUrl || r.videoUrl,
                        name: assets.title || r.name,
                      }
                    : r
                )
              );
            }
            setSelectedRowForStudio(null);
          }}
        />
      )}
    </div>
  );
};
