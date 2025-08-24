'use client';

import { useState, useEffect } from 'react';

export default function SalesPOS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentType, setPaymentType] = useState('full'); // full or partial
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      let url = '/api/products';
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data.map(product => ({
          ...product,
          stock: product.quantity,
          price: parseFloat(product.price)
        })));
      } else {
        console.error('Invalid product data received:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert('Not enough stock available!');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    const product = products.find(p => p.id === id);
    if (quantity <= 0) {
      removeFromCart(id);
    } else if (quantity <= product.stock) {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    } else {
      alert('Not enough stock available!');
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.18; // 18% GST
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setShowCheckout(true);
  };

  const processSale = async () => {
    setLoading(true);
    try {
      const grandTotal = calculateGrandTotal();
      const paidAmount = paymentType === 'full' ? grandTotal : parseFloat(amountPaid) || 0;
      
      const saleData = {
        customer: customerInfo.name ? customerInfo : null,
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: paymentMethod,
        amountPaid: paidAmount,
        dueDate: paymentType === 'partial' && dueDate ? dueDate : null
      };

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });

      if (response.ok) {
        const sale = await response.json();
        setLastSale({
          ...sale,
          items: sale.saleItems || cart, // Use saleItems from response or fallback to cart
          customer: sale.customer || customerInfo,
          date: new Date(sale.createdAt).toLocaleString(),
          subtotal: calculateTotal(),
          tax: calculateTax(),
          total: calculateGrandTotal(),
          paymentMethod: sale.paymentMethod || paymentMethod
        });
        
        setCart([]);
        setCustomerInfo({ name: '', phone: '', email: '' });
        setPaymentMethod('cash');
        setAmountPaid('');
        setDueDate('');
        setPaymentType('full');
        setShowCheckout(false);
        setShowReceipt(true);
        
        // Refresh products to update stock
        fetchProducts();
      } else {
        alert('Failed to process sale');
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error processing sale');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.barcode && product.barcode.includes(searchTerm))
  );

  return (
    <div className="sales-pos">
      <style jsx>{`
        .sales-pos {
          display: flex;
          height: 100vh;
          background: #f8f9fa;
        }

        .left-panel {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .right-panel {
          width: 400px;
          background: white;
          box-shadow: -5px 0 20px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }

        .search-section {
          background: white;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .search-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .search-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .product-card {
          background: white;
          border-radius: 15px;
          padding: 15px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .product-image {
          width: 100%;
          height: 120px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          margin-bottom: 10px;
        }

        .product-info {
          text-align: center;
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-price {
          font-size: 18px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }

        .product-stock {
          font-size: 12px;
          color: #6b7280;
        }
        
        .product-stock.low-stock {
          color: #d97706;
          font-weight: 500;
        }
        
        .product-stock.out-of-stock {
          color: #dc2626;
          font-weight: 500;
        }

        .cart-header {
          padding: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .cart-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .cart-count {
          font-size: 14px;
          opacity: 0.9;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .cart-item {
          background: #f9fafb;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .cart-item-price {
          font-size: 16px;
          color: #667eea;
          font-weight: bold;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: none;
          background: white;
          color: #667eea;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .quantity-btn:hover {
          background: #667eea;
          color: white;
        }

        .quantity-display {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          min-width: 30px;
          text-align: center;
        }

        .remove-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #fca5a5;
        }

        .cart-footer {
          padding: 20px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .total-section {
          margin-bottom: 20px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .total-label {
          color: #6b7280;
        }

        .total-value {
          color: #1f2937;
          font-weight: 600;
        }

        .grand-total {
          font-size: 18px;
          padding-top: 10px;
          border-top: 2px solid #e5e7eb;
        }

        .grand-total .total-label {
          color: #1f2937;
          font-weight: 600;
        }

        .grand-total .total-value {
          color: #667eea;
          font-weight: bold;
        }

        .checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .checkout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          transition: all 0.3s ease;
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

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }

        .process-btn {
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

        .process-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
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

        .receipt {
          text-align: center;
          padding: 20px;
        }

        .receipt-header {
          margin-bottom: 30px;
        }

        .receipt-title {
          font-size: 28px;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 10px;
        }

        .receipt-info {
          color: #6b7280;
          font-size: 14px;
        }

        .receipt-items {
          text-align: left;
          margin: 20px 0;
          padding: 20px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .receipt-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .receipt-total {
          text-align: right;
          margin-top: 20px;
        }

        .print-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 20px;
        }

        .print-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .empty-cart {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .empty-cart-icon {
          font-size: 60px;
          margin-bottom: 15px;
        }

        .empty-cart-text {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .sales-pos {
            flex-direction: column;
          }

          .right-panel {
            width: 100%;
            height: 50vh;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .payment-methods {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="left-panel">
        <div className="search-section">
          <h2 className="search-title">Search Products</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or scan barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
              <div className="product-image">
                {product.category?.name === 'Electronics' && '💻'}
                {product.category?.name === 'Clothing' && '👕'}
                {product.category?.name === 'Food' && '🍚'}
                {product.category?.name === 'Books' && '📚'}
                {product.category?.name === 'Sports' && '⚽'}
                {!product.category && '📦'}
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">PKR {product.price.toLocaleString()}</div>
                <div className={`product-stock ${
                  product.stock === 0 ? 'out-of-stock' : 
                  product.stock < (product.minStock || 10) ? 'low-stock' : ''
                }`}>
                  Stock: {Math.floor((product.stock || 0) / (product.unitsPerBox || 10))} boxes ({product.stock || 0} units)
                  <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '5px' }}>
                    ({product.unitsPerBox || 10} units/box)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <div className="cart-count">{cart.length} items</div>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <div className="empty-cart-text">Your cart is empty</div>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">PKR {item.price.toLocaleString()}</div>
                </div>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="total-section">
            <div className="total-row">
              <span className="total-label">Subtotal:</span>
              <span className="total-value">PKR {calculateTotal().toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span className="total-label">Tax (18%):</span>
              <span className="total-value">PKR {calculateTax().toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span className="total-label">Grand Total:</span>
              <span className="total-value">PKR {calculateGrandTotal().toFixed(2)}</span>
            </div>
          </div>
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Checkout</h2>
              <button className="close-btn" onClick={() => setShowCheckout(false)}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-input"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                className="form-input"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Type</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="full"
                    checked={paymentType === 'full'}
                    onChange={(e) => setPaymentType(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  Full Payment
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="partial"
                    checked={paymentType === 'partial'}
                    onChange={(e) => setPaymentType(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  Partial Payment (Loan/Credit)
                </label>
              </div>
            </div>

            {paymentType === 'partial' && (
              <>
                <div className="form-group">
                  <label className="form-label">Amount Paid Now</label>
                  <input
                    type="number"
                    className="form-input"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="Enter amount customer is paying now"
                    min="0"
                    max={calculateGrandTotal().toFixed(2)}
                    step="0.01"
                  />
                  {amountPaid && (
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                      Remaining: PKR {(calculateGrandTotal() - parseFloat(amountPaid || 0)).toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date (Optional)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </>
            )}

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

            <div className="total-section">
              <div className="total-row grand-total">
                <span className="total-label">Total Amount:</span>
                <span className="total-value">PKR {calculateGrandTotal().toFixed(2)}</span>
              </div>
              {paymentType === 'partial' && amountPaid && (
                <>
                  <div className="total-row">
                    <span className="total-label">Amount Paying Now:</span>
                    <span className="total-value">PKR {parseFloat(amountPaid || 0).toFixed(2)}</span>
                  </div>
                  <div className="total-row" style={{ color: '#dc2626' }}>
                    <span className="total-label">Remaining Amount:</span>
                    <span className="total-value">PKR {(calculateGrandTotal() - parseFloat(amountPaid || 0)).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="form-actions">
              <button className="process-btn" onClick={processSale}>
                Process Sale
              </button>
              <button className="cancel-btn" onClick={() => setShowCheckout(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceipt && lastSale && (
        <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Receipt</h2>
              <button className="close-btn" onClick={() => setShowReceipt(false)}>✕</button>
            </div>

            <div className="receipt">
              <div className="receipt-header">
                <div className="receipt-title">✅ Payment Successful!</div>
                <div className="receipt-info">
                  Sale ID: #{lastSale.id}<br />
                  Date: {lastSale.date}
                </div>
              </div>

              {lastSale.customer && lastSale.customer.name && (
                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                  <strong>Customer:</strong> {lastSale.customer.name}<br />
                  {lastSale.customer.phone && <><strong>Phone:</strong> {lastSale.customer.phone}<br /></>}
                  {lastSale.customer.email && <><strong>Email:</strong> {lastSale.customer.email}</>}
                </div>
              )}

              <div className="receipt-items">
                {lastSale.items && lastSale.items.map((item, index) => (
                  <div key={index} className="receipt-item">
                    <span>{item.product?.name || item.name} x {item.quantity}</span>
                    <span>PKR {((item.unitPrice || item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-total">
                <div className="total-row">
                  <span className="total-label">Subtotal:</span>
                  <span className="total-value">PKR {lastSale.subtotal.toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span className="total-label">Tax:</span>
                  <span className="total-value">PKR {lastSale.tax.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span className="total-label">Total:</span>
                  <span className="total-value">PKR {lastSale.total.toFixed(2)}</span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#6b7280' }}>
                  Payment Method: {lastSale.paymentMethod.toUpperCase()}
                </div>
              </div>

              <button className="print-btn" onClick={() => window.print()}>
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}