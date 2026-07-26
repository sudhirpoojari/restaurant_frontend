import React from 'react';

export default function PrintableReceipt({ order }) {
  if (!order) return null;

  return (
    <div id="printable-receipt" className="hidden print:block">
      <div className="text-center font-bold text-base mb-1">GOURMET DINER</div>
      <div className="text-center text-xs mb-3">123 Market Road, Main City<br/>GSTIN: 29AAAAA0000A1Z5</div>
      <div className="border-b border-black my-1"></div>
      
      <div className="text-xs space-y-0.5">
        <div>Bill No: {order.billNumber}</div>
        <div>Date: {new Date(order.createdAt).toLocaleString()}</div>
        <div>Table: {order.tableNumber} | Cust: {order.customerName}</div>
      </div>
      
      <div className="border-b border-black my-1"></div>

      <table className="w-full text-xs text-left my-2">
        <thead>
          <tr className="border-b border-black">
            <th className="py-0.5">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-0.5">{item.name}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-b border-black my-1"></div>

      <div className="text-xs space-y-0.5 text-right font-mono">
        <div>Subtotal: ₹{order.subtotal.toFixed(2)}</div>
        <div>Tax (5%): ₹{order.tax.toFixed(2)}</div>
        {order.discount > 0 && <div>Discount: -₹{order.discount.toFixed(2)}</div>}
        <div className="font-bold text-sm pt-1">Total Pay: ₹{order.grandTotal.toFixed(2)}</div>
        <div className="text-left font-normal mt-1">Paid via: {order.paymentMode}</div>
      </div>

      <div className="border-b border-black my-2"></div>
      <div className="text-center text-xs font-semibold">Thank you! Visit again.</div>
    </div>
  );
}