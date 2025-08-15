'use client';

import { useState, useEffect } from 'react';

export default function Returns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recentReturns, setRecentReturns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await fetch('/api/returns');
      const data = await response.json();
      setRecentReturns(data.map(ret => ({
        id: ret.id,
        saleId: ret.saleId,
        date: new Date(ret.createdAt).toLocaleDateString(),
        customer: ret.customer?.name || 'Walk-in Customer',
        items: ret.returnItems?.length || 0,
        amount: parseFloat(ret.refundAmount),
        status: ret.status,
        reason: ret.reason
      })));
    } catch (error) {
      console.error('Error fetching returns:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      alert('Please enter a sale ID or phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/sales?search=${searchTerm}`);
      const sales = await response.json();
      
      if (sales && sales.length > 0) {
        const sale = sales[0];
        setSelectedSale({
          id: sale.id,
          date: new Date(sale.createdAt).toLocaleDateString(),
          customer: sale.customer || { name: 'Walk-in Customer' },
          items: sale.saleItems.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: parseFloat(item.unitPrice),
            quantity: item.quantity,
            returnable: true
          })),
          total: parseFloat(sale.totalAmount)
        });
        setReturnItems(sale.saleItems.map(item => ({ 
          ...item,
          productId: item.productId,
          name: item.product.name,
          price: parseFloat(item.unitPrice),
          quantity: item.quantity,
          selected: false, 
          returnQty: 0 
        })));
      } else {
        alert('Sale not found! Please check the sale ID or phone number.');
      }
    } catch (error) {
      console.error('Error searching sale:', error);
      alert('Error searching sale');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (itemId) => {
    setReturnItems(returnItems.map(item =>
      item.id === itemId
        ? { ...item, selected: !item.selected, returnQty: item.selected ? 0 : 1 }
        : item
    ));
  };

  const updateReturnQuantity = (itemId, qty) => {
    setReturnItems(returnItems.map(item =>
      item.id === itemId
        ? { ...item, returnQty: Math.min(Math.max(0, qty), item.quantity) }
        : item
    ));
  };

  const calculateReturnAmount = () => {
    return returnItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.returnQty), 0);
  };

  const processReturn = async () => {
    const selectedItems = returnItems.filter(item => item.selected && item.returnQty > 0);
    
    if (selectedItems.length === 0) {
      alert('Please select items to return');
      return;
    }

    if (!returnReason) {
      alert('Please provide a reason for return');
      return;
    }

    setLoading(true);
    try {
      const returnData = {
        saleId: selectedSale.id,
        customerId: selectedSale.customer?.id || null,
        reason: returnReason,
        items: selectedItems.map(item => ({
          productId: item.productId,
          quantity: item.returnQty,
          unitPrice: item.price
        })),
        processedBy: 'Staff'
      };

      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
      });

      if (response.ok) {
        setShowConfirmation(true);
        await fetchReturns();
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSelectedSale(null);
          setReturnItems([]);
          setReturnReason('');
          setSearchTerm('');
          setShowConfirmation(false);
        }, 3000);
      } else {
        alert('Failed to process return');
      }
    } catch (error) {
      console.error('Error processing return:', error);
      alert('Error processing return');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="returns">
      <style jsx>{`
        .returns {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          min-height: 100vh;
        }

        .returns-container {
          padding: 30px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 36px;
          font-weight: bold;
          color: white;
          margin-bottom: 10px;
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
        }

        .main-content {
          display: flex;
          gap: 25px;
        }

        .left-section {
          flex: 1;
        }

        .right-section {
          width: 400px;
        }

        .search-section {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .search-form {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }

        .search-input {
          flex: 1;
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .search-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4);
        }

        .sale-details {
          background: #fef3c7;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .sale-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .sale-id {
          font-size: 18px;
          font-weight: 600;
          color: #92400e;
        }

        .sale-date {
          color: #78350f;
          font-size: 14px;
        }

        .customer-info {
          font-size: 14px;
          color: #78350f;
          margin-bottom: 15px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .item-card {
          background: white;
          border-radius: 12px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .item-card:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .item-card.selected {
          background: #fef3c7;
          border: 2px solid #f59e0b;
        }

        .item-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .item-card.selected .item-checkbox {
          background: #f59e0b;
          border-color: #f59e0b;
          color: white;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .item-price {
          font-size: 14px;
          color: #6b7280;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .qty-btn:hover {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }

        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qty-display {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          min-width: 20px;
          text-align: center;
        }

        .reason-section {
          margin-top: 20px;
        }

        .reason-textarea {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          resize: vertical;
          min-height: 100px;
          transition: all 0.3s ease;
        }

        .reason-textarea:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .return-summary {
          background: #fef3c7;
          border-radius: 12px;
          padding: 15px;
          margin-top: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .summary-label {
          color: #78350f;
        }

        .summary-value {
          color: #92400e;
          font-weight: 600;
        }

        .process-btn {
          width: 100%;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 20px;
        }

        .process-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
        }

        .process-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .recent-returns {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .returns-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .return-item {
          background: #f9fafb;
          border-radius: 12px;
          padding: 15px;
          transition: all 0.3s ease;
        }

        .return-item:hover {
          background: #f3f4f6;
        }

        .return-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .return-id {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .return-status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-completed {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-processing {
          background: #fef3c7;
          color: #d97706;
        }

        .return-details {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
        }

        .return-amount {
          font-size: 16px;
          font-weight: 600;
          color: #dc2626;
          margin-top: 8px;
        }

        .confirmation-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          text-align: center;
        }

        .confirmation-icon {
          font-size: 60px;
          margin-bottom: 20px;
        }

        .confirmation-title {
          font-size: 24px;
          font-weight: bold;
          color: #16a34a;
          margin-bottom: 10px;
        }

        .confirmation-message {
          font-size: 16px;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 60px;
          margin-bottom: 15px;
        }

        .empty-text {
          font-size: 16px;
        }

        .returns-info-section {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          color: white;
        }

        .returns-info-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .returns-info-description {
          font-size: 14px;
          opacity: 0.95;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .returns {
            padding: 20px;
          }

          .main-content {
            flex-direction: column;
          }

          .right-section {
            width: 100%;
          }

          .page-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="returns-container">
        <div className="page-header">
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>Returns & Refunds</h1>
          <p className="page-subtitle" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px' }}>Process product returns and manage refunds</p>
        </div>
        
        <div className="main-content">
          <div className="left-section">

          {selectedSale ? (
            <div className="search-section">
              <div className="sale-details">
                <div className="sale-header">
                  <span className="sale-id">Sale #{selectedSale.id}</span>
                  <span className="sale-date">{selectedSale.date}</span>
                </div>
                <div className="customer-info">
                  <strong>Customer:</strong> {selectedSale.customer.name}<br />
                  <strong>Phone:</strong> {selectedSale.customer.phone}
                </div>
              </div>

              <div className="section-title">Select Items to Return</div>
              <div className="items-list">
                {returnItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`item-card ${item.selected ? 'selected' : ''}`}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <div className="item-checkbox">
                      {item.selected && '✓'}
                    </div>
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">
                        PKR {item.price} × {item.quantity} = PKR {item.price * item.quantity}
                      </div>
                    </div>
                    {item.selected && (
                      <div className="quantity-selector" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="qty-btn"
                          onClick={() => updateReturnQuantity(item.id, item.returnQty - 1)}
                          disabled={item.returnQty <= 1}
                        >
                          -
                        </button>
                        <span className="qty-display">{item.returnQty}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateReturnQuantity(item.id, item.returnQty + 1)}
                          disabled={item.returnQty >= item.quantity}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="reason-section">
                <div className="section-title">Reason for Return</div>
                <textarea
                  className="reason-textarea"
                  placeholder="Please provide a reason for the return..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                />
              </div>

              <div className="return-summary">
                <div className="summary-row">
                  <span className="summary-label">Items to Return:</span>
                  <span className="summary-value">
                    {returnItems.filter(item => item.selected).length}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Refund Amount:</span>
                  <span className="summary-value">
                    PKR {calculateReturnAmount().toLocaleString()}
                  </span>
                </div>
              </div>

              <button 
                className="process-btn"
                onClick={processReturn}
                disabled={!returnItems.some(item => item.selected) || !returnReason}
              >
                Process Return
              </button>
            </div>
          ) : (
            <div className="search-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-text">
                  Search for a sale to process return
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="right-section">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="search-section">
              <h2 className="section-title">Find Sale</h2>
              <div className="search-form">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter Sale ID or Customer Phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn" onClick={handleSearch}>
                  Search
                </button>
              </div>
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#6b7280', fontSize: '14px' }}>
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔍</div>
                Search for a sale to process return
              </div>
            </div>

            <div className="recent-returns">
              <h2 className="section-title">Recent Returns</h2>
              <div className="returns-list">
                {recentReturns.length > 0 ? (
                  recentReturns.map(returnItem => (
                    <div key={returnItem.id} className="return-item">
                      <div className="return-header">
                        <span className="return-id">Return #{returnItem.id}</span>
                        <span className={`return-status status-${returnItem.status.toLowerCase()}`}>
                          {returnItem.status}
                        </span>
                      </div>
                      <div className="return-details">
                        <strong>Date:</strong> {returnItem.date}<br />
                        <strong>Customer:</strong> {returnItem.customer}<br />
                        <strong>Items:</strong> {returnItem.items}<br />
                        <strong>Reason:</strong> {returnItem.reason}
                      </div>
                      <div className="return-amount">
                        Refund: PKR {returnItem.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                    <div style={{ fontSize: '30px', marginBottom: '10px' }}>📦</div>
                    No recent returns
                  </div>
                )}
              </div>
            </div>

            <div className="returns-info-section">
              <h3 className="returns-info-title">Returns & Refunds</h3>
              <p className="returns-info-description">Process product returns and manage refunds</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-icon">✅</div>
          <div className="confirmation-title">Return Processed Successfully!</div>
          <div className="confirmation-message">
            The return has been processed and inventory has been updated.
          </div>
        </div>
      )}
    </div>
  );
}