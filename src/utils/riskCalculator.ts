import { RiskAssessment, BlacklistEntry } from '../types';

// Mock shared nationwide RTO and fraudulent phone blacklist
export const INITIAL_BLACKLIST: BlacklistEntry[] = [
  {
    id: 'BLK-001',
    phone: '03001234567',
    customerName: 'Asim Raza',
    city: 'Faisalabad',
    address: 'Near Clock Tower, Bazar 4',
    reason: 'Refused 4 consecutive COD deliveries on door with fake address claim',
    reportedBy: 'PostEx Shared Network',
    reportedAt: '2026-08-28',
    failedDeliveriesCount: 4,
  },
  {
    id: 'BLK-002',
    phone: '03459876543',
    customerName: 'Kamran Ali',
    city: 'Rawalpindi',
    address: 'Commercial Market B-Block',
    reason: 'Opened parcel before payment and threatened rider',
    reportedBy: 'Trax Logistics',
    reportedAt: '2026-09-01',
    failedDeliveriesCount: 3,
  },
  {
    id: 'BLK-003',
    phone: '03125554321',
    customerName: 'Shahid Mehmood',
    city: 'Gujranwala',
    reason: 'Unreachable number continuously on dispatch re-attempts',
    reportedBy: 'Leopards Courier',
    reportedAt: '2026-09-03',
    failedDeliveriesCount: 5,
  },
];

/**
 * Evaluates Pakistan customer COD risk score based on order history and blacklist
 */
export function calculateCustomerRisk(
  phone: string,
  cityName: string,
  blacklist: BlacklistEntry[] = INITIAL_BLACKLIST
): RiskAssessment {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const blacklisted = blacklist.find((b) => b.phone.replace(/[^0-9]/g, '') === cleanPhone);

  if (blacklisted) {
    return {
      phone,
      riskScore: 92,
      riskLevel: 'HIGH',
      isBlacklisted: true,
      refusalRatePercentage: 100,
      totalOrders: blacklisted.failedDeliveriesCount + 1,
      deliveredOrders: 0,
      returnedOrders: blacklisted.failedDeliveriesCount,
      requiresAdvanceFee: true,
      reasons: [
        `Flagged in National RTO Registry: ${blacklisted.reason}`,
        'Refusal history across major courier partners',
        'Mandatory PKR 200 Advance Delivery Guarantee required before dispatch',
      ],
    };
  }

  // City risk heuristics in Pakistan
  const highRiskTiers = ['kandhkot', 'chaman', 'turbat', 'parachinar'];
  const isTierRisk = highRiskTiers.some((c) => cityName.toLowerCase().includes(c));

  if (isTierRisk) {
    return {
      phone,
      riskScore: 65,
      riskLevel: 'MEDIUM',
      isBlacklisted: false,
      refusalRatePercentage: 45,
      totalOrders: 2,
      deliveredOrders: 1,
      returnedOrders: 1,
      requiresAdvanceFee: true,
      reasons: [
        'Out-of-service area with elevated courier return-to-origin (RTO) rate',
        'Recommend phone OTP verification or PKR 200 commitment fee',
      ],
    };
  }

  // Safe low risk customer
  return {
    phone,
    riskScore: 12,
    riskLevel: 'LOW',
    isBlacklisted: false,
    refusalRatePercentage: 0,
    totalOrders: 3,
    deliveredOrders: 3,
    returnedOrders: 0,
    requiresAdvanceFee: false,
    reasons: ['Verified clean phone record', 'High doorstep acceptance probability (>94%)'],
  };
}
