import { Product } from '../types';

/**
 * Exports products array to a standard CSV file and triggers browser download
 */
export function exportProductsToCSV(products: Product[]): { count: number; filename: string } {
  const headers = [
    'Product ID',
    'Product Title',
    'SKU',
    'Category',
    'Wholesale Cost (PKR)',
    'Recommended Retail Price (PKR)',
    'Estimated Margin (PKR)',
    'Margin (%)',
    'Available Stock',
    'Supplier Name',
    'Status',
  ];

  const escapeCSV = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = products.map((p) => {
    const wholesale = p.supplierCostPKR || 0;
    const retail = p.recSellingPricePKR || Math.round(wholesale * 1.5);
    const marginPKR = Math.max(0, retail - wholesale);
    const marginPct = retail > 0 ? Math.round((marginPKR / retail) * 100) : 0;

    return [
      escapeCSV(p.id),
      escapeCSV(p.name),
      escapeCSV(p.sku),
      escapeCSV(p.category),
      wholesale,
      retail,
      marginPKR,
      `${marginPct}%`,
      p.stock || 0,
      escapeCSV(p.supplierName || 'YourMart Verified Supplier'),
      escapeCSV((p.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `YourMart_Products_Catalog_${timestamp}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { count: products.length, filename };
}
