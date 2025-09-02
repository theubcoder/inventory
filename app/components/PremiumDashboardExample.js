'use client';

import { useState } from 'react';
import './PremiumUI.css';

export default function PremiumDashboardExample() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      label: 'Total Sales',
      value: '245,890',
      change: '+12.5%',
      trend: 'positive',
      icon: '💰',
      color: 'primary'
    },
    {
      label: 'Products',
      value: '1,234',
      change: '+8.2%',
      trend: 'positive',
      icon: '📦',
      color: 'purple'
    },
    {
      label: 'Customers',
      value: '8,542',
      change: '+23.1%',
      trend: 'positive',
      icon: '👥',
      color: 'emerald'
    },
    {
      label: 'Revenue',
      value: '$125.8K',
      change: '-3.4%',
      trend: 'negative',
      icon: '📈',
      color: 'amber'
    }
  ];

  return (
    <div style={{ padding: '24px', background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '36px', marginBottom: '8px' }}>
          Premium Inventory Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Welcome back! Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon-wrapper">
              <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.trend}`}>
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <button 
            className={`btn-premium ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`btn-premium ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`btn-premium ${activeTab === 'sales' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </button>
        </div>

        {/* Sample Table */}
        <table className="premium-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Premium Widget A</td>
              <td>Electronics</td>
              <td>245</td>
              <td>$129.99</td>
              <td><span className="badge badge-success">In Stock</span></td>
            </tr>
            <tr>
              <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Deluxe Item B</td>
              <td>Accessories</td>
              <td>12</td>
              <td>$89.99</td>
              <td><span className="badge badge-warning">Low Stock</span></td>
            </tr>
            <tr>
              <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Standard Product C</td>
              <td>Clothing</td>
              <td>0</td>
              <td>$45.50</td>
              <td><span className="badge badge-error">Out of Stock</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sample Form */}
      <div className="premium-form">
        <h2 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>Add New Product</h2>
        <div className="premium-input-group">
          <label className="premium-label">Product Name</label>
          <input 
            type="text" 
            className="premium-input" 
            placeholder="Enter product name..."
          />
        </div>
        <div className="premium-input-group">
          <label className="premium-label">Category</label>
          <select className="premium-input">
            <option>Select category...</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Accessories</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="premium-input-group">
            <label className="premium-label">Price</label>
            <input 
              type="number" 
              className="premium-input" 
              placeholder="0.00"
            />
          </div>
          <div className="premium-input-group">
            <label className="premium-label">Stock Quantity</label>
            <input 
              type="number" 
              className="premium-input" 
              placeholder="0"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn-premium btn-primary">Save Product</button>
          <button className="btn-premium btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}