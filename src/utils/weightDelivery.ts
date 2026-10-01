/**
 * Weight-Based Courier Delivery Calculation for Pakistan E-Commerce
 * Standards based on Leopard, TCS, Trax, PostEx:
 * - Base rate for parcel up to 1.0 kg (default PKR 200)
 * - Additional rate for each extra kg or fraction thereof (default PKR 60 / kg)
 */

export interface WeightDeliveryBreakdown {
  totalWeightKg: number;
  baseWeightLimitKg: number;
  baseDeliveryPKR: number;
  extraWeightKg: number;
  extraKgUnits: number;
  extraDeliveryPKR: number;
  totalDeliveryPKR: number;
  courierFormulaText: string;
}

export function calculateWeightDelivery(
  totalWeightKg: number,
  baseRatePKR: number = 200,
  additionalPerKgPKR: number = 60
): WeightDeliveryBreakdown {
  // Ensure minimum realistic weight
  const safeWeight = Math.max(0.1, Math.round(totalWeightKg * 100) / 100);
  const baseWeightLimitKg = 1.0;

  if (safeWeight <= baseWeightLimitKg) {
    return {
      totalWeightKg: safeWeight,
      baseWeightLimitKg,
      baseDeliveryPKR: baseRatePKR,
      extraWeightKg: 0,
      extraKgUnits: 0,
      extraDeliveryPKR: 0,
      totalDeliveryPKR: baseRatePKR,
      courierFormulaText: `Parcel weight (${safeWeight} kg) ≤ 1.0 kg: Standard Base Delivery Rs. ${baseRatePKR}`,
    };
  }

  const extraWeightKg = Math.round((safeWeight - baseWeightLimitKg) * 100) / 100;
  const extraKgUnits = Math.ceil(extraWeightKg);
  const extraDeliveryPKR = extraKgUnits * additionalPerKgPKR;
  const totalDeliveryPKR = baseRatePKR + extraDeliveryPKR;

  return {
    totalWeightKg: safeWeight,
    baseWeightLimitKg,
    baseDeliveryPKR: baseRatePKR,
    extraWeightKg,
    extraKgUnits,
    extraDeliveryPKR,
    totalDeliveryPKR,
    courierFormulaText: `Base 1.0 kg (Rs. ${baseRatePKR}) + Extra ${extraWeightKg} kg [${extraKgUnits} kg slab @ Rs. ${additionalPerKgPKR}] = Rs. ${totalDeliveryPKR}`,
  };
}
