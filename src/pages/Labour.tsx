import React, { useMemo, useState } from 'react';
import { Users, Plus, Trash2, Edit2, CheckCircle, Wallet, Search, Calendar } from 'lucide-react';
import { db, getTodayStr } from '../utils/api';
import { LabourLedgerEntry, Operator } from '../types';

const stageOptions: Array<{ value: Operator['stage']; label: string }> = [
  { value: 'wet', label: 'Wet Production' },
  { value: 'dry', label: 'Dry Production' },
  { value: 'final', label: 'Final Production' },
  { value: 'waste', label: 'Waste Handling' },
];

export default function LabourPage() {
  const [operators, setOperators] = useState<Operator[]>(db.getOperators());
  const [ledger, setLedger] = useState<LabourLedgerEntry[]>(db.getLabourLedger());
  const [name, setName] = useState('');
  const [stage, setStage] = useState<Operator['stage']>('wet');
  const [ratePerPlate, setRatePerPlate] = useState(6);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredOperators = useMemo(() => {
    const q = search.toLowerCase();
    return operators.filter((operator) => {
      return !q || operator.name.toLowerCase().includes(q) || operator.stage.toLowerCase().includes(q);
    });
  }, [operators, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const updated = operators.map((operator) =>
        operator.id === editingId
          ? { ...operator, name: name.trim(), stage, ratePerPlate, updatedAt: getTodayStr() }
          : operator
      );
      db.saveOperators(updated);
      setOperators(updated);
      triggerToast('Operator updated.');
      setEditingId(null);
    } else {
      const newOperator: Operator = {
        id: 'op_' + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        stage,
        ratePerPlate,
        balanceDue: 0,
        status: 'active',
        createdAt: getTodayStr(),
      };
      const updated = [...operators, newOperator];
      db.saveOperators(updated);
      setOperators(updated);
      triggerToast('Operator added.');
    }

    setName('');
    setStage('wet');
    setRatePerPlate(6);
  };

  const handleEdit = (operator: Operator) => {
    setEditingId(operator.id);
    setName(operator.name);
    setStage(operator.stage);
    setRatePerPlate(operator.ratePerPlate);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this operator?')) return;
    const updated = operators.filter((operator) => operator.id !== id);
    db.saveOperators(updated);
    setOperators(updated);
    setLedger(ledger.filter((entry) => entry.operatorId !== id));
    db.saveLabourLedger(ledger.filter((entry) => entry.operatorId !== id));
    triggerToast('Operator removed.');
  };

  const handlePayment = (operator: Operator) => {
    const amount = Number(prompt(`Enter payment amount for ${operator.name}`));
    if (!Number.isFinite(amount) || amount <= 0) return;

    const entry: LabourLedgerEntry = {
      id: 'labour_' + Math.random().toString(36).substr(2, 9),
      operatorId: operator.id,
      operatorName: operator.name,
      date: getTodayStr(),
      stage: operator.stage,
      plates: 0,
      ratePerPlate: operator.ratePerPlate,
      amount: amount,
      type: 'payment',
      referenceId: 'manual_payment',
      notes: 'Manual payment recorded',
      createdAt: getTodayStr(),
    };

    const updatedLedger = [...ledger, entry];
    const updatedOperators = operators.map((item) =>
      item.id === operator.id ? { ...item, balanceDue: Math.max(0, item.balanceDue - amount) } : item
    );
    db.saveLabourLedger(updatedLedger);
    db.saveOperators(updatedOperators);
    setLedger(updatedLedger);
    setOperators(updatedOperators);
    triggerToast('Payment recorded.');
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 bg-emerald-600 text-white rounded-xl border border-emerald-500 flex items-center gap-2 text-xs font-semibold shadow-lg">
          <CheckCircle size={16} />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-display font-bold text-slate-800 text-sm mb-1">Operator Directory</h3>
          <p className="text-[11px] text-slate-400 font-medium mb-5">Manage wet, dry, final, and waste operators with simple labour rates.</p>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold uppercase tracking-wider mb-1">Operator Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50 text-slate-800" />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold uppercase tracking-wider mb-1">Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value as Operator['stage'])} className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50 text-slate-800">
                {stageOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold uppercase tracking-wider mb-1">Rate per Plate (Rs)</label>
              <input type="number" min="0" value={ratePerPlate} onChange={(e) => setRatePerPlate(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50 text-slate-800" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all">
              {editingId ? 'Save Operator' : 'Add Operator'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm">Operators & Labour Balances</h3>
              <p className="text-[11px] text-slate-400 font-medium">Track who works each stage and the amount still outstanding.</p>
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search operator" className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-100 bg-slate-50" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredOperators.map((operator) => (
              <div key={operator.id} className="border border-slate-100 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-indigo-600" />
                    <p className="font-semibold text-slate-800">{operator.name}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Stage: {stageOptions.find((item) => item.value === operator.stage)?.label}</p>
                  <p className="text-[10px] text-slate-500">Rate: Rs {operator.ratePerPlate} / plate • Balance: Rs {operator.balanceDue}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(operator)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-50"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(operator.id)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-50"><Trash2 size={14} /></button>
                  <button onClick={() => handlePayment(operator)} className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                    <Wallet size={14} /> Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm">Labour Ledger</h3>
            <p className="text-[11px] text-slate-400 font-medium">Earnings and payment entries for each operator.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Operator</th>
                <th className="py-3 px-2">Stage</th>
                <th className="py-3 px-2 text-right">Plates</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {ledger.length > 0 ? [...ledger].reverse().map((entry) => (
                <tr key={entry.id} className="border-b border-slate-50">
                  <td className="py-3 px-2 font-mono text-slate-600">{entry.date}</td>
                  <td className="py-3 px-2 font-semibold text-slate-800">{entry.operatorName}</td>
                  <td className="py-3 px-2 text-slate-600">{entry.stage}</td>
                  <td className="py-3 px-2 text-right font-mono">{entry.plates}</td>
                  <td className="py-3 px-2 text-right font-mono">Rs {entry.amount}</td>
                  <td className="py-3 px-2 capitalize text-slate-600">{entry.type}</td>
                </tr>
              )) : <tr><td colSpan={6} className="py-6 text-center text-slate-400">No labour entries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
