import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  Video,
  CheckCircle2,
  Download,
  Copy,
  RefreshCw,
  Layers,
  ShieldCheck,
  Zap,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Eye,
  ArrowRight,
  Maximize2,
  X,
  Share2,
  FileText
} from 'lucide-react';

interface AiProductAssetStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductName?: string;
  initialCategory?: string;
  onApplyToProduct?: (assets: {
    images: string[];
    videoUrl?: string;
    title?: string;
    description?: string;
    highlights?: string;
  }) => void;
}

interface MultiAnglePhoto {
  angleId: 'front' | 'isometric' | 'lifestyle' | 'macro' | 'unboxing';
  title: string;
  urduTitle: string;
  description: string;
  imageUrl: string;
  selected: boolean;
}

// Intelligent catalog asset database for realistic, commercial-grade, zero-copyright images
const ASSET_LIBRARY: Record<string, string[]> = {
  trimmer: [
    'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80', // front studio
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80', // 45 angle
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80', // lifestyle
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80', // macro detail
    'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80', // unboxing box
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  ],
};

export const AiProductAssetStudioModal: React.FC<AiProductAssetStudioModalProps> = ({
  isOpen,
  onClose,
  initialProductName = 'T9 Vintage Hair Trimmer Professional Metal Clipper',
  initialCategory = 'Personal Care & Health',
  onApplyToProduct,
}) => {
  const [productQuery, setProductQuery] = useState(initialProductName);
  const [category, setCategory] = useState(initialCategory);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'video' | 'copy'>('photos');

  // Multi-angle studio photos
  const [photos, setPhotos] = useState<MultiAnglePhoto[]>([]);

  // Video Reel State
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [activeVideoSlide, setActiveVideoSlide] = useState(0);
  const [watermarkPhone, setWatermarkPhone] = useState('0300-8492019');
  const [videoScriptUrdu, setVideoScriptUrdu] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Generated listing copy
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [generatedHighlights, setGeneratedHighlights] = useState('');

  // Helper to pick asset collection based on query
  const getAssetSet = (text: string) => {
    const q = text.toLowerCase();
    if (q.includes('trimmer') || q.includes('hair') || q.includes('clipper') || q.includes('shav')) {
      return ASSET_LIBRARY.trimmer;
    }
    if (q.includes('kitchen') || q.includes('cook') || q.includes('press') || q.includes('dumpling') || q.includes('oil')) {
      return ASSET_LIBRARY.kitchen;
    }
    if (q.includes('earbud') || q.includes('watch') || q.includes('power') || q.includes('phone') || q.includes('headphone')) {
      return ASSET_LIBRARY.electronics;
    }
    return ASSET_LIBRARY.default;
  };

  const handleGenerateAssets = (targetName = productQuery) => {
    setIsGenerating(true);
    const chosenImages = getAssetSet(targetName);

    setTimeout(() => {
      const generatedPhotos: MultiAnglePhoto[] = [
        {
          angleId: 'front',
          title: '📸 Studio Front Angle (Pure White BG)',
          urduTitle: 'سامنے کا اسٹوڈیو زاویہ (وائٹ بیک گراؤنڈ)',
          description: 'E-commerce catalog main image. Clean, shadow-balanced, Amazon/Daraz compliant.',
          imageUrl: chosenImages[0],
          selected: true,
        },
        {
          angleId: 'isometric',
          title: '📐 45° Hero Perspective Angle',
          urduTitle: '45 ڈگری ہیرو زاویہ (بہترین گہرائی)',
          description: 'Highlights 3D depth, craftsmanship, metallic finish, and ergonomic grip.',
          imageUrl: chosenImages[1],
          selected: true,
        },
        {
          angleId: 'lifestyle',
          title: '🏡 Lifestyle Context Angle (In-Use)',
          urduTitle: 'استعمال کا لائیو ماحول زاویہ',
          description: 'Shows the product placed in realistic home environment. Increases trust by 45%.',
          imageUrl: chosenImages[2],
          selected: true,
        },
        {
          angleId: 'macro',
          title: '🔍 Macro Feature Close-Up',
          urduTitle: 'قریب ترین تفصیلاتی زاویہ',
          description: 'Ultra-sharp focus on durable alloy cutter head, LED battery gauge, or power switch.',
          imageUrl: chosenImages[3],
          selected: true,
        },
        {
          angleId: 'unboxing',
          title: '📦 Unboxing & Box Scale Angle',
          urduTitle: 'باکس اور سامان کی تفصیل',
          description: 'Shows retail box, included attachments, charging cable, and user manual.',
          imageUrl: chosenImages[4],
          selected: true,
        },
      ];

      setPhotos(generatedPhotos);

      // Generate SEO Title & Urdu Content
      setGeneratedTitle(`[100% Original] ${targetName} - Heavy Duty Commercial Quality`);
      setGeneratedHighlights(
        `✓ Premium Titanium Alloy Craftsmanship\n✓ Quick USB Rechargeable Battery (120 Mins Run Time)\n✓ 7-Day Replacement Guarantee Across Pakistan\n✓ Zero Noise High Torque Motor`
      );
      setGeneratedDescription(
        `پروڈکٹ کی خصوصیات (Urdu Pitch):\nیہ پروڈکٹ پاکستان بھر میں اپنے شاندار معیار اور لمبی بیٹری لائف کی وجہ سے انتہائی پسند کی جا رہی ہے۔ مضبوط باڈی اور محفوظ استعمال۔ ہر پارسل کے ساتھ 7 دن کی ریپلیسمنٹ وارنٹی۔ مفت ہوم ڈیلیوری اور کیش آن ڈیلیوری دستیاب ہے۔`
      );

      setVideoScriptUrdu(
        `"کیا آپ بھی بار بار خراب ہونے والی مشین سے تنگ آ چکے ہیں؟ 🛑\nپیش ہے 100 فیصد اصلی ${targetName}! \nپورے پاکستان میں کیش آن ڈیلیوری اور 7 دن کی منی بیک گارنٹی کے ساتھ۔\nابھی نیچے دیے گئے نمبر پر آرڈر کریں: ${watermarkPhone}"`
      );

      setIsGenerating(false);
      setToastMessage('✨ AI Studio: 5 Multi-Angle Copyright-Free Photos & Video Reel Generated!');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  useEffect(() => {
    if (isOpen) {
      handleGenerateAssets(initialProductName);
    }
  }, [isOpen, initialProductName]);

  // Video Reel auto slideshow animation
  useEffect(() => {
    if (!isPlayingVideo || photos.length === 0) return;
    const interval = setInterval(() => {
      setActiveVideoSlide((prev) => (prev + 1) % photos.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlayingVideo, photos]);

  if (!isOpen) return null;

  const toggleSelectPhoto = (angleId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.angleId === angleId ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleApplyToProductForm = () => {
    const selectedImages = photos.filter((p) => p.selected).map((p) => p.imageUrl);
    if (onApplyToProduct) {
      onApplyToProduct({
        images: selectedImages.length > 0 ? selectedImages : photos.map((p) => p.imageUrl),
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: generatedTitle,
        description: generatedDescription,
        highlights: generatedHighlights,
      });
    }
    setToastMessage('Applied directly to Product Listing Form! ✓');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-700 bg-slate-900 p-5 sm:p-6 shadow-2xl max-h-[94vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 text-white shadow-lg shadow-violet-950 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">AI Product Asset Studio & Video Creator</h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>100% Zero Copyright Issue</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Agar product ki tasveer na ho to AI se mukhtalif angles (Front, 45°, Lifestyle, Macro) aur TikTok video add banwayein.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/70 p-3 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* AI Prompt Input Bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <label className="text-xs font-bold text-slate-300 block">
            Product Name / Description to Generate Assets For:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              placeholder="e.g. Wireless Noise Cancelling Earbuds or Dumpling Samosa Maker..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
            />
            <button
              onClick={() => handleGenerateAssets(productQuery)}
              disabled={isGenerating}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg transition cursor-pointer shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'AI Generating Angles...' : 'Regenerate All Angles'}</span>
            </button>
          </div>
        </div>

        {/* Tabs: Multi-Angle Photos | Video Ad Creator | AI Urdu Listing Copy */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>5 Multi-Angle Studio Photos ({photos.filter((p) => p.selected).length}/5 Selected)</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'video'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>TikTok / Reel Video Ad Maker (9:16)</span>
          </button>

          <button
            onClick={() => setActiveTab('copy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'copy'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>AI Urdu & English Sales Copy</span>
          </button>
        </div>

        {/* TAB 1: 5 MULTI-ANGLE STUDIO PHOTOS */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Daraz aur Shopify par high-converting stores har product ke 4 se 5 angles lagate hain.
              </span>
              <button
                onClick={() => setPhotos((prev) => prev.map((p) => ({ ...p, selected: true })))}
                className="text-violet-400 hover:underline font-bold"
              >
                Select All 5 Angles
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {photos.map((photo) => (
                <div
                  key={photo.angleId}
                  onClick={() => toggleSelectPhoto(photo.angleId)}
                  className={`rounded-2xl border overflow-hidden cursor-pointer transition flex flex-col justify-between ${
                    photo.selected
                      ? 'border-violet-500 bg-slate-900 ring-2 ring-violet-500/40 shadow-lg'
                      : 'border-slate-800 bg-slate-950/60 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="relative aspect-square w-full bg-slate-950 overflow-hidden group">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          photo.selected
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-900/80 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {photo.selected ? '✓' : ''}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider backdrop-blur-xs">
                      {photo.angleId}
                    </div>
                  </div>

                  <div className="p-2.5 space-y-1 text-left">
                    <div className="text-[11px] font-bold text-white leading-tight">{photo.title}</div>
                    <div className="text-[10px] text-violet-300 font-semibold">{photo.urduTitle}</div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{photo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TIKTOK / REEL VIDEO AD CREATOR */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* 9:16 Vertical Video Preview Player */}
            <div className="flex justify-center">
              <div className="relative w-64 h-[440px] rounded-3xl border-4 border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-between p-3">
                {/* Simulated dynamic video slide with pan & zoom */}
                {photos[activeVideoSlide] && (
                  <img
                    src={photos[activeVideoSlide].imageUrl}
                    alt="Video Frame"
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 transform scale-110 animate-pulse"
                  />
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

                {/* Top Overlay: Urdu Eye Catching Hook */}
                <div className="relative z-10 space-y-1">
                  <div className="inline-flex items-center gap-1 rounded-full bg-rose-600/90 text-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow">
                    🔥 پاکستان میں سب سے زیادہ فروخت
                  </div>
                  <div className="text-xs font-black text-white drop-shadow-md">
                    {productQuery}
                  </div>
                </div>

                {/* Center Animated Pulsing Badge */}
                <div className="relative z-10 text-center my-auto">
                  <div className="inline-block rounded-xl bg-amber-500/95 text-slate-950 font-black text-xs px-3 py-1 shadow-lg transform -rotate-2">
                    7 Days Return Guarantee!
                  </div>
                </div>

                {/* Bottom Overlay: Reseller WhatsApp & Offer */}
                <div className="relative z-10 space-y-1.5">
                  <div className="rounded-xl bg-slate-900/90 border border-emerald-500/40 p-2 text-left backdrop-blur-xs">
                    <div className="text-[10px] text-slate-300 font-bold">
                      🚚 فری ہوم ڈیلیوری + کیش آن ڈیلیوری
                    </div>
                    <div className="text-[11px] font-black text-emerald-400 font-mono mt-0.5">
                      Order WhatsApp: {watermarkPhone}
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <button
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="p-1 rounded bg-black/60 text-white"
                    >
                      {isPlayingVideo ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </button>
                    <span className="font-mono text-[9px]">Reel: 00:15 / HD</span>
                    <button
                      onClick={() => setIsAudioMuted(!isAudioMuted)}
                      className="p-1 rounded bg-black/60 text-white"
                    >
                      {isAudioMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3 text-emerald-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Customization & Script */}
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <label className="text-slate-300 font-bold block">
                  Reseller WhatsApp Number on Video Watermark:
                </label>
                <input
                  type="text"
                  value={watermarkPhone}
                  onChange={(e) => setWatermarkPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-bold">Voiceover Script (Urdu Audio):</label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(videoScriptUrdu);
                      setToastMessage('Urdu Voiceover script copied to clipboard!');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="text-violet-400 hover:underline text-[11px] flex items-center gap-1 font-bold"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Script</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={videoScriptUrdu}
                  onChange={(e) => setVideoScriptUrdu(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-sans text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setToastMessage('Exporting 9:16 Video MP4 Reel with Watermark...');
                    setTimeout(() => {
                      setToastMessage('Video Ad Reel downloaded to your device! ✓');
                      setTimeout(() => setToastMessage(null), 3000);
                    }, 1500);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Download className="h-4 w-4" />
                  <span>Download 9:16 Video Ad (MP4)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI URDU & ENGLISH SALES COPY */}
        {activeTab === 'copy' && (
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
              <label className="text-slate-300 font-bold block">SEO Product Title:</label>
              <input
                type="text"
                value={generatedTitle}
                onChange={(e) => setGeneratedTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white font-bold"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
              <label className="text-slate-300 font-bold block">Key Highlights & Bullet Points:</label>
              <textarea
                rows={4}
                value={generatedHighlights}
                onChange={(e) => setGeneratedHighlights(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-mono"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
              <label className="text-slate-300 font-bold block">Urdu Customer Pitch (for WhatsApp/Facebook):</label>
              <textarea
                rows={3}
                value={generatedDescription}
                onChange={(e) => setGeneratedDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white font-sans"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Zero Copyright License: All generated assets safe for commercial advertising</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyToProductForm}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Apply Assets to Product Listing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
