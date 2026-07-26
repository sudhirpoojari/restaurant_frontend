import React from 'react';
import { Plus, Minus, Trash2, Printer, CreditCard, Banknote, QrCode } from 'lucide-react';

export default function CartPanel({
  cart,
  tableNumber,
  setTableNumber,
  customerName,
  setCustomerName,
  paymentMode,
  setPaymentMode,
  discount,
  setDiscount,
  onUpdateQty,
  onCheckout,
  loading
}) {
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const grandTotal = Math.max(0, subtotal + tax - Number(discount));

  return (
    <div className="w-[420px] bg-white h-full flex flex-col border-l border-slate-200 shadow-xl">
      {/* Table & Customer Config */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Table / Type</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-sm font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              placeholder="Table 1"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Customer</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-sm font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              placeholder="Walk-in Guest"
            />
          </div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {cart.map(item => (
          <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex-1 pr-2">
              <h4 className="font-bold text-slate-800 text-xs">{item.name}</h4>
              <span className="text-[11px] text-slate-500 font-medium">₹{item.price} × {item.quantity}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                <button onClick={() => onUpdateQty(item._id, -1)} className="p-1 text-slate-600 hover:text-amber-600">
                  <Minus size={12} />
                </button>
                <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item._id, 1)} className="p-1 text-slate-600 hover:text-amber-600">
                  <Plus size={12} />
                </button>
              </div>
              <button onClick={() => onUpdateQty(item._id, -item.quantity)} className="text-slate-300 hover:text-red-500 transition p-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {cart.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
            Cart is currently empty. Tap menu items to add.
          </div>
        )}
      </div>

      {/* Pricing Breakdown & Payment */}
      <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
        <div className="space-y-1.5 text-xs font-semibold text-slate-500">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax (5% GST)</span><span>₹{tax.toFixed(2)}</span></div>
          <div className="flex justify-between items-center">
            <span>Discount (₹)</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
              className="w-16 px-1.5 py-0.5 text-right font-bold text-slate-800 bg-white border border-slate-200 rounded text-xs focus:outline-none"
            />
          </div>
          <div className="flex justify-between items-center pt-2 text-sm font-black text-slate-900 border-t border-slate-200">
            <span>Grand Total</span>
            <span className="text-lg text-amber-600">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Select */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'UPI', icon: QrCode },
              { id: 'Cash', icon: Banknote },
              { id: 'Card', icon: CreditCard }
            ].map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setPaymentMode(m.id)}
                  className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                    paymentMode === m.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} />
                  {m.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onCheckout}
          disabled={loading || cart.length === 0}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black rounded-xl text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Printer size={18} />
          {loading ? 'Processing Order...' : 'Print & Complete Order'}
        </button>
      </div>
    </div>
  );
}