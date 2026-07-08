export type AppLanguage = 'en' | 'ur';

export const LANGUAGE_STORAGE_KEY = 'factory_erp_ui_language';

const translations = {
  en: {
    productionHub: 'Production Hub',
    systemOnline: 'SYSTEM ONLINE',
    language: 'Language',
    english: 'English',
    urdu: 'اردو',
    overviewDashboard: 'Overview Dashboard',
    rawMaterialsInventory: 'Raw Materials Inventory',
    formulaSettings: 'Formula Settings',
    wetProductionEntry: 'Wet Production Entry',
    dryProductionEntry: 'Dry Production Entry',
    finalProductAssembly: 'Final Product Assembly',
    wasteTrackingAndLogs: 'Waste Tracking & Logs',
    expenseManagement: 'Expense Management',
    labourAndOperatorManagement: 'Labour & Operator Management',
    customerLedgersAndDirectory: 'Customer Ledgers & Directory',
    salesOperations: 'Sales Operations',
    invoiceHistoryAndPrinting: 'Invoice History & Printing',
    analyticsAndProductionReports: 'Analytics & Production Reports',
    factoryErp: 'Factory ERP',
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    formulas: 'Formula Settings',
    wetProd: 'Wet Production',
    dryProd: 'Dry Production',
    finalProd: 'Final Production',
    waste: 'Waste Management',
    expenses: 'Expenses',
    labour: 'Labour',
    customers: 'Customers',
    suppliers: 'Suppliers',
    sales: 'Sales',
    invoices: 'Invoices',
    reports: 'Reports',
    signOut: 'Sign Out',
    admin: 'Admin',
    staff: 'Staff',
  },
  ur: {
    productionHub: 'پروڈکشن ہب',
    systemOnline: 'سسٹم آن لائن',
    language: 'زبان',
    english: 'English',
    urdu: 'اردو',
    overviewDashboard: 'اوورویو ڈیش بورڈ',
    rawMaterialsInventory: 'خام مال کی انوینٹری',
    formulaSettings: 'فارمولہ سیٹنگز',
    wetProductionEntry: 'گیل Production اندراج',
    dryProductionEntry: 'خشک Production اندراج',
    finalProductAssembly: 'حتمی مصنوعات کی اسمبلی',
    wasteTrackingAndLogs: 'فضلہ نگرانی اور لاگز',
    expenseManagement: 'اخراجات کا انتظام',
    labourAndOperatorManagement: 'مزدوری اور آپریٹر کا انتظام',
    customerLedgersAndDirectory: 'کسٹمر لیجرز اور ڈائرکٹری',
    salesOperations: 'فروخت کی سرگرمیاں',
    invoiceHistoryAndPrinting: 'انوائس ہسٹری اور پرنٹنگ',
    analyticsAndProductionReports: 'تجزیات اور پروڈکشن رپورٹس',
    factoryErp: 'فیکٹری ERP',
    dashboard: 'ڈیش بورڈ',
    inventory: 'انوینٹری',
    formulas: 'فارمولہ سیٹنگز',
    wetProd: 'گیلا پروڈکشن',
    dryProd: 'خشک پروڈکشن',
    finalProd: 'حتمی پروڈکشن',
    waste: 'فضلہ کا نظم',
    expenses: 'اخراجات',
    labour: 'مزدوری',
    customers: 'کسٹمرز',
    suppliers: 'سپلائرز',
    sales: 'فروخت',
    invoices: 'انوائسز',
    reports: 'رپورٹس',
    signOut: 'سائن آؤٹ',
    admin: 'ایڈمن',
    staff: 'اسٹاف',
  },
} as const;

export function getStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'ur' ? 'ur' : 'en';
}

export function setStoredLanguage(language: AppLanguage): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function getLanguageText(language: AppLanguage, key: keyof typeof translations.en): string {
  return translations[language][key] || translations.en[key] || key;
}
