import React from 'react';
import {
  LayoutDashboard,
  Package,
  Settings,
  Droplets,
  Sun,
  CheckSquare,
  Trash2,
  Receipt,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  Landmark,
  LogOut,
  X
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  isOpen,
  setIsOpen
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'formulas', name: 'Formula Settings', icon: Settings },
    { id: 'wet-prod', name: 'Wet Production', icon: Droplets },
    { id: 'dry-prod', name: 'Dry Production', icon: Sun },
    { id: 'final-prod', name: 'Final Production', icon: CheckSquare },
    { id: 'waste', name: 'Waste Management', icon: Trash2 },
    { id: 'expenses', name: 'Expenses', icon: Receipt },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'suppliers', name: 'Suppliers', icon: Landmark },
    { id: 'sales', name: 'Sales', icon: ShoppingCart },
    { id: 'invoices', name: 'Invoices', icon: FileText },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-50 flex flex-col w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg font-display shadow-sm shadow-indigo-100">
              P
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-900 text-sm tracking-tight leading-tight">PlatePro ERP</h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Production Hub</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info card */}
        <div className="p-4 mx-3 my-4 bg-slate-50/75 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-sm uppercase shadow-sm">
              {currentUser?.name?.slice(0, 2) || 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-800 truncate">{currentUser?.name || 'Administrator'}</h4>
              <p className="text-[10px] text-slate-400 font-mono font-medium uppercase tracking-wider">{currentUser?.role || 'admin'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm shadow-indigo-100/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
