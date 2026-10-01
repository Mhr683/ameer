import { Order, SplitSubOrder, Product } from '../../types';

/**
 * Multi-Supplier Auto Order Splitting Core
 * Automatically groups line items by supplierId and creates separate
 * fulfillment sub-orders with assigned warehouse and optimal courier routing.
 */
export function splitOrderForSuppliers(
  order: Order,
  productsCatalog: Product[]
): SplitSubOrder[] {
  const supplierMap = new Map<string, SplitSubOrder>();

  order.items.forEach((item) => {
    const catalogProduct = productsCatalog.find(
      (p) => p.id === item.productId || p.sku === item.sku
    );
    const supplierId = catalogProduct?.supplierId || 'SUP-DIRECT-MAIN';
    const supplierName = catalogProduct?.supplierName || 'YourMart Central Hub';
    const weightKg = catalogProduct?.weightKg || 0.45;
    const warehouseLocation = catalogProduct?.storeName
      ? `${catalogProduct.storeName} Hub (${catalogProduct.brand || 'Punjab'})`
      : 'Lahore Central Fulfillment Terminal';

    if (!supplierMap.has(supplierId)) {
      supplierMap.set(supplierId, {
        subOrderId: `SUB-${order.id.replace('ORD-', '')}-${supplierId.slice(-3)}`,
        parentOrderId: order.id,
        supplierId,
        supplierName,
        items: [],
        totalCostPKR: 0,
        totalWeightKg: 0,
        allocatedCourier: 'PostEx Rapid',
        status: order.status,
        warehouseLocation,
      });
    }

    const sub = supplierMap.get(supplierId)!;
    const itemQty = item.qty || 1;
    const itemSellingPrice = item.sellingPricePKR || (catalogProduct?.recSellingPricePKR || 1000);
    const itemCost = (catalogProduct?.supplierCostPKR || itemSellingPrice * 0.7) * itemQty;
    
    sub.items.push({
      productId: item.productId,
      productName: item.name || item.productName || catalogProduct?.name || 'Product',
      sku: item.sku || catalogProduct?.sku || 'SKU-001',
      quantity: itemQty,
      supplierCostPKR: catalogProduct?.supplierCostPKR || itemSellingPrice * 0.7,
      sellingPricePKR: itemSellingPrice,
      weightKg,
    });

    sub.totalCostPKR += itemCost;
    sub.totalWeightKg = Number((sub.totalWeightKg + weightKg * itemQty).toFixed(2));

    // Dynamic Courier Allocation based on package weight
    if (sub.totalWeightKg > 2.0) {
      sub.allocatedCourier = 'Trax Heavy Surface';
    } else if (sub.totalWeightKg > 0.8) {
      sub.allocatedCourier = 'TCS Express COD';
    } else {
      sub.allocatedCourier = 'PostEx Flyer Dispatch';
    }
  });

  return Array.from(supplierMap.values());
}
