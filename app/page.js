'use client';

import { useState } from 'react';
import Navigation from './MyComponents/Navigation';
import Dashboard from './MyComponents/Dashboard';
import ProductManagement from './MyComponents/ProductManagement';
import SalesPOS from './MyComponents/SalesPOS';
import Ograi from './MyComponents/Ograi';
import Returns from './MyComponents/Returns';
import Reports from './MyComponents/Reports';
import LoanManagement from './MyComponents/LoanManagement';
import { LanguageProvider } from './contexts/LanguageContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'sales':
        return <SalesPOS />;
      case 'ograi':
        return <Ograi />;
      case 'returns':
        return <Returns />;
      case 'reports':
        return <Reports />;
      case 'loans':
        return <LoanManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LanguageProvider>
      <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content" style={{ 
          minHeight: '100vh',
          transition: 'all 0.3s ease',
          overflow: 'auto'
        }}>
          {renderContent()}
        </div>
      
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .main-content {
          margin-left: 280px;
        }

        [dir="rtl"] .main-content {
          margin-left: 0 !important;
          margin-right: 280px;
        }

        .navigation.collapsed + .main-content {
          margin-left: 80px;
        }

        [dir="rtl"] .navigation.collapsed + .main-content {
          margin-left: 0 !important;
          margin-right: 80px;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
      </div>
    </LanguageProvider>
  );
}
