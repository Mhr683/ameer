import { KnowledgeDoc, AIChatMessage } from '../../types';

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'DOC-01',
    category: 'DELIVERY',
    title: 'Pakistan Delivery Timeframe & Courier Handling',
    content:
      'Parcels are dispatched within 24 hours via Trax, PostEx, TCS, or Leopards. Standard delivery across Karachi, Lahore, and Islamabad/Rawalpindi takes 2-3 business days. Rural and tier-2 cities take 3-5 days. Tracking IDs are active within 6 hours.',
    keywords: ['delivery', 'time', 'shipping', 'tcs', 'postex', 'trax', 'days', 'kahan hai parcel'],
    updatedAt: '2026-09-01',
  },
  {
    id: 'DOC-02',
    category: 'REFUND',
    title: 'Damaged Parcel & 7-Day Return Policy',
    content:
      'Customers can claim replacement or full refund within 7 days of delivery if the item is damaged, defective, or mismatched. An unboxing video or parcel picture is required. Return shipping is handled by courier pickup.',
    keywords: ['return', 'refund', 'damaged', 'kharab', 'badlao', 'wapas', 'replacement'],
    updatedAt: '2026-09-02',
  },
  {
    id: 'DOC-03',
    category: 'COD',
    title: 'Cash On Delivery (COD) Rules & Advance Security Fee',
    content:
      'Cash on Delivery is available across Pakistan. Customers with a high refusal score or out-of-service addresses are asked to pay a nominal PKR 200 Advance Delivery Fee via JazzCash/EasyPaisa/Raast, which is deducted from the final COD invoice.',
    keywords: ['cod', 'cash on delivery', 'advance', '200', 'jazzcash', 'easypaisa', 'raast'],
    updatedAt: '2026-09-03',
  },
  {
    id: 'DOC-04',
    category: 'DARAZ_SYNC',
    title: 'Daraz 2.25% Profit Guard & Sync Rules',
    content:
      'When products are pushed to Daraz, automatic pricing adjusts for Daraz category commission (12-18%), payment handling fee, VAT (13-16%), and locks the net margin so no order is sold at a loss.',
    keywords: ['daraz', 'sync', 'commission', 'profit guard', 'margin'],
    updatedAt: '2026-09-04',
  },
];

/**
 * Knowledge-trained AI agent auto-responder matching customer inquiries
 */
export function queryAIDispatchAgent(
  userQuery: string,
  knowledgeDocs: KnowledgeDoc[] = INITIAL_KNOWLEDGE_DOCS
): { replyText: string; matchedDocTitle?: string; confidenceScore: number; needsHumanEscalation: boolean } {
  const queryLower = userQuery.toLowerCase().trim();

  // Find most matching document
  let bestDoc: KnowledgeDoc | null = null;
  let maxMatches = 0;

  for (const doc of knowledgeDocs) {
    let matches = 0;
    doc.keywords.forEach((kw) => {
      if (queryLower.includes(kw.toLowerCase())) {
        matches += 2;
      }
    });

    const docWords = doc.title.toLowerCase().split(' ');
    docWords.forEach((w) => {
      if (w.length > 3 && queryLower.includes(w)) {
        matches += 1;
      }
    });

    if (matches > maxMatches) {
      maxMatches = matches;
      bestDoc = doc;
    }
  }

  // Escalation detection
  const angryWords = ['fraud', 'police', 'scam', 'chor', 'dhoka', 'lawyer', 'consumer court', 'manager'];
  const hasUrgentComplaint = angryWords.some((w) => queryLower.includes(w));

  if (hasUrgentComplaint) {
    return {
      replyText:
        'Hum aapki pareshani ko samajhte hain. Main aapka case priority support manager ko escalate kar raha hoon. Hamara human agent 15 minute ke andar WhatsApp/Call par aapse rabta karega.',
      confidenceScore: 0.95,
      needsHumanEscalation: true,
    };
  }

  if (bestDoc && maxMatches >= 2) {
    return {
      replyText: `Assalam-o-Alaikum! ${bestDoc.content}\n\nAgar aapko mazeed maloomat chahiye ho to aap hamari helpline par bhi call kar sakte hain.`,
      matchedDocTitle: bestDoc.title,
      confidenceScore: Math.min(0.98, 0.7 + maxMatches * 0.08),
      needsHumanEscalation: false,
    };
  }

  // Fallback greeting / smart inquiry response
  if (queryLower.includes('salam') || queryLower.includes('hello') || queryLower.includes('hi')) {
    return {
      replyText:
        'Walaikum Assalam! YourMart AI Dispatch Assistant mein khushamdeed. Main order tracking, delivery status, COD rules aur product warranty ke baray mein aapki madad kar sakta hoon. Aapka sawal kya hai?',
      confidenceScore: 0.99,
      needsHumanEscalation: false,
    };
  }

  return {
    replyText:
      'Aapka sawal note kar liya gaya hai. Aapki behtar rehnumai ke liye main aapki chat live human agent ko transfer kar raha hoon.',
    confidenceScore: 0.45,
    needsHumanEscalation: true,
  };
}
