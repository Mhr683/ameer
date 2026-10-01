export interface CourierProvider {
  id: string;
  name: string;
  code: 'TRAX' | 'POSTEX' | 'TCS' | 'LEOPARD' | 'CALL_COURIER' | 'M_P' | 'DHL';
  logo?: string;
  trackingUrlPattern: (trackingNumber: string) => string;
  apiBookingSupported: boolean;
  samplePrefix: string;
  contactHelpline: string;
}

export const SUPPORTED_COURIERS: CourierProvider[] = [
  {
    id: 'cr-trax',
    name: 'Trax Logistics',
    code: 'TRAX',
    trackingUrlPattern: (cn: string) => `https://trax.pk/tracking?cn=${encodeURIComponent(cn.trim())}`,
    apiBookingSupported: true,
    samplePrefix: 'TRX',
    contactHelpline: '021-111-118-729',
  },
  {
    id: 'cr-postex',
    name: 'PostEx COD',
    code: 'POSTEX',
    trackingUrlPattern: (cn: string) => `https://postex.pk/tracking?orderTrackingNumber=${encodeURIComponent(cn.trim())}`,
    apiBookingSupported: true,
    samplePrefix: 'PEX',
    contactHelpline: '042-325-00-111',
  },
  {
    id: 'cr-tcs',
    name: 'TCS Express',
    code: 'TCS',
    trackingUrlPattern: (cn: string) => `https://www.tcsexpress.com/tracking?consignmentNo=${encodeURIComponent(cn.trim())}`,
    apiBookingSupported: true,
    samplePrefix: 'TCS',
    contactHelpline: '021-111-123-456',
  },
  {
    id: 'cr-leopard',
    name: 'Leopards Courier',
    code: 'LEOPARD',
    trackingUrlPattern: (cn: string) => `https://leopardscourier.com/tracking?track=${encodeURIComponent(cn.trim())}`,
    apiBookingSupported: true,
    samplePrefix: 'LCS',
    contactHelpline: '021-111-300-786',
  },
  {
    id: 'cr-callcourier',
    name: 'Call Courier',
    code: 'CALL_COURIER',
    trackingUrlPattern: (cn: string) => `https://cod.callcourier.com.pk/Booking/AfterSaveTrack/${encodeURIComponent(cn.trim())}`,
    apiBookingSupported: true,
    samplePrefix: 'CC',
    contactHelpline: '042-111-786-227',
  },
  {
    id: 'cr-mp',
    name: 'M&P Express Logistics',
    code: 'M_P',
    trackingUrlPattern: (cn: string) => `https://mulphilog.com/tracking?cn=${encodeURIComponent(cn.trim())}`,
    apiBookingSupported: true,
    samplePrefix: 'MP',
    contactHelpline: '021-111-202-020',
  },
];

/**
 * Returns the direct official tracking link for a given courier and tracking ID/CN.
 */
export function getCourierTrackingUrl(courierName?: string, trackingNumber?: string): string {
  if (!trackingNumber) return '#';
  const cleanCn = trackingNumber.trim();
  const courierLower = (courierName || '').toLowerCase();

  const matched = SUPPORTED_COURIERS.find(
    (c) =>
      courierLower.includes(c.name.toLowerCase()) ||
      courierLower.includes(c.code.toLowerCase())
  );

  if (matched) {
    return matched.trackingUrlPattern(cleanCn);
  }

  // Fallback pattern if custom courier entered
  if (courierLower.includes('trax')) return `https://trax.pk/tracking?cn=${encodeURIComponent(cleanCn)}`;
  if (courierLower.includes('postex')) return `https://postex.pk/tracking?orderTrackingNumber=${encodeURIComponent(cleanCn)}`;
  if (courierLower.includes('leopard')) return `https://leopardscourier.com/tracking?track=${encodeURIComponent(cleanCn)}`;
  if (courierLower.includes('tcs')) return `https://www.tcsexpress.com/tracking?consignmentNo=${encodeURIComponent(cleanCn)}`;

  return `https://www.google.com/search?q=${encodeURIComponent(`${courierName || 'courier'} tracking ${cleanCn}`)}`;
}

/**
 * Generates an automated Courier Consignment Number (CN) simulating live Courier API Booking
 */
export function generateAutoTrackingNumber(courierName: string): string {
  const courierLower = courierName.toLowerCase();
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000); // 8 digits

  if (courierLower.includes('trax')) return `TRX-${randomDigits}-PK`;
  if (courierLower.includes('postex')) return `PEX-${randomDigits}`;
  if (courierLower.includes('leopard')) return `LCS-${randomDigits}`;
  if (courierLower.includes('tcs')) return `TCS-${randomDigits}-PK`;
  if (courierLower.includes('call')) return `CC-${randomDigits}`;
  if (courierLower.includes('m&p') || courierLower.includes('mp')) return `MP-${randomDigits}`;

  return `CN-${randomDigits}`;
}

/**
 * Generates WhatsApp quick-share link with tracking URL and order summary for customer
 */
export function getWhatsAppTrackingShareUrl(
  customerPhone: string,
  customerName: string,
  orderNumber: string,
  courierName: string,
  trackingNumber: string,
  codAmountPKR: number
): string {
  const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
  // Normalize PK phone 0300... to 92300...
  const intlPhone = cleanPhone.startsWith('92')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? `92${cleanPhone.slice(1)}`
    : cleanPhone;

  const trackingUrl = getCourierTrackingUrl(courierName, trackingNumber);

  const message = `Assalam-o-Alaikum ${customerName}! 📦\n\nAapka order *${orderNumber}* warehouse se pack hokar courier ke hawale kar diya gaya hai.\n\n🚚 *Courier:* ${courierName}\n🔢 *Tracking / CN:* ${trackingNumber}\n💰 *Cash on Delivery (COD):* PKR ${codAmountPKR.toLocaleString()}\n\n🔗 *Live Parcel Track Karein:*\n${trackingUrl}\n\nShukriya, YourMart Dropshipping!`;

  return `https://api.whatsapp.com/send?phone=${encodeURIComponent(intlPhone)}&text=${encodeURIComponent(message)}`;
}
