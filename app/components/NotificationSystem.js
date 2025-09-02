'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (message) => showNotification(message, 'success');
  const showError = (message) => showNotification(message, 'error');
  const showWarning = (message) => showNotification(message, 'warning');
  const showInfo = (message) => showNotification(message, 'info');

  return (
    <NotificationContext.Provider value={{ 
      showNotification, 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo,
      removeNotification 
    }}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

function NotificationContainer({ notifications, removeNotification }) {
  return (
    <div className="notification-container">
      <style jsx>{`
        .notification-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          pointer-events: none;
          max-width: 90%;
        }

        .notification {
          pointer-events: all;
          min-width: 400px;
          max-width: 500px;
          padding: 24px 28px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
          background: white;
        }
        
        .notification.error {
          animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), shake 0.5s ease-in-out;
        }

        .notification::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: currentColor;
        }

        .notification.success {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          color: #14532d;
          border: 2px solid #10b981;
        }
        
        .notification.success::before {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .notification.error {
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          color: #991b1b;
          border: 2px solid #ef4444;
          box-shadow: 0 25px 60px rgba(239, 68, 68, 0.4);
        }
        
        .notification.error::before {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          width: 6px;
        }

        .notification.warning {
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          color: #78350f;
          border: 2px solid #f59e0b;
        }
        
        .notification.warning::before {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .notification.info {
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
          color: #4c1d95;
          border: 2px solid #667eea;
        }
        
        .notification.info::before {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .notification-icon {
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: currentColor;
          border-radius: 50%;
          color: white;
        }
        
        .notification.success .notification-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .notification.error .notification-icon {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.5);
          animation: pulse 2s infinite;
        }
        
        .notification.warning .notification-icon {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        .notification.info .notification-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .notification-message {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.5;
          margin: 0 16px;
        }
        
        .notification.error .notification-message {
          font-size: 17px;
          font-weight: 700;
        }

        .notification-close {
          background: transparent;
          border: none;
          color: currentColor;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 24px;
          opacity: 0.6;
        }

        .notification-close:hover {
          opacity: 1;
          transform: rotate(90deg);
          background: rgba(0, 0, 0, 0.05);
        }

        .notification-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }

        .notification-progress-bar {
          height: 100%;
          background: rgba(255, 255, 255, 0.7);
          animation: progress 4s linear forwards;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-10px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(10px);
          }
        }

        @media (max-width: 640px) {
          .notification-container {
            left: 10px;
            right: 10px;
            top: 10px;
          }

          .notification {
            min-width: auto;
            max-width: 100%;
          }
        }
      `}</style>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function Notification({ id, message, type, onClose }) {
  const icons = {
    success: '✓',
    error: '✖',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {icons[type]}
        </div>
        <div className="notification-message">
          {message}
        </div>
      </div>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
      <div className="notification-progress">
        <div className="notification-progress-bar" />
      </div>
    </div>
  );
}

// Confirm Dialog Component
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <style jsx>{`
        .confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        .confirm-dialog {
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 440px;
          width: 90%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .confirm-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .confirm-message {
          font-size: 16px;
          color: #4b5563;
          line-height: 1.5;
          margin-bottom: 28px;
        }

        .confirm-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .confirm-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .confirm-btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .confirm-btn-cancel:hover {
          background: #e5e7eb;
          transform: translateY(-2px);
        }

        .confirm-btn-confirm {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .confirm-btn-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div className="confirm-dialog">
        <div className="confirm-title">{title}</div>
        <div className="confirm-message">{message}</div>
        <div className="confirm-buttons">
          <button className="confirm-btn confirm-btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className="confirm-btn confirm-btn-confirm" onClick={() => {
            onConfirm();
            onClose();
          }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for confirm dialog
export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({});
  const [resolver, setResolver] = useState(null);

  const confirm = (options) => {
    return new Promise((resolve) => {
      setConfig(options);
      setIsOpen(true);
      setResolver(() => resolve);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    resolver && resolver(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolver && resolver(true);
  };

  const ConfirmComponent = () => (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      {...config}
    />
  );

  return { confirm, ConfirmComponent };
}