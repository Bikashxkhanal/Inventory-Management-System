import { formatDate } from '../date/date';

/** Last N calendar days including today (YYYY-MM-DD). */
export function getLastNDates(n) {
  const count = Math.max(1, n);
  const dates = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

function eachDayInRange(startStr, endStr) {
  const start = new Date(`${startStr}T00:00:00`);
  const end = new Date(`${endStr}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return [];
  }
  const labels = [];
  const cur = new Date(start);
  while (cur <= end) {
    labels.push(formatDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return labels;
}

/**
 * @param {Array} salesRows
 * @param {Array} purchaseRows
 * @param {string[]|null} fixedLabels - when set, use these dates (fill missing with 0)
 */
export function buildSalesPurchaseChart(salesRows, purchaseRows, fixedLabels = null) {
  const salesMap = new Map();
  const purchaseMap = new Map();

  (salesRows ?? []).forEach((row) => {
    const key = row.salesDate ?? row.saleCreatedDate ?? row.date;
    if (key) salesMap.set(String(key).slice(0, 10), Number(row.totalAmount ?? row.amount ?? 0));
  });

  (purchaseRows ?? []).forEach((row) => {
    const key = row.purchaseCreatedDate ?? row.purchase_date ?? row.date;
    if (key) {
      purchaseMap.set(
        String(key).slice(0, 10),
        Number(row.amount ?? row.total_amount ?? row.totalAmount ?? 0)
      );
    }
  });

  let labels = fixedLabels;
  if (!labels?.length) {
    const set = new Set([...salesMap.keys(), ...purchaseMap.keys()]);
    labels = [...set].sort();
  }

  return {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: labels.map((d) => salesMap.get(d) ?? 0),
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        tension: 0.25,
      },
      {
        label: 'Purchases',
        data: labels.map((d) => purchaseMap.get(d) ?? 0),
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.25,
      },
    ],
  };
}

export function buildRangeLabels(startStr, endStr) {
  return eachDayInRange(startStr, endStr);
}
