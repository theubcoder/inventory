'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navigation({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: '📊' },
    { id: 'products', label: t('products'), icon: '📦' },
    { id: 'sales', label: t('sales'), icon: '💰' },
    { id: 'loans', label: t('loanHistory'), icon: '📜' },
    { id: 'ograi', label: t('ograi'), icon: '🌾' },
    { id: 'returns', label: t('returns'), icon: '↩️' },
    { id: 'reports', label: t('reports'), icon: '📈' },
  ];

  return (
    <div className={`navigation ${isCollapsed ? 'collapsed' : ''}`}>
      <style jsx>{`
        .navigation {
          width: 280px;
          height: 100vh;
          background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
          position: fixed;
          left: 0;
          top: 0;
          transition: all 0.3s ease;
          box-shadow: 5px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        [dir="rtl"] .navigation {
          left: auto;
          right: 0;
          box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
        }

        .navigation.collapsed {
          width: 80px;
        }

        .nav-header {
          padding: 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: bold;
          color: white;
          transition: opacity 0.3s ease;
        }

        .navigation.collapsed .logo-text {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 18px;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .nav-menu {
          padding: 20px 15px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 14px 15px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .menu-item.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: white;
        }

        .menu-icon {
          font-size: 22px;
          min-width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-label {
          color: white;
          font-size: 15px;
          font-weight: 500;
          margin-left: 12px;
          transition: opacity 0.3s ease;
        }

        .navigation.collapsed .menu-label {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .nav-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
        }

        .user-details {
          flex: 1;
          transition: opacity 0.3s ease;
        }

        .user-name {
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .user-role {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .navigation.collapsed .user-details {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .logout-btn {
          background: rgba(239, 68, 68, 0.2);
          border: none;
          padding: 10px;
          border-radius: 8px;
          color: #fca5a5;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 15px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          color: white;
        }

        .navigation.collapsed .logout-btn span {
          display: none;
        }

        .language-toggle {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          padding: 10px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 10px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .language-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .navigation.collapsed .language-toggle span {
          display: none;
        }

        @media (max-width: 768px) {
          .navigation {
            transform: translateX(-100%);
          }

          .navigation.mobile-open {
            transform: translateX(0);
          }

          .navigation.collapsed {
            width: 280px;
          }
        }

        .tooltip {
          position: absolute;
          left: 70px;
          background: #1f2937;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .navigation.collapsed .menu-item:hover .tooltip {
          opacity: 1;
        }

        .mobile-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 101;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      <button className="mobile-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        ☰
      </button>

      <div className="nav-header">
        <div className="nav-logo">
          <div className="logo-icon">📦</div>
          <span className="logo-text">{t('inventoryPro')}</span>
        </div>
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="nav-menu">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            {isCollapsed && <span className="tooltip">{item.label}</span>}
          </div>
        ))}
      </div>

      <div className="nav-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <div className="user-name">{t('adminUser')}</div>
            <div className="user-role">{t('storeManager')}</div>
          </div>
        </div>
        <button className="language-toggle" onClick={toggleLanguage}>
          🌐 <span>{language === 'en' ? 'اردو' : 'English'}</span>
        </button>
        <button className="logout-btn">
          🚪 <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}