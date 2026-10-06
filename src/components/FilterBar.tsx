import React from 'react';
import { Filter, X, Eye } from 'lucide-react';
import { REALM_COLORS } from '../utils/helpers';

interface FilterBarProps {
  realms: { name: string; count: number }[];
  selectedRealm: string;
  onSelectRealm: (realm: string) => void;
  categories: { name: string; count: number }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  compactMode: boolean;
  onToggleCompactMode: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  realms,
  selectedRealm,
  onSelectRealm,
  categories,
  selectedCategory,
  onSelectCategory,
  pageSize,
  onPageSizeChange,
  onResetFilters,
  hasActiveFilters,
  compactMode,
  onToggleCompactMode,
}) => {
  return (
    <div className="flex flex-col gap-3 py-1">
      {/* Realm Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => onSelectRealm('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg border font-medium transition-all ${
            selectedRealm === 'all'
              ? 'bg-slate-100 text-slate-950 border-white shadow-sm'
              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
        >
          All Realms
          <span className="ml-1.5 opacity-60 font-mono text-[11px]">
            {realms.reduce((acc, r) => acc + r.count, 0)}
          </span>
        </button>

        {realms.map((r) => {
          const isSelected = selectedRealm === r.name;
          const colors = REALM_COLORS[r.name];

          return (
            <button
              key={r.name}
              onClick={() => onSelectRealm(isSelected ? 'all' : r.name)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-slate-100 text-slate-950 border-white shadow-sm'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              {colors && (
                <span
                  className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : colors.dot}`}
                />
              )}
              <span>{r.name}</span>
              <span className="font-mono text-[11px] opacity-60">
                {r.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subcategory & View Options Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">All Categories ({categories.reduce((a, c) => a + c.count, 0)})</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Compact View toggle */}
          <button
            onClick={onToggleCompactMode}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
              compactMode
                ? 'bg-slate-800 text-cyan-300 border-slate-700'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
            title="Toggle dense row padding"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{compactMode ? 'Compact' : 'Comfortable'}</span>
          </button>

          {/* Rows per page */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={1000}>All</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
