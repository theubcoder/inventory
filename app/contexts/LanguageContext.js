'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    sales: 'Sales',
    returns: 'Returns',
    reports: 'Reports',
    inventoryManagement: 'Inventory Management',
    
    // Dashboard
    welcomeBack: 'Welcome back! Here\'s your business overview',
    todaysSales: 'Today\'s Sales',
    totalRevenue: 'Total Revenue',
    totalProducts: 'Total Products',
    lowStockItems: 'Low Stock Items',
    pendingReturns: 'Pending Returns',
    recentActivities: 'Recent Activities',
    viewAll: 'View All',
    fromYesterday: 'from yesterday',
    thisMonth: 'this month',
    requiresAttention: 'Requires attention',
    processSoon: 'Process soon',
    
    // Product Management
    productManagement: 'Product Management',
    addProduct: 'Add Product',
    addCategory: 'Add Category',
    categories: 'Categories',
    searchProducts: 'Search products...',
    allCategories: 'All Categories',
    price: 'Price',
    stock: 'Stock',
    minStock: 'Min Stock',
    category: 'Category',
    description: 'Description',
    barcode: 'Barcode',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    addNewProduct: 'Add New Product',
    editProduct: 'Edit Product',
    productName: 'Product Name',
    quantity: 'Quantity',
    minimumStock: 'Minimum Stock',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    
    // Sales POS
    searchProductsBarcode: 'Search by name or scan barcode...',
    shoppingCart: 'Shopping Cart',
    items: 'items',
    emptyCart: 'Your cart is empty',
    addItemsToStart: 'Add items to get started',
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',
    checkout: 'Checkout',
    customerInfo: 'Customer Information',
    customerName: 'Customer Name',
    phone: 'Phone',
    email: 'Email',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    card: 'Card',
    processSale: 'Process Sale',
    receipt: 'Receipt',
    paymentSuccessful: 'Payment Successful!',
    saleId: 'Sale ID',
    date: 'Date',
    printReceipt: 'Print Receipt',
    
    // Returns
    returnsExchange: 'Returns & Exchange',
    processReturns: 'Process returns quickly and efficiently',
    searchSale: 'Search Sale',
    searchByIdPhone: 'Enter Sale ID or Customer Phone',
    search: 'Search',
    saleDetails: 'Sale Details',
    customer: 'Customer',
    selectItemsReturn: 'Select Items to Return',
    returnQuantity: 'Return Quantity',
    returnReason: 'Return Reason',
    processReturn: 'Process Return',
    recentReturns: 'Recent Returns',
    reason: 'Reason',
    status: 'Status',
    amount: 'Amount',
    processing: 'Processing',
    completed: 'Completed',
    
    // Reports
    reportsAnalytics: 'Reports & Analytics',
    exportPdf: 'Export PDF',
    exportExcel: 'Export Excel',
    salesReport: 'Sales Report',
    inventoryReport: 'Inventory Report',
    financialReport: 'Financial Report',
    totalSales: 'Total Sales',
    unitsSold: 'Units Sold',
    averageOrderValue: 'Average Order Value',
    dailySalesTrend: 'Daily Sales Trend',
    topSellingProducts: 'Top Selling Products',
    salesByCategory: 'Sales by Category',
    revenue: 'Revenue',
    lowStockAlert: 'Low Stock Alert',
    stockValue: 'Stock Value',
    current: 'Current',
    minimum: 'Minimum',
    totalExpenses: 'Total Expenses',
    netProfit: 'Net Profit',
    profitMargin: 'Profit Margin',
    expenseBreakdown: 'Expense Breakdown',
    
    // Common
    loading: 'Loading...',
    noDataFound: 'No data found',
    confirmDelete: 'Are you sure you want to delete this?',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    required: 'Required',
    optional: 'Optional',
    actions: 'Actions',
    from: 'from',
    to: 'to',
    all: 'All',
    new: 'New',
    units: 'units',
    perTransaction: 'Per transaction',
    activeCategories: 'Active categories',
    inInventory: 'In inventory',
    critical: 'Critical',
    totalInventoryValue: 'Total inventory value'
  },
  
  ur: {
    // Navigation
    dashboard: 'ڈیش بورڈ',
    products: 'مصنوعات',
    sales: 'فروخت',
    returns: 'واپسی',
    reports: 'رپورٹس',
    inventoryManagement: 'انوینٹری منیجمنٹ',
    
    // Dashboard
    welcomeBack: 'خوش آمدید! آپ کے کاروبار کا جائزہ',
    todaysSales: 'آج کی فروخت',
    totalRevenue: 'کل آمدنی',
    totalProducts: 'کل مصنوعات',
    lowStockItems: 'کم اسٹاک آئٹمز',
    pendingReturns: 'زیر التواء واپسیاں',
    recentActivities: 'حالیہ سرگرمیاں',
    viewAll: 'سب دیکھیں',
    fromYesterday: 'کل سے',
    thisMonth: 'اس ماہ',
    requiresAttention: 'توجہ درکار',
    processSoon: 'جلد پروسیس کریں',
    
    // Product Management
    productManagement: 'پروڈکٹ منیجمنٹ',
    addProduct: 'پروڈکٹ شامل کریں',
    addCategory: 'کیٹیگری شامل کریں',
    categories: 'کیٹیگریز',
    searchProducts: 'پروڈکٹ تلاش کریں...',
    allCategories: 'تمام کیٹیگریز',
    price: 'قیمت',
    stock: 'اسٹاک',
    minStock: 'کم سے کم اسٹاک',
    category: 'کیٹیگری',
    description: 'تفصیل',
    barcode: 'بار کوڈ',
    edit: 'ترمیم',
    delete: 'حذف کریں',
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    addNewProduct: 'نیا پروڈکٹ شامل کریں',
    editProduct: 'پروڈکٹ میں ترمیم',
    productName: 'پروڈکٹ کا نام',
    quantity: 'مقدار',
    minimumStock: 'کم سے کم اسٹاک',
    inStock: 'دستیاب',
    lowStock: 'کم اسٹاک',
    outOfStock: 'اسٹاک ختم',
    
    // Sales POS
    searchProductsBarcode: 'نام سے تلاش کریں یا بارکوڈ اسکین کریں...',
    shoppingCart: 'شاپنگ کارٹ',
    items: 'آئٹمز',
    emptyCart: 'آپ کا کارٹ خالی ہے',
    addItemsToStart: 'شروع کرنے کے لیے آئٹمز شامل کریں',
    subtotal: 'ذیلی کل',
    tax: 'ٹیکس',
    total: 'کل',
    checkout: 'چیک آؤٹ',
    customerInfo: 'گاہک کی معلومات',
    customerName: 'گاہک کا نام',
    phone: 'فون',
    email: 'ای میل',
    paymentMethod: 'ادائیگی کا طریقہ',
    cash: 'نقد',
    card: 'کارڈ',
    processSale: 'فروخت پروسیس کریں',
    receipt: 'رسید',
    paymentSuccessful: 'ادائیگی کامیاب!',
    saleId: 'فروخت آئی ڈی',
    date: 'تاریخ',
    printReceipt: 'رسید پرنٹ کریں',
    
    // Returns
    returnsExchange: 'واپسی اور تبدیلی',
    processReturns: 'واپسیوں کو جلدی اور مؤثر طریقے سے پروسیس کریں',
    searchSale: 'فروخت تلاش کریں',
    searchByIdPhone: 'سیل آئی ڈی یا فون نمبر درج کریں',
    search: 'تلاش',
    saleDetails: 'فروخت کی تفصیلات',
    customer: 'گاہک',
    selectItemsReturn: 'واپسی کے لیے آئٹمز منتخب کریں',
    returnQuantity: 'واپسی کی مقدار',
    returnReason: 'واپسی کی وجہ',
    processReturn: 'واپسی پروسیس کریں',
    recentReturns: 'حالیہ واپسیاں',
    reason: 'وجہ',
    status: 'حالت',
    amount: 'رقم',
    processing: 'پروسیسنگ',
    completed: 'مکمل',
    
    // Reports
    reportsAnalytics: 'رپورٹس اور تجزیات',
    exportPdf: 'پی ڈی ایف ایکسپورٹ',
    exportExcel: 'ایکسل ایکسپورٹ',
    salesReport: 'سیلز رپورٹ',
    inventoryReport: 'انوینٹری رپورٹ',
    financialReport: 'مالیاتی رپورٹ',
    totalSales: 'کل فروخت',
    unitsSold: 'فروخت شدہ یونٹس',
    averageOrderValue: 'اوسط آرڈر ویلیو',
    dailySalesTrend: 'روزانہ فروخت کا رجحان',
    topSellingProducts: 'سب سے زیادہ فروخت ہونے والی مصنوعات',
    salesByCategory: 'کیٹیگری کے حساب سے فروخت',
    revenue: 'آمدنی',
    lowStockAlert: 'کم اسٹاک الرٹ',
    stockValue: 'اسٹاک کی قیمت',
    current: 'موجودہ',
    minimum: 'کم سے کم',
    totalExpenses: 'کل اخراجات',
    netProfit: 'خالص منافع',
    profitMargin: 'منافع مارجن',
    expenseBreakdown: 'اخراجات کی تفصیل',
    
    // Common
    loading: 'لوڈ ہو رہا ہے...',
    noDataFound: 'کوئی ڈیٹا نہیں ملا',
    confirmDelete: 'کیا آپ واقعی اسے حذف کرنا چاہتے ہیں؟',
    success: 'کامیابی',
    error: 'خرابی',
    warning: 'انتباہ',
    info: 'معلومات',
    required: 'ضروری',
    optional: 'اختیاری',
    actions: 'اعمال',
    from: 'سے',
    to: 'تک',
    all: 'تمام',
    new: 'نیا',
    units: 'یونٹس',
    perTransaction: 'فی ٹرانزیکشن',
    activeCategories: 'فعال کیٹیگریز',
    inInventory: 'انوینٹری میں',
    critical: 'شدید',
    totalInventoryValue: 'کل انوینٹری کی قیمت'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    document.dir = savedLang === 'ur' ? 'rtl' : 'ltr';
  }, []);
  
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ur' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.dir = newLang === 'ur' ? 'rtl' : 'ltr';
  };
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}