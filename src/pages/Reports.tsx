import React, { useState } from 'react';
import { FileBarChart2, Printer, Search, Calendar, Landmark, Receipt, AlertTriangle, Droplets, Sun, CheckSquare, Layers, HelpCircle, CheckCircle } from 'lucide-react';
import { db, getTodayStr, getCustomerOutstandingBalance } from '../utils/api';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<string>('sales');

  // Date filters (defaults to month-to-date)
  const today = getTodayStr();
  const defaultStart = today.substring(0, 8) + '01'; // First day of current month
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(today);

  // Search keyword filter
  const [searchQuery, setSearchQuery] = useState('');

  // Loaded database snapshots
  const sales = db.getSales();
  const expenses = db.getExpenses();
  const waste = db.getWasteRecords();
  const wet = db.getWetProduction();
  const dry = db.getDryProduction();
  const final = db.getFinalProduction();
  const customers = db.getCustomers();
  const txs = db.getTransactions();

  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Date range checker helper
  const isWithinRange = (dateStr: string) => {
    if (!dateStr) return false;
    return dateStr >= startDate && dateStr <= endDate;
  };

  // Dynamic calculations depending on active report
  let summaryNode = null;
  let reportTitle = '';
  let reportHeaders: string[] = [];
  let reportRows: any[] = [];

  if (activeReport === 'sales') {
    reportTitle = 'Sales & Revenue Despatch Report';
    const filteredSales = sales.filter((s) => isWithinRange(s.date) && s.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalQty = filteredSales.reduce((sum, s) => sum + s.quantity, 0);
    const totalGross = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalDiscounts = filteredSales.reduce((sum, s) => sum + s.discount, 0);
    const netRevenue = filteredSales.reduce((sum, s) => sum + s.grandTotal, 0);

    summaryNode = (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Net Sales Volume</p>
          <p className="font-mono text-sm font-extrabold text-slate-800 mt-1">{totalQty.toLocaleString()} pcs</p>
        </div>
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Gross Booked Bills</p>
          <p className="font-mono text-sm font-extrabold text-slate-800 mt-1">Rs. {Math.round(totalGross).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Discounts Subsidized</p>
          <p className="font-mono text-sm font-extrabold text-red-600 mt-1">Rs. {Math.round(totalDiscounts).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
          <p className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">Net Revenue Receivable</p>
          <p className="font-mono text-sm font-extrabold text-emerald-700 mt-1">Rs. {Math.round(netRevenue).toLocaleString()}</p>
        </div>
      </div>
    );

    reportHeaders = ['Invoice No', 'Dispatch Date', 'Customer', 'Product Grade', 'Qty', 'Billed Rate', 'Net Billing'];
    reportRows = filteredSales.reverse().map((s) => [
      s.invoiceNumber,
      s.date,
      s.customerName,
      s.productName,
      s.quantity.toLocaleString() + ' pcs',
      'Rs. ' + s.rate,
      'Rs. ' + Math.round(s.grandTotal).toLocaleString()
    ]);
  } else if (activeReport === 'expenses') {
    reportTitle = 'Factory Operations Expenses Report';
    const filteredExpenses = expenses.filter((e) => isWithinRange(e.date) && e.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalExp = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = filteredExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    summaryNode = (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-5 text-[10px]">
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg sm:col-span-1">
          <p className="text-[9px] text-rose-800 font-bold uppercase tracking-wider">Total Disbursements</p>
          <p className="font-mono text-sm font-extrabold text-rose-700 mt-1">Rs. {Math.round(totalExp).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase">Labour Wages</p>
          <p className="font-mono font-bold text-slate-700 mt-1">Rs. {Math.round(byCategory['Labour'] || 0).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase">Electricity</p>
          <p className="font-mono font-bold text-slate-700 mt-1">Rs. {Math.round(byCategory['Electricity'] || 0).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase">Gas bill</p>
          <p className="font-mono font-bold text-slate-700 mt-1">Rs. {Math.round(byCategory['Gas'] || 0).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase">Transport Freight</p>
          <p className="font-mono font-bold text-slate-700 mt-1">Rs. {Math.round(byCategory['Transport'] || 0).toLocaleString()}</p>
        </div>
      </div>
    );

    reportHeaders = ['Paid Date', 'Expense Category', 'Disbursement Sum', 'Operational Memo'];
    reportRows = filteredExpenses.reverse().map((e) => [
      e.date,
      e.category,
      'Rs. ' + e.amount.toLocaleString(),
      e.description
    ]);
  } else if (activeReport === 'waste') {
    reportTitle = 'Defects &amp; Breakage Analysis';
    const filteredWaste = waste.filter((w) => isWithinRange(w.date) && w.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalDamaged = filteredWaste.reduce((sum, w) => sum + w.quantity, 0);
    const wetLoss = filteredWaste.filter(w => w.source === 'wet').reduce((sum, w) => sum + w.quantity, 0);
    const dryLoss = filteredWaste.filter(w => w.source === 'dry').reduce((sum, w) => sum + w.quantity, 0);

    summaryNode = (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
          <p className="text-[9px] text-rose-800 font-bold uppercase tracking-wider">Total Defective Plates</p>
          <p className="font-mono text-sm font-extrabold text-rose-700 mt-1">{totalDamaged.toLocaleString()} pcs</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase">Molding Section losses</p>
          <p className="font-mono font-bold text-slate-700 mt-1">{wetLoss.toLocaleString()} pcs</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase">Drying Chamber losses</p>
          <p className="font-mono font-bold text-slate-700 mt-1">{dryLoss.toLocaleString()} pcs</p>
        </div>
      </div>
    );

    reportHeaders = ['Log Date', 'Damage Source', 'Breakage Quantity', 'Incident Memo'];
    reportRows = filteredWaste.reverse().map((w) => [
      w.date,
      w.source.toUpperCase(),
      w.quantity.toLocaleString() + ' pcs',
      w.notes
    ]);
  } else if (activeReport === 'production') {
    reportTitle = 'Production Manufacturing Report';
    const filteredWet = wet.filter((r) => isWithinRange(r.productionDate));
    const filteredDry = dry.filter((r) => isWithinRange(r.date));
    const filteredFinal = final.filter((r) => isWithinRange(r.date));

    const totalWetMolded = filteredWet.reduce((sum, r) => sum + r.wetPlatesProduced, 0);
    const totalDryProcessed = filteredDry.reduce((sum, r) => sum + r.dryPlatesProduced, 0);
    const totalFinalFinished = filteredFinal.reduce((sum, r) => sum + r.finalPlatesProduced, 0);

    summaryNode = (
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <p className="text-[9px] text-indigo-800 font-bold uppercase tracking-wider">Wet Plates Molded</p>
          <p className="font-mono text-sm font-extrabold text-indigo-700 mt-1">{totalWetMolded.toLocaleString()} pcs</p>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
          <p className="text-[9px] text-amber-800 font-bold uppercase tracking-wider">Dry Chamber Check-out</p>
          <p className="font-mono text-sm font-extrabold text-amber-700 mt-1">{totalDryProcessed.toLocaleString()} pcs</p>
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
          <p className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">Final Finished Assembly</p>
          <p className="font-mono text-sm font-extrabold text-emerald-700 mt-1">{totalFinalFinished.toLocaleString()} pcs</p>
        </div>
      </div>
    );

    // Dynamic compilation of active stages for display
    reportHeaders = ['Date Stamp', 'Department Stage', 'Input Quantity', 'Output Quantity', 'Operational Notes'];
    
    // Stitch all together for chronologial list
    const stitched: any[] = [];
    filteredWet.forEach(w => stitched.push({ date: w.productionDate, dept: 'MOLDING (WET)', in: '—', out: w.wetPlatesProduced, notes: w.notes }));
    filteredDry.forEach(d => stitched.push({ date: d.date, dept: 'CHAMBER (DRY)', in: d.wetPlatesReceived, out: d.dryPlatesProduced, notes: d.notes }));
    filteredFinal.forEach(f => stitched.push({ date: f.date, dept: 'ASSEMBLY (FINAL)', in: f.dryPlatesReceived, out: f.finalPlatesProduced, notes: f.notes }));

    reportRows = stitched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(s => [
      s.date,
      s.dept,
      s.in === '—' ? '—' : s.in.toLocaleString() + ' pcs',
      s.out.toLocaleString() + ' pcs',
      s.notes || '—'
    ]);
  } else if (activeReport === 'customers') {
    reportTitle = 'Customers Receivables Balance Statement';
    const filteredCust = customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalOutstanding = filteredCust.reduce((sum, c) => sum + getCustomerOutstandingBalance(c.id), 0);

    summaryNode = (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-[9px] text-red-800 font-bold uppercase tracking-wider">Total Receivables Outstanding (Credit Book)</p>
          <p className="font-mono text-sm font-extrabold text-red-700 mt-1">Rs. {Math.round(totalOutstanding).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-500">Total Accounts Listed:</span>
          <span className="font-mono font-bold text-slate-800 text-sm">{filteredCust.length} Active Profiles</span>
        </div>
      </div>
    );

    reportHeaders = ['ID Folder', 'Customer Name', 'Phone Contact', 'Delivery Address', 'Outstanding Receivable Balance'];
    reportRows = filteredCust.map((c) => [
      c.id.toUpperCase(),
      c.name,
      c.phone,
      c.address,
      'Rs. ' + Math.round(getCustomerOutstandingBalance(c.id)).toLocaleString()
    ]);
  } else if (activeReport === 'inventory') {
    reportTitle = 'Procurement &amp; Material Consumption Ledger';
    const filteredTxs = txs.filter((t) => isWithinRange(t.date) && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const procureTotal = filteredTxs.filter(t => t.type === 'in').reduce((sum, t) => sum + t.cost, 0);
    const consumedCount = filteredTxs.filter(t => t.type === 'out').length;

    summaryNode = (
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
          <p className="text-[9px] text-indigo-800 font-bold uppercase tracking-wider">Raw Material Procurement Cost</p>
          <p className="font-mono text-sm font-extrabold text-indigo-700 mt-1">Rs. {Math.round(procureTotal).toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <p className="text-[9px] text-slate-400 font-bold uppercase">Automated Deductions Run</p>
          <p className="font-mono text-sm font-extrabold text-slate-700 mt-1">{consumedCount} transaction logs</p>
        </div>
      </div>
    );

    reportHeaders = ['Transaction Date', 'Adjustment', 'Material Volume', 'Supplier Procurement Cost', 'Operational Detail Log'];
    reportRows = filteredTxs.reverse().map((t) => [
      t.date,
      t.type.toUpperCase() === 'IN' ? 'STOCK-IN' : 'STOCK-OUT',
      `${t.quantity.toLocaleString()} ${t.unit || 'pcs'}`,
      t.cost > 0 ? 'Rs. ' + t.cost.toLocaleString() : '—',
      t.notes
    ]);
  }

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Date filter bar - Hidden when printing */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 no-print">
        <h3 className="font-display font-black text-slate-800 text-sm">ERP Reporting Center</h3>
        <p className="text-[11px] text-slate-400 font-medium">Generate custom dates-stamped audited financial logs and production registers</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50 text-slate-800 font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50 text-slate-800 font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Description Keyword Search</label>
            <input
              type="text"
              placeholder="Filter by customer, memo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50 text-slate-800"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePrintReport}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Printer size={14} /> Print This Report (PDF)
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-50">
          {[
            { id: 'sales', label: 'Sales & Revenue', icon: FileBarChart2 },
            { id: 'expenses', label: 'Expenses ledger', icon: Receipt },
            { id: 'waste', label: 'Waste & Defects', icon: AlertTriangle },
            { id: 'production', label: 'Production runs', icon: Droplets },
            { id: 'customers', label: 'Accounts Receivables', icon: Landmark },
            { id: 'inventory', label: 'Material Ledger', icon: Layers },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isSel = activeReport === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveReport(tab.id);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isSel
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100'
                }`}
              >
                <IconComp size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compiled Report Paper Sheet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm print-report-wrapper font-sans text-slate-700">
        {/* Banner only visible during print/PDF generation */}
        <div className="hidden print-header-logo flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
          <div>
            <h1 className="font-display font-black text-slate-900 text-base uppercase tracking-tight">Prime Plate Factory ERP</h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Sargodha Road, Gujranwala, Pakistan</p>
          </div>
          <div className="text-right">
            <h2 className="font-display font-extrabold text-slate-800 text-xs">OFFICIAL ERP STATEMENT</h2>
            <p className="text-[9px] text-slate-400 font-mono mt-1">Generated: {today}</p>
          </div>
        </div>

        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display font-black text-slate-800 text-base uppercase tracking-wider">{reportTitle}</h2>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Statement Range: <span className="font-mono text-slate-700">{startDate}</span> to <span className="font-mono text-slate-700">{endDate}</span>
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 shrink-0">
            Export Code: ERP-{activeReport.toUpperCase()}
          </span>
        </div>

        {/* Dynamic statistical summary blocks */}
        {summaryNode}

        {/* Main report tabular list */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                {reportHeaders.map((head, index) => (
                  <th key={index} className={`py-3 px-2 ${index > 2 && index < 7 && activeReport === 'sales' ? 'text-right' : ''}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reportRows.length > 0 ? (
                reportRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/20">
                    {row.map((cell: any, cIdx: number) => (
                      <td
                        key={cIdx}
                        className={`py-3 px-2 ${
                          cIdx === 0 && (activeReport === 'sales' || activeReport === 'customers')
                            ? 'font-mono font-bold text-indigo-600'
                            : ''
                        } ${activeReport === 'sales' && cIdx > 3 ? 'text-right font-mono' : ''}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={reportHeaders.length} className="py-12 text-center text-slate-400 font-semibold">
                    No matching ledger entries found for selected date-stamp query range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer print stamp */}
        <div className="hidden print-footer-log pt-10 border-t border-slate-100 mt-12 flex justify-between items-center text-[9px] text-slate-400">
          <span>Printed from Prime Plate ERP System securely.</span>
          <span>Authorized signature: ______________________</span>
        </div>
      </div>
    </div>
  );
}
