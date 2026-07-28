import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import MenuGrid from './components/MenuGrid';
import CartPanel from './components/CartPanel';
import TableSelector from './components/TableSelector';
import PrintableReceipt from './components/PrintableReceipt';
import ReportModal from './components/ReportModal';
import AddMenuItemModal from './components/AddMenuItemModal';
import { X, RotateCcw } from 'lucide-react';

const API_BASE = 'https://restaurant-frontend-c2vc.onrender.com';
const RESTAURANT_UPI = 'merchant@upi'; 
const RESTAURANT_NAME = 'Brahmisri Restaurant';

export default function App() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  
  const [selectedTable, setSelectedTable] = useState('T-1');

  // Multi-table isolated state
  const [tableCarts, setTableCarts] = useState({});       
  const [tableCustomers, setTableCustomers] = useState({}); 
  const [tableDiscounts, setTableDiscounts] = useState({}); 
  
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const fetchMenu = () => {
    axios.get(`${API_BASE}/menu`)
      .then(res => {
        setMenu(res.data);
        const uniqueCats = ['All', ...new Set(res.data.map(i => i.category))];
        setCategories(uniqueCats);
      })
      .catch(err => console.error('Failed to load menu:', err));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const currentCart = tableCarts[selectedTable] || [];
  const currentCustomer = tableCustomers[selectedTable] || 'Guest';
  const currentDiscount = tableDiscounts[selectedTable] || 0;

  const setCustomerName = (name) => {
    setTableCustomers(prev => ({ ...prev, [selectedTable]: name }));
  };

  const setDiscount = (disc) => {
    setTableDiscounts(prev => ({ ...prev, [selectedTable]: disc }));
  };

  const handleClearCurrentTable = () => {
    if (!currentCart.length) return;
    if (window.confirm(`Clear active order for ${selectedTable}?`)) {
      setTableCarts(prev => ({ ...prev, [selectedTable]: [] }));
      setTableDiscounts(prev => ({ ...prev, [selectedTable]: 0 }));
      setTableCustomers(prev => ({ ...prev, [selectedTable]: 'Guest' }));
    }
  };

  const handleAddToCart = (item) => {
    setTableCarts(prev => {
      const activeCart = prev[selectedTable] || [];
      const existing = activeCart.find(i => i._id === item._id);
      
      let updatedCart;
      if (existing) {
        updatedCart = activeCart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updatedCart = [...activeCart, { ...item, menuItem: item._id, quantity: 1 }];
      }

      return { ...prev, [selectedTable]: updatedCart };
    });
  };

  const handleUpdateQty = (id, delta) => {
    setTableCarts(prev => {
      const activeCart = prev[selectedTable] || [];
      const updatedCart = activeCart.map(item => {
        if (item._id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);

      return { ...prev, [selectedTable]: updatedCart };
    });
  };

  const subtotal = currentCart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal + tax - Number(currentDiscount));

  const upiString = `upi://pay?pa=${RESTAURANT_UPI}&pn=${encodeURIComponent(RESTAURANT_NAME)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Bill for ${selectedTable}`)}`;

  const processFinalOrder = async (payMode, paymentId = null) => {
    if (loading) return;
    setLoading(true);

    try {
      const payload = {
        tableNumber: selectedTable,
        customerName: currentCustomer,
        items: currentCart,
        paymentMode: payMode,
        paymentId,
        discount: Number(currentDiscount)
      };

      const res = await axios.post(`${API_BASE}/orders`, payload);
      
      setCompletedOrder(res.data);
      setShowQRModal(false);

      // Clear completed table
      setTableCarts(prev => ({ ...prev, [selectedTable]: [] }));
      setTableDiscounts(prev => ({ ...prev, [selectedTable]: 0 }));
      setTableCustomers(prev => ({ ...prev, [selectedTable]: 'Guest' }));

      setTimeout(() => {
        window.print();
        setCompletedOrder(null);
        setLoading(false);
      }, 500);

    } catch (err) {
      alert('Order Placement Failed: ' + (err.response?.data?.error || err.message));
      setLoading(false);
      setShowQRModal(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (grandTotal <= 0) return alert('Cannot process payment for 0 amount');

    try {
      setLoading(true);
      const { data: order } = await axios.post(`${API_BASE}/razorpay-order`, { amount: grandTotal });

      const options = {
        key: "rzp_test_TI2Nzshv0kOhqe",
        amount: order.amount,
        currency: order.currency,
        name: RESTAURANT_NAME,
        description: `Order Bill for ${selectedTable}`,
        order_id: order.id,
        handler: async (response) => {
          await processFinalOrder('Card', response.razorpay_payment_id);
        },
        prefill: { name: currentCustomer },
        theme: { color: "#f59e0b" }
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
        setLoading(false);
      });

      rzp.open();
      setLoading(false);
    } catch (error) {
      const serverError = error.response?.data?.error || error.message;
      alert("Payment Gateway Error: " + serverError);
      setLoading(false);
    }
  };

  const handleCheckoutClick = () => {
    if (!currentCart.length || loading) return;

    if (paymentMode === 'UPI') {
      setShowQRModal(true);
    } else if (paymentMode === 'Card') {
      handleRazorpayPayment();
    } else {
      processFinalOrder('Cash');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased bg-slate-100 select-none">
      {/* Top Bar */}
      <TableSelector 
        selectedTable={selectedTable} 
        onSelectTable={setSelectedTable} 
        tableCarts={tableCarts}
        onOpenReports={() => setShowReportModal(true)}
        onOpenAddMenu={() => setShowAddMenuModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Menu Grid */}
        <MenuGrid
          menu={menu}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          search={search}
          setSearch={setSearch}
          onAddToCart={handleAddToCart}
        />

        {/* Right Cart Panel */}
        <div className="relative flex flex-col h-full">
          {currentCart.length > 0 && (
            <button
              onClick={handleClearCurrentTable}
              className="absolute top-3 right-3 z-10 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-red-200"
              title="Cancel/Clear Table Order"
            >
              <RotateCcw size={12} /> Clear Order
            </button>
          )}

          <CartPanel
            cart={currentCart}
            tableNumber={selectedTable}
            setTableNumber={setSelectedTable}
            customerName={currentCustomer}
            setCustomerName={setCustomerName}
            paymentMode={paymentMode}
            setPaymentMode={setPaymentMode}
            discount={currentDiscount}
            setDiscount={setDiscount}
            onUpdateQty={handleUpdateQty}
            onCheckout={handleCheckoutClick}
            loading={loading}
          />
        </div>
      </div>

      {/* Dynamic UPI Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button 
              onClick={() => { setShowQRModal(false); setLoading(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>
            <h3 className="font-extrabold text-slate-800 text-lg">Scan to Pay with UPI</h3>
            <p className="text-xs text-slate-500 mt-1">Google Pay, PhonePe, Paytm, BHIM</p>

            <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
              <QRCodeSVG value={upiString} size={200} />
            </div>

            <div className="text-sm font-black text-slate-900 mb-6">
              Total Amount: <span className="text-amber-600">₹{grandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => processFinalOrder('UPI')}
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-sm transition"
            >
              {loading ? 'Processing...' : 'Payment Received & Print'}
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
      {showAddMenuModal && <AddMenuItemModal onClose={() => setShowAddMenuModal(false)} onMenuUpdated={fetchMenu} />}

      {/* Printable Receipt */}
      <PrintableReceipt order={completedOrder} />
    </div>
  );
}
