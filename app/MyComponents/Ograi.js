'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Ograi() {
  const { t, language } = useLanguage();
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    supplierName: '',
    contactNumber: '',
    address: '',
    transactionDate: new Date().toISOString().split('T')[0],
    productName: '',
    quantity: '',
    pricePerUnit: '',
    totalAmount: 0,
    amountPaid: '',
    remainingAmount: 0,
    overpaidAmount: 0,
    transportFee: '',
    transportPaid: '',
    transportRemaining: 0,
    paymentMethod: 'cash',
    notes: ''
  });

  useEffect(() => {
    fetchSuppliers();
    fetchTransactions();
  }, []);

  useEffect(() => {
    const total = parseFloat(formData.quantity || 0) * parseFloat(formData.pricePerUnit || 0);
    const paid = parseFloat(formData.amountPaid || 0);
    const remaining = Math.max(0, total - paid);
    const overpaid = Math.max(0, paid - total);
    
    const transportTotal = parseFloat(formData.transportFee || 0);
    const transportPaid = parseFloat(formData.transportPaid || 0);
    const transportRemaining = Math.max(0, transportTotal - transportPaid);

    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      remainingAmount: remaining,
      overpaidAmount: overpaid,
      transportRemaining: transportRemaining
    }));
  }, [formData.quantity, formData.pricePerUnit, formData.amountPaid, formData.transportFee, formData.transportPaid]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/ograi/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/ograi/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/ograi/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchTransactions();
        setShowAddForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supplierName: '',
      contactNumber: '',
      address: '',
      transactionDate: new Date().toISOString().split('T')[0],
      productName: '',
      quantity: '',
      pricePerUnit: '',
      totalAmount: 0,
      amountPaid: '',
      remainingAmount: 0,
      overpaidAmount: 0,
      transportFee: '',
      transportPaid: '',
      transportRemaining: 0,
      paymentMethod: 'cash',
      notes: ''
    });
  };

  const getSupplierSummary = (supplierName) => {
    const supplierTransactions = transactions.filter(t => t.supplierName === supplierName);
    const totalPurchases = supplierTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalPaid = supplierTransactions.reduce((sum, t) => sum + t.amountPaid, 0);
    const totalRemaining = supplierTransactions.reduce((sum, t) => sum + t.remainingAmount, 0);
    const totalTransportDue = supplierTransactions.reduce((sum, t) => sum + t.transportRemaining, 0);
    
    return { totalPurchases, totalPaid, totalRemaining, totalTransportDue };
  };

  return (
    <div className="ograi-container">
      <style jsx>{`
        .ograi-container {
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
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
          font-size: 16px;
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          background: white;
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          max-width: 400px;
        }

        .search-input {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          color: #1f2937;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .add-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .summary-icon {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 12px;
        }

        .icon-purchases {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .icon-paid {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .icon-due {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .icon-transport {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .summary-label {
          color: #6b7280;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .summary-value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }

        .suppliers-section {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .suppliers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }

        .supplier-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .supplier-card:hover {
          border-color: #667eea;
          background: #f9fafb;
        }

        .supplier-card.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        }

        .supplier-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .supplier-info {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
        }

        .info-item {
          flex: 1;
        }

        .info-label {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 2px;
        }

        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .transactions-table {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f9fafb;
          padding: 12px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 2px solid #e5e7eb;
        }

        td {
          padding: 12px;
          font-size: 14px;
          color: #1f2937;
          border-bottom: 1px solid #f3f4f6;
        }

        tr:hover {
          background: #f9fafb;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-paid {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-pending {
          background: #fef3c7;
          color: #d97706;
        }

        .status-overpaid {
          background: #dbeafe;
          color: #2563eb;
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

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 30px;
          max-width: 800px;
          width: 90%;
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
          cursor: pointer;
          color: #6b7280;
          transition: color 0.3s ease;
        }

        .close-btn:hover {
          color: #1f2937;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-input {
          padding: 10px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .form-select {
          padding: 10px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          padding: 10px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          resize: vertical;
          min-height: 80px;
          transition: all 0.3s ease;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .summary-section {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }

        .summary-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row-label {
          color: #6b7280;
          font-size: 14px;
        }

        .summary-row-value {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 25px;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .empty-description {
          font-size: 14px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .ograi-container {
            padding: 20px;
          }

          .page-title {
            font-size: 28px;
          }

          .action-bar {
            flex-direction: column;
            gap: 15px;
          }

          .search-box {
            width: 100%;
            max-width: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 20px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Ograi - Supplier Payment Tracking</h1>
        <p className="page-subtitle">Manage supplier purchases, payments, and transport charges</p>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by supplier name or product..."
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              // Filter logic here
            }}
          />
        </div>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          <span>➕</span> Add New Transaction
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon icon-purchases">💰</div>
          <div className="summary-label">Total Purchases</div>
          <div className="summary-value">
            PKR {transactions.reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString()}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon icon-paid">✅</div>
          <div className="summary-label">Total Paid</div>
          <div className="summary-value">
            PKR {transactions.reduce((sum, t) => sum + t.amountPaid, 0).toLocaleString()}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon icon-due">⏳</div>
          <div className="summary-label">Total Due</div>
          <div className="summary-value">
            PKR {transactions.reduce((sum, t) => sum + t.remainingAmount, 0).toLocaleString()}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon icon-transport">🚚</div>
          <div className="summary-label">Transport Due</div>
          <div className="summary-value">
            PKR {transactions.reduce((sum, t) => sum + t.transportRemaining, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {suppliers.length > 0 && (
        <div className="suppliers-section">
          <h2 className="section-title">Suppliers Overview</h2>
          <div className="suppliers-grid">
            {suppliers.map(supplier => {
              const summary = getSupplierSummary(supplier.name);
              return (
                <div
                  key={supplier.id}
                  className={`supplier-card ${selectedSupplier?.id === supplier.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <div className="supplier-name">{supplier.name}</div>
                  <div className="supplier-info">
                    <div className="info-item">
                      <div className="info-label">Total Due</div>
                      <div className="info-value">PKR {summary.totalRemaining.toLocaleString()}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Transport Due</div>
                      <div className="info-value">PKR {summary.totalTransportDue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="transactions-table">
        <h2 className="section-title">Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Transport</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter(t => !selectedSupplier || t.supplierName === selectedSupplier.name)
                  .map(transaction => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                    <td>{transaction.supplierName}</td>
                    <td>{transaction.productName}</td>
                    <td>{transaction.quantity}</td>
                    <td>PKR {transaction.totalAmount.toLocaleString()}</td>
                    <td>PKR {transaction.amountPaid.toLocaleString()}</td>
                    <td>PKR {transaction.remainingAmount.toLocaleString()}</td>
                    <td>PKR {transaction.transportRemaining.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${
                        transaction.remainingAmount === 0 ? 'status-paid' : 
                        transaction.overpaidAmount > 0 ? 'status-overpaid' : 
                        'status-pending'
                      }`}>
                        {transaction.remainingAmount === 0 ? 'Paid' : 
                         transaction.overpaidAmount > 0 ? 'Overpaid' : 
                         'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No transactions yet</div>
            <div className="empty-description">Add your first supplier transaction to get started</div>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowAddForm(false);
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Transaction</h2>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Supplier Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Transaction Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({...formData, transactionDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price per Unit *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Amount</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.totalAmount}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amount Paid *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Remaining Amount</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.remainingAmount}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Transport/Rent Fee</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.transportFee}
                    onChange={(e) => setFormData({...formData, transportFee: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Transport Paid</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.transportPaid}
                    onChange={(e) => setFormData({...formData, transportPaid: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Transport Remaining</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.transportRemaining}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional notes or agreements..."
                  />
                </div>
              </div>

              <div className="summary-section">
                <h3 className="summary-title">Transaction Summary</h3>
                <div className="summary-row">
                  <span className="summary-row-label">Total Purchase Amount</span>
                  <span className="summary-row-value">PKR {formData.totalAmount.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-row-label">Amount Paid</span>
                  <span className="summary-row-value">PKR {parseFloat(formData.amountPaid || 0).toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-row-label">Remaining Amount</span>
                  <span className="summary-row-value">PKR {formData.remainingAmount.toLocaleString()}</span>
                </div>
                {formData.overpaidAmount > 0 && (
                  <div className="summary-row">
                    <span className="summary-row-label">Overpaid Amount</span>
                    <span className="summary-row-value">PKR {formData.overpaidAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span className="summary-row-label">Transport Fee</span>
                  <span className="summary-row-value">PKR {parseFloat(formData.transportFee || 0).toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-row-label">Transport Remaining</span>
                  <span className="summary-row-value">PKR {formData.transportRemaining.toLocaleString()}</span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}