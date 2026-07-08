import React from 'react';
import { Menu, Calendar, Clock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentTab: string;
  currentUser: User | null;
  onMenuToggle: () => void;
}

export default function Header({ currentTab, currentUser, onMenuToggle }: HeaderProps) {
  // Format tab title beautifully
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'inventory':
        return 'Raw Materials Inventory';
      case 'formulas':
        return 'Formula Settings';
      case 'wet-prod':
        return 'Wet Production Entry';
      case 'dry-prod':
        return 'Dry Production Entry';
      case 'final-prod':
        return 'Final Product Assembly';
      case 'waste':
        return 'Waste Tracking & Logs';
      case 'expenses':
        return 'Expense Management';
      case 'labour':
        return 'Labour & Operator Management';
      case 'customers':
        return 'Customer Ledgers & Directory';
      case 'sales':
        return 'Sales Operations';
      case 'invoices':
        return 'Invoice History & Printing';
      case 'reports':
        return 'Analytics & Production Reports';
      default:
        return 'Factory ERP';
    }
  };

  const getTodayFormatted = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-30 no-print">
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 lg:hidden focus:outline-none"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="font-display font-bold text-slate-900 text-lg tracking-tight leading-tight">
            {getTabTitle(currentTab)}
          </h2>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold tracking-wider uppercase mt-0.5">
            <span>Production Hub</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">{currentTab.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Date, Time, and Status */}
      <div className="flex items-center gap-4">
        {/* Date badge */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-xs font-semibold font-sans">{getTodayFormatted()}</span>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-700 font-mono">SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
}
