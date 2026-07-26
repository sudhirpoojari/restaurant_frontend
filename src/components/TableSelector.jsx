import React from 'react';
import { Grid, CheckCircle2, BarChart3 } from 'lucide-react';

const TABLES = [
  { id: 'T-1', name: 'Table 1' },
  { id: 'T-2', name: 'Table 2' },
  { id: 'T-3', name: 'Table 3' },
  { id: 'T-4', name: 'Table 4' },
  { id: 'T-5', name: 'Table 5' },
  { id: 'T-6', name: 'Table 6' },
  { id: 'T-7', name: 'Table 7' },
  { id: 'T-8', name: 'Table 8' },
  { id: 'Takeaway', name: 'Takeaway' },
  { id: 'Delivery', name: 'Delivery' }
];

export default function TableSelector({ selectedTable, onSelectTable, onOpenReports }) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400 mr-2 border-r pr-4 border-slate-200">
          <Grid size={16} /> Tables
        </div>

        <div className="flex items-center gap-2">
          {TABLES.map((t) => {
            const isSelected = selectedTable === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTable(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.name}
                {isSelected && <CheckCircle2 size={12} className="text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Button */}
      <button
        onClick={onOpenReports}
        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
      >
        <BarChart3 size={16} /> Reports & Analytics
      </button>
    </div>
  );
}