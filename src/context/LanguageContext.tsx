import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'en' | 'roman-urdu' | 'ur';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, defaultText?: string) => string;
  isUrdu: boolean;
}

const TRANSLATIONS: Record<string, Record<AppLanguage, string>> = {
  // Navigation
  dashboard: {
    en: 'Dashboard',
    'roman-urdu': 'Dashboard',
    ur: 'ڈیش بورڈ',
  },
  catalog: {
    en: 'Wholesale Catalog',
    'roman-urdu': 'Wholesale Maal Catalog',
    ur: 'تھوک مال کیٹلاگ',
  },
  orders: {
    en: 'Orders & Dispatch',
    'roman-urdu': 'Orders & Dispatch',
    ur: 'آرڈرز اور ترسیل',
  },
  payouts: {
    en: 'Profit Payouts',
    'roman-urdu': 'Munafa Withdrawal (Payouts)',
    ur: 'منافع کی ادائیگی',
  },
  'public-tracking': {
    en: 'Live Parcel Tracking',
    'roman-urdu': 'Live Parcel Tracking',
    ur: 'لائیو پارسل ٹریکنگ',
  },
  'reverse-logistics': {
    en: 'RTO & Reverse Claims',
    'roman-urdu': 'RTO & Wapsi Claims',
    ur: 'واپسی اور کلیمز',
  },
  'supplier-hub': {
    en: 'Supplier Hub',
    'roman-urdu': 'Karkhana (Supplier) Hub',
    ur: 'سپلائر / کارخانہ ہب',
  },
  'support-tickets': {
    en: 'Support & Disputes',
    'roman-urdu': 'Help Desk & Shikayaat',
    ur: 'شکایات اور ہیلپ ڈیسک',
  },
  'abandoned-carts': {
    en: 'Abandoned Carts',
    'roman-urdu': 'Chhutay Hue Carts (Recovery)',
    ur: 'نامکمل آرڈرز ریکوری',
  },
  'barcode-scanner': {
    en: 'Barcode Scanner',
    'roman-urdu': 'Barcode Camera Scanner',
    ur: 'بارکوڈ کیمرہ اسکینر',
  },

  // Common terms
  wallet_balance: {
    en: 'Wallet Balance',
    'roman-urdu': 'Aapka Munafa Balance',
    ur: 'والیٹ بیلنس',
  },
  cod_price: {
    en: 'Customer COD Price',
    'roman-urdu': 'Customer COD Qeemat',
    ur: 'کسٹمر کیش آن ڈیلیوری رقم',
  },
  wholesale_cost: {
    en: 'Wholesale Cost',
    'roman-urdu': 'Karkhana Wholesale Rate',
    ur: 'کارخانہ تھوک ریٹ',
  },
  net_profit: {
    en: 'Your Net Profit',
    'roman-urdu': 'Aapka Saaf Munafa',
    ur: 'آپ کا خالص منافع',
  },
  verified_supplier: {
    en: 'Verified Factory Direct',
    'roman-urdu': 'Tasdeeq Shuda Factory',
    ur: 'تصدیق شدہ کارخانہ',
  },
  place_order: {
    en: 'Book COD Order',
    'roman-urdu': 'COD Order Book Karein',
    ur: 'آرڈر بک کریں',
  },
  single_delivery_guarantee: {
    en: 'Single Delivery Parcel Guarantee (Flat PKR 200)',
    'roman-urdu': 'Aik Store Ka Aik Parcel (Flat Rs. 200 Delivery)',
    ur: 'ایک اسٹور ایک پارسل گارنٹی (200 روپے)',
  },
  claim_bonus: {
    en: 'Claim Cash Bonus',
    'roman-urdu': 'Cash Bonus Wasool Karein',
    ur: 'کیش بونس حاصل کریں',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, defaultText) => defaultText || key,
  isUrdu: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('ym_language');
    if (saved === 'en' || saved === 'roman-urdu' || saved === 'ur') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('ym_language', lang);
  };

  const t = (key: string, defaultText?: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    return defaultText || key;
  };

  const isUrdu = language === 'ur';

  useEffect(() => {
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isUrdu }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
