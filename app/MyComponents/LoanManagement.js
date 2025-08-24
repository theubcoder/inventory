'use client';

import { useState, useEffect } from 'react';

export default function LoanManagement() {
  const [pendingSales, setPendingSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, partial

  useEffect(() => {
    fetchPendingSales();
  }, []);

  const fetchPendingSales = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch('/api/payment-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pending' })
      });
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPendingSales(data);
      } else {
        console.error('Invalid data format received:', data);
        setPendingSales([]);
      }
    } catch (error) {
      console.error('Error fetching pending sales:', error);
      setPendingSales([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedSale || !paymentAmount) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/sales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saleId: selectedSale.id,
          amountPaid: parseFloat(paymentAmount),
          paymentMethod,
          notes: paymentNotes
        })
      });

      if (response.ok) {
        alert('Payment recorded successfully!');
        setShowPaymentModal(false);
        setSelectedSale(null);
        setPaymentAmount('');
        setPaymentNotes('');
        setPaymentMethod('cash');
        fetchPendingSales();
      } else {
        alert('Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Error recording payment');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = (Array.isArray(pendingSales) ? pendingSales : []).filter(sale => {
    const matchesSearch = 
      sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer?.phone?.includes(searchTerm) ||
      sale.id.toString().includes(searchTerm);
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'pending' && sale.paymentStatus === 'pending') ||
      (filterStatus === 'partial' && sale.paymentStatus === 'partial');
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="loan-management">
      <style jsx>{`
        .loan-management {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .header {
          background: white;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .controls {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 250px;
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-select {
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          background: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
        }

        .sales-table {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          text-align: left;
          padding: 12px;
          border-bottom: 2px solid #e5e7eb;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }

        .table td {
          padding: 12px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #1f2937;
        }

        .table tr:hover {
          background: #f9fafb;
        }

        .customer-info {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          font-weight: 600;
          color: #1f2937;
        }

        .customer-phone {
          font-size: 13px;
          color: #6b7280;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-pending {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-partial {
          background: #fef3c7;
          color: #d97706;
        }

        .status-paid {
          background: #d1fae5;
          color: #059669;
        }

        .amount-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .amount-total {
          font-weight: 600;
          color: #1f2937;
        }

        .amount-paid {
          font-size: 13px;
          color: #059669;
        }

        .amount-remaining {
          font-size: 13px;
          color: #dc2626;
        }

        .action-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .view-btn {
          background: #f3f4f6;
          color: #374151;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-right: 8px;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          background: #e5e7eb;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 20px;
          padding: 30px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .modal-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
        }

        .close-btn:hover {
          color: #1f2937;
        }

        .sale-details {
          background: #f9fafb;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .detail-label {
          color: #6b7280;
        }

        .detail-value {
          color: #1f2937;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 10px;
        }

        .payment-option {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .payment-option.selected {
          border-color: #667eea;
          background: #eff6ff;
          color: #667eea;
          font-weight: 600;
        }

        .textarea {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          resize: vertical;
          min-height: 80px;
        }

        .textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }

        .submit-btn {
          flex: 1;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cancel-btn {
          flex: 1;
          background: #f3f4f6;
          color: #374151;
          border: none;
          padding: 12px 25px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 60px;
          margin-bottom: 15px;
        }

        .empty-text {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .empty-subtext {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
          }

          .search-input {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .payment-methods {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="header">
        <h1 className="title">Loan & Credit Management</h1>
        <div className="controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search by customer name, phone, or sale ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Outstanding</option>
            <option value="pending">Pending (No Payment)</option>
            <option value="partial">Partial Payment</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Outstanding Sales</div>
          <div className="stat-value">{isLoadingData ? '...' : (Array.isArray(pendingSales) ? pendingSales.length : 0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Outstanding Amount</div>
          <div className="stat-value">
            {isLoadingData ? '...' : `PKR ${(Array.isArray(pendingSales) ? pendingSales : []).reduce((sum, sale) => sum + parseFloat(sale.remainingAmount || 0), 0).toLocaleString()}`}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Collected</div>
          <div className="stat-value">
            {isLoadingData ? '...' : `PKR ${(Array.isArray(pendingSales) ? pendingSales : []).reduce((sum, sale) => sum + parseFloat(sale.amountPaid || 0), 0).toLocaleString()}`}
          </div>
        </div>
      </div>

      <div className="sales-table">
        {isLoadingData ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <div className="empty-text">Loading...</div>
            <div className="empty-subtext">Fetching outstanding payments</div>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <div className="empty-text">No outstanding payments found</div>
            <div className="empty-subtext">All sales have been fully paid</div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount Details</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id}>
                  <td>#{sale.id}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{sale.customer?.name || 'Walk-in Customer'}</span>
                      {sale.customer?.phone && (
                        <span className="customer-phone">{sale.customer.phone}</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(sale.createdAt)}</td>
                  <td>
                    <span className={`status-badge status-${sale.paymentStatus}`}>
                      {sale.paymentStatus === 'pending' ? 'No Payment' : 
                       sale.paymentStatus === 'partial' ? 'Partial Paid' : 'Paid'}
                    </span>
                  </td>
                  <td>
                    <div className="amount-info">
                      <span className="amount-total">Total: PKR {parseFloat(sale.totalAmount).toLocaleString()}</span>
                      <span className="amount-paid">Paid: PKR {parseFloat(sale.amountPaid || 0).toLocaleString()}</span>
                      <span className="amount-remaining">Remaining: PKR {parseFloat(sale.remainingAmount || 0).toLocaleString()}</span>
                    </div>
                  </td>
                  <td>{sale.dueDate ? formatDate(sale.dueDate) : '-'}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => {
                        setSelectedSale(sale);
                        setShowPaymentModal(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSelectedSale(sale);
                        setShowPaymentModal(true);
                      }}
                    >
                      Add Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showPaymentModal && selectedSale && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Record Payment</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>

            <div className="sale-details">
              <div className="detail-row">
                <span className="detail-label">Sale ID:</span>
                <span className="detail-value">#{selectedSale.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Customer:</span>
                <span className="detail-value">{selectedSale.customer?.name || 'Walk-in Customer'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value">PKR {parseFloat(selectedSale.totalAmount).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount Paid:</span>
                <span className="detail-value">PKR {parseFloat(selectedSale.amountPaid || 0).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Remaining:</span>
                <span className="detail-value" style={{ color: '#dc2626' }}>
                  PKR {parseFloat(selectedSale.remainingAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Amount</label>
              <input
                type="number"
                className="form-input"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount being paid"
                min="0"
                max={selectedSale.remainingAmount}
                step="0.01"
              />
              {paymentAmount && (
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                  Remaining after payment: PKR {(parseFloat(selectedSale.remainingAmount) - parseFloat(paymentAmount || 0)).toFixed(2)}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <div className="payment-methods">
                <div 
                  className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  💵 Cash
                </div>
                <div 
                  className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  💳 Card
                </div>
                <div 
                  className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  📱 UPI
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                className="textarea"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="Add any notes about this payment..."
              />
            </div>

            <div className="form-actions">
              <button 
                className="submit-btn" 
                onClick={handlePayment}
                disabled={!paymentAmount || loading}
              >
                {loading ? 'Processing...' : 'Record Payment'}
              </button>
              <button 
                className="cancel-btn" 
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}