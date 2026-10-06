import React, { useRef } from 'react';
import { Download, FileText, Upload, RefreshCw, Bookmark, Sparkles } from 'lucide-react';
import { ConceptItem } from '../types/concept';
import { exportToCSV, exportToJSON } from '../utils/helpers';

interface NavbarProps {
  filteredData: ConceptItem[];
  totalCount: number;
  filteredCount: number;
  favoritesCount: number;
  onlyFavorites: boolean;
  onToggleFavoritesOnly: () => void;
  onResetData: () => void;
  onLoadCustomData: (data: ConceptItem[]) => void;
  isCustomLoaded: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  filteredData,
  totalCount,
  filteredCount,
  favoritesCount,
  onlyFavorites,
  onToggleFavoritesOnly,
  onResetData,
  onLoadCustomData,
  isCustomLoaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onLoadCustomData(parsed);
        } else {
          alert('Uploaded JSON must be an array of concept objects.');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Stats */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Psychology Concepts Explorer
              </h1>
              {isCustomLoaded && (
                <span className="text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md">
                  Custom Dataset Loaded
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Interactive table viewer for cognitive, affective & behavioral models ·{' '}
              <span className="text-slate-200 font-medium">
                {filteredCount} of {totalCount} concepts
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Favorites filter toggle */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
              onlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            }`}
            title="Show only bookmarked concepts"
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span>Bookmarked ({favoritesCount})</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => exportToJSON(filteredData)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Download visible data as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportToCSV(filteredData)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Download visible data as CSV"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>CSV</span>
          </button>

          {/* Upload Custom JSON */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
            id="json-file-input"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Upload custom JSON table file"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Upload JSON</span>
          </button>

          {/* Reset if custom data */}
          {isCustomLoaded && (
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/50 transition-colors"
              title="Reset back to default psychology concepts"
            >
              <RefreshCw className="w-3.5 h-3.5 text-red-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
