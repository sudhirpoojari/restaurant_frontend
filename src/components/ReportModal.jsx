import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Download, TrendingUp, DollarSign, CreditCard, ShoppingBag } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function ReportModal({ onClose }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/reports`)
      .then(res => {
        setReportData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Report load error:', err);
        setLoading(false);
      });
  }, []);

  const exportCSV = () => {
    if (!reportData || !reportData.orders.length) return;

    const headers = ['Bill No,Table,Customer,Items Count,Subtotal,Tax,Discount,Grand Total,Payment Mode,Payment ID,Date\n'];
    const rows = reportData.orders.map(o => 
      `"${o.billNumber}","${o.tableNumber}","${o.customerName}",${o.items.length},${o.subtotal},${o.tax},${o.discount},${o.grandTotal},"${o.paymentMode}","${o.paymentId || 'N/A'}","${new Date(o.createdAt).toLocaleString()}"`
    );

    const blob = new Blob([...headers, rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Transaction_Report_${Date.now()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl font-bold text-slate-700">Loading Report Analytics...</div>
      </div>
    );
  }

  const { summary, orders } = reportData || { summary: {}, orders: [] };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-800">Sales & Transaction Reports</h2>
            <p className="text-xs text-slate-500">Real-time revenue metrics and order history</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
            >
              <Download size={14} /> Export CSV
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase mb-1">
                <TrendingUp size={16} /> Total Revenue
              </div>
              <div className="text-2xl font-black text-slate-900">₹{summary.totalRevenue?.toFixed(2)}</div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase mb-1">
                <ShoppingBag size={16} /> Total Billed
              </div>
              <div className="text-2xl font-black text-slate-900">{summary.totalOrders} Orders</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase mb-1">
                <CreditCard size={16} /> UPI Payments
              </div>
              <div className="text-2xl font-black text-slate-900">₹{summary.paymentStats?.UPI?.toFixed(2)}</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase mb-1">
                <DollarSign size={16} /> Cash Collected
              </div>
              <div className="text-2xl font-black text-slate-900">₹{summary.paymentStats?.Cash?.toFixed(2)}</div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-600 uppercase font-black tracking-wider">
                <tr>
                  <th className="p-3.5">Bill No</th>
                  <th className="p-3.5">Table</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Transaction Ref</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{o.billNumber}</td>
                    <td className="p-3.5">{o.tableNumber}</td>
                    <td className="p-3.5">{o.customerName}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        o.paymentMode === 'UPI' ? 'bg-purple-100 text-purple-700' :
                        o.paymentMode === 'Card' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {o.paymentMode}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">{o.paymentId || 'N/A (Cash)'}</td>
                    <td className="p-3.5 text-right font-black text-slate-900">₹{o.grandTotal.toFixed(2)}</td>
                    <td className="p-3.5 text-slate-400">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400 font-bold">
                      No completed transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}