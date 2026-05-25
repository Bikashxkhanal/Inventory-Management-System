import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import CustomChart from '../../Chart/CustomChart';
import getChartFor from '../../Chart/CreateOptions';
import useFetch from '../../../hooks/useFetch';
import { fetchStaffStats } from '../../../api/staff.api.js';
import {
  getPurchaseAmountOfDateRange,
  getTotalPurchaseAmountByDateRange,
} from '../../../api/purchase.api.js';
import {
  getSalesAmountOfDateRange,
  getTotalSalesAmountByDateRange,
} from '../../../api/sales.api.js';
import {
  formatDate,
  getStartDateOfCurrentYear,
} from '../../../helpers/date/date.js';
import { formatRs } from '../../../helpers/formatMoney';
import { isSalesperson } from '../../../helpers/roleAccess';
import {
  buildSalesPurchaseChart,
  buildRangeLabels,
  getLastNDates,
} from '../../../helpers/chart/comparisonChart';

const StatCard = ({ title, value, subtitle, accent, to }) => (
  <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <p className={`mt-1 text-xl font-bold tabular-nums sm:text-2xl ${accent}`}>
        {value ?? '—'}
      </p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
    {to && (
      <Link
        to={to}
        className="mt-3 inline-block w-fit cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
      >
        View details
      </Link>
    )}
  </div>
);

const RANGE_PRESETS = [
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: 'year', label: 'This year', type: 'ytd' },
];

const DashboardComp = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const last7Labels = useMemo(() => getLastNDates(7), []);
  const weekStart = last7Labels[0];
  const today = formatDate(new Date());

  const [lineStart, setLineStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return formatDate(d);
  });
  const [lineEnd, setLineEnd] = useState(today);
  const [rangePreset, setRangePreset] = useState('30d');

  if (isSalesperson(role)) {
    return <Navigate to="/web/sale" replace />;
  }

  const yearStart = getStartDateOfCurrentYear(new Date());

  const { data: salesData } = useFetch('salesAmountYtd', () =>
    getTotalSalesAmountByDateRange(yearStart, today)
  );
  const { data: purchaseData } = useFetch('purchaseAmountYtd', () =>
    getTotalPurchaseAmountByDateRange(yearStart, today)
  );
  const { data: staffData } = useFetch('staffStats', fetchStaffStats);

  const { data: salesWeek } = useFetch(
    ['salesWeek', weekStart, today],
    () => getSalesAmountOfDateRange(weekStart, today)
  );
  const { data: purchaseWeek } = useFetch(
    ['purchaseWeek', weekStart, today],
    () => getPurchaseAmountOfDateRange(weekStart, today)
  );

  const { data: salesLine } = useFetch(
    ['salesLine', lineStart, lineEnd],
    () => getSalesAmountOfDateRange(lineStart, lineEnd)
  );
  const { data: purchaseLine } = useFetch(
    ['purchaseLine', lineStart, lineEnd],
    () => getPurchaseAmountOfDateRange(lineStart, lineEnd)
  );

  const weekBarChart = useMemo(
    () => buildSalesPurchaseChart(salesWeek, purchaseWeek, last7Labels),
    [salesWeek, purchaseWeek, last7Labels]
  );

  const lineLabels = useMemo(
    () => buildRangeLabels(lineStart, lineEnd),
    [lineStart, lineEnd]
  );

  const lineChart = useMemo(
    () => buildSalesPurchaseChart(salesLine, purchaseLine, lineLabels),
    [salesLine, purchaseLine, lineLabels]
  );

  const lineChartMinWidth = Math.max(480, (lineLabels.length || 1) * 44);

  const applyPreset = (preset) => {
    setRangePreset(preset.id);
    const end = formatDate(new Date());
    setLineEnd(end);
    if (preset.type === 'ytd') {
      setLineStart(getStartDateOfCurrentYear(new Date()));
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() - (preset.days - 1));
    setLineStart(formatDate(d));
  };

  const salesYtd =
    salesData?.data?.totalSalesAmount ?? salesData?.totalSalesAmount;
  const purchaseYtd =
    purchaseData?.data?.totalPurchaseAmount ?? purchaseData?.totalPurchaseAmount;

  return (
    <div className="page-content max-h-[calc(100vh-4rem)] overflow-y-auto py-5">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Dashboard</h1>
        <p className="text-sm text-slate-500">Year-to-date overview and trends</p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Sales (YTD)"
          value={formatRs(salesYtd)}
          subtitle={`Since ${yearStart}`}
          accent="text-emerald-600"
          to="/web/dashboard/sales"
        />
        <StatCard
          title="Purchases (YTD)"
          value={formatRs(purchaseYtd)}
          subtitle={`Since ${yearStart}`}
          accent="text-blue-600"
          to="/web/dashboard/purchases"
        />
        <StatCard
          title="Staff"
          value={staffData?.total ?? '—'}
          subtitle="Active roles"
          accent="text-violet-600"
        />
      </div>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold text-slate-900">Last 7 days — sales vs purchases</h2>
        <p className="mt-0.5 text-xs text-slate-500">Daily totals (bar chart)</p>
        <div className="mt-4 h-[220px] w-full min-w-0 sm:h-[260px]">
          <CustomChart
            type="bar"
            data={weekBarChart}
            options={getChartFor('bar', 'Last 7 days')}
          />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Trend over time</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Scroll horizontally on smaller screens · pick a preset or custom range
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {RANGE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  rangePreset === p.id
                    ? 'bg-slate-800 text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 flex flex-wrap items-end gap-3 text-xs">
          <label className="flex flex-col gap-1 text-slate-600">
            From
            <input
              type="date"
              value={lineStart}
              onChange={(e) => {
                setRangePreset('custom');
                setLineStart(e.target.value);
              }}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-slate-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-slate-600">
            To
            <input
              type="date"
              value={lineEnd}
              onChange={(e) => {
                setRangePreset('custom');
                setLineEnd(e.target.value);
              }}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-slate-900"
            />
          </label>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="h-[240px] sm:h-[280px]" style={{ minWidth: lineChartMinWidth }}>
            <CustomChart
              type="line"
              data={{
                ...lineChart,
                datasets: lineChart.datasets.map((ds) => ({
                  ...ds,
                  fill: false,
                  backgroundColor: ds.borderColor,
                })),
              }}
              options={getChartFor('line', 'Sales vs purchases')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardComp;
