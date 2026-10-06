/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import defaultConcepts from './data/concepts.json';
import { ConceptItem, SortConfig, SortField } from './types/concept';
import { parseRealmAndCategory } from './utils/helpers';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { ConceptsTable } from './components/ConceptsTable';
import { Pagination } from './components/Pagination';
import { ConceptModal } from './components/ConceptModal';
import { SearchX, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  // Main data state
  const [data, setData] = useState<ConceptItem[]>(defaultConcepts as ConceptItem[]);
  const [isCustomLoaded, setIsCustomLoaded] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRealm, setSelectedRealm] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'Concept',
    direction: 'asc',
  });

  // Pagination & Display states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [compactMode, setCompactMode] = useState(false);

  // Active detail modal
  const [activeConcept, setActiveConcept] = useState<ConceptItem | null>(null);

  // Favorites (Bookmarks) stored in localStorage
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('psychology_favorites');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  const toggleFavorite = (conceptName: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(conceptName)) {
        next.delete(conceptName);
      } else {
        next.add(conceptName);
      }
      try {
        localStorage.setItem('psychology_favorites', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Compute available realms and category counts
  const realmStats = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const { realm } = parseRealmAndCategory(item);
      counts[realm] = (counts[realm] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const { realm, category } = parseRealmAndCategory(item);
      if (selectedRealm === 'all' || selectedRealm.toLowerCase() === realm.toLowerCase()) {
        counts[category] = (counts[category] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data, selectedRealm]);

  // Handle Sort Change
  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        field,
        direction: 'asc',
      };
    });
  };

  // Reset page to 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRealm, selectedCategory, onlyFavorites]);

  // Reset category if not in available categories when realm changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      const exists = categoryStats.some((c) => c.name === selectedCategory);
      if (!exists) setSelectedCategory('all');
    }
  }, [selectedRealm, categoryStats, selectedCategory]);

  // Filtering and Sorting Pipeline
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const { realm, category } = parseRealmAndCategory(item);
        return (
          (item.Concept && item.Concept.toLowerCase().includes(q)) ||
          (item.Description && item.Description.toLowerCase().includes(q)) ||
          (category && category.toLowerCase().includes(q)) ||
          (realm && realm.toLowerCase().includes(q)) ||
          (item['Wikipedia Link'] && item['Wikipedia Link'].toLowerCase().includes(q)) ||
          (item['Google Link'] && item['Google Link'].toLowerCase().includes(q)) ||
          (item['APA Link'] && item['APA Link'].toLowerCase().includes(q)) ||
          (item['OpenAlex Link'] && item['OpenAlex Link'].toLowerCase().includes(q))
        );
      });
    }

    // 2. Realm filter
    if (selectedRealm !== 'all') {
      result = result.filter((item) => {
        const { realm } = parseRealmAndCategory(item);
        return realm.toLowerCase() === selectedRealm.toLowerCase();
      });
    }

    // 3. Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => {
        const { category } = parseRealmAndCategory(item);
        return category.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // 4. Favorites filter
    if (onlyFavorites) {
      result = result.filter((item) => favorites.has(item.Concept));
    }

    // 5. Sorting
    result.sort((a, b) => {
      let valA: string = '';
      let valB: string = '';

      if (sortConfig.field === 'Realm') {
        valA = parseRealmAndCategory(a).realm;
        valB = parseRealmAndCategory(b).realm;
      } else if (sortConfig.field === 'Category') {
        valA = parseRealmAndCategory(a).category;
        valB = parseRealmAndCategory(b).category;
      } else {
        valA = (a[sortConfig.field] as string) || '';
        valB = (b[sortConfig.field] as string) || '';
      }

      const cmp = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [
    data,
    searchQuery,
    selectedRealm,
    selectedCategory,
    onlyFavorites,
    favorites,
    sortConfig,
  ]);

  // Pagination slice
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = useMemo(() => {
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, startIndex, endIndex]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedRealm !== 'all' ||
    selectedCategory !== 'all' ||
    onlyFavorites;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRealm('all');
    setSelectedCategory('all');
    setOnlyFavorites(false);
  };

  const handleResetData = () => {
    setData(defaultConcepts as ConceptItem[]);
    setIsCustomLoaded(false);
    handleResetFilters();
  };

  const handleLoadCustomData = (custom: ConceptItem[]) => {
    setData(custom);
    setIsCustomLoaded(true);
    handleResetFilters();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        filteredData={filteredAndSortedData}
        totalCount={data.length}
        filteredCount={totalItems}
        favoritesCount={favorites.size}
        onlyFavorites={onlyFavorites}
        onToggleFavoritesOnly={() => setOnlyFavorites(!onlyFavorites)}
        onResetData={handleResetData}
        onLoadCustomData={handleLoadCustomData}
        isCustomLoaded={isCustomLoaded}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Controls Container */}
        <section className="space-y-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={totalItems}
            totalCount={data.length}
          />

          {/* Realm tabs & Subcategory dropdowns */}
          <FilterBar
            realms={realmStats}
            selectedRealm={selectedRealm}
            onSelectRealm={setSelectedRealm}
            categories={categoryStats}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            compactMode={compactMode}
            onToggleCompactMode={() => setCompactMode(!compactMode)}
          />
        </section>

        {/* Table or Empty State */}
        {totalItems > 0 ? (
          <section className="space-y-3">
            <ConceptsTable
              data={paginatedData}
              sortConfig={sortConfig}
              onSort={handleSort}
              searchQuery={searchQuery}
              startIndex={startIndex}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectConcept={setActiveConcept}
              compactMode={compactMode}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">
              No matching concepts found
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-4">
              We couldn&apos;t find any psychological concepts matching your active search or filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Psychological Concepts Directory · All external Wikipedia, Google Search, APA PsycNet &amp; OpenAlex links open in a new tab.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Click any row for quick definition &amp; citations</span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <ConceptModal
        concept={activeConcept}
        onClose={() => setActiveConcept(null)}
        isFavorite={activeConcept ? favorites.has(activeConcept.Concept) : false}
        onToggleFavorite={toggleFavorite}
        allConcepts={data}
        onSelectRelated={setActiveConcept}
      />
    </div>
  );
}
