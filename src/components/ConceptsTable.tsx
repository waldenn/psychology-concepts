import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Bookmark,
  BookOpen,
  GraduationCap,
  Search,
  Library,
} from 'lucide-react';
import { ConceptItem, SortConfig, SortField } from '../types/concept';
import { highlightText, parseRealmAndCategory, REALM_COLORS } from '../utils/helpers';

interface ConceptsTableProps {
  data: ConceptItem[];
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  searchQuery: string;
  startIndex: number;
  favorites: Set<string>;
  onToggleFavorite: (concept: string) => void;
  onSelectConcept: (concept: ConceptItem) => void;
  compactMode: boolean;
}

export const ConceptsTable: React.FC<ConceptsTableProps> = ({
  data,
  sortConfig,
  onSort,
  searchQuery,
  startIndex,
  favorites,
  onToggleFavorite,
  onSelectConcept,
  compactMode,
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return (
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
    );
  };

  const getSortAria = (field: SortField) => {
    if (sortConfig.field !== field) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  const py = compactMode ? 'py-2' : 'py-3.5';

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 shadow-xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-300 select-none sticky top-0 z-10 backdrop-blur-md">
              {/* Row number */}
              <th scope="col" className="w-12 px-3 py-3 font-mono text-center text-slate-500">
                #
              </th>

              {/* Concept Name */}
              <th
                scope="col"
                aria-sort={getSortAria('Concept')}
                onClick={() => onSort('Concept')}
                className="px-4 py-3 cursor-pointer group hover:text-white transition-colors min-w-[190px]"
              >
                <div className="flex items-center gap-2">
                  <span>Concept</span>
                  {renderSortIcon('Concept')}
                </div>
              </th>

              {/* Realm & Category */}
              <th
                scope="col"
                aria-sort={getSortAria('Realm')}
                onClick={() => onSort('Realm')}
                className="px-4 py-3 cursor-pointer group hover:text-white transition-colors min-w-[170px]"
              >
                <div className="flex items-center gap-2">
                  <span>Realm & Category</span>
                  {renderSortIcon('Realm')}
                </div>
              </th>

              {/* Description */}
              <th
                scope="col"
                aria-sort={getSortAria('Description')}
                onClick={() => onSort('Description')}
                className="px-4 py-3 cursor-pointer group hover:text-white transition-colors min-w-[340px]"
              >
                <div className="flex items-center gap-2">
                  <span>Description</span>
                  {renderSortIcon('Description')}
                </div>
              </th>

              {/* Bookmark Column - Placed directly after Description */}
              <th scope="col" className="w-16 px-3 py-3 text-center text-slate-400">
                <div className="flex items-center justify-center gap-1" title="Bookmark concepts">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="sr-only">Bookmark</span>
                </div>
              </th>

              {/* Links Column - Single column for all external links with identifying icons */}
              <th scope="col" className="px-4 py-3 text-slate-300 min-w-[190px]">
                <div className="flex items-center gap-2">
                  <span>Links</span>
                  <span className="text-[10px] font-normal text-slate-400 font-mono">
                    (Wiki · Google · APA · OpenAlex)
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-normal">
            {data.map((item, index) => {
              const { realm, category } = parseRealmAndCategory(item);
              const isFav = favorites.has(item.Concept);
              const colors = REALM_COLORS[realm] || {
                bg: 'bg-slate-800/50',
                text: 'text-slate-300',
                border: 'border-slate-700/50',
                dot: 'bg-slate-400',
              };

              const wikiUrl = item['Wikipedia Link'];
              const googleUrl = item['Google Link'];
              const apaUrl = item['APA Link'];
              const openAlexUrl = item['OpenAlex Link'];

              return (
                <tr
                  key={`${item.Concept}-${index}`}
                  onClick={() => onSelectConcept(item)}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                >
                  {/* Row index */}
                  <td className={`px-3 ${py} text-center font-mono text-xs text-slate-500`}>
                    {startIndex + index + 1}
                  </td>

                  {/* Concept */}
                  <td className={`px-4 ${py} font-medium text-slate-100 group-hover:text-cyan-300 transition-colors`}>
                    <div className="flex items-center gap-2">
                      <span>{highlightText(item.Concept, searchQuery)}</span>
                    </div>
                  </td>

                  {/* Realm & Category */}
                  <td className={`px-4 ${py}`}>
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                        <span className="font-medium">{realm}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {highlightText(category, searchQuery)}
                      </span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className={`px-4 ${py} text-slate-300 text-xs leading-relaxed max-w-lg`}>
                    <p className="line-clamp-2" title={item.Description}>
                      {highlightText(item.Description, searchQuery)}
                    </p>
                  </td>

                  {/* Bookmark - Moved after Description */}
                  <td className={`px-3 ${py} text-center`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.Concept);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav
                          ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={isFav ? 'Remove from bookmarks' : 'Add to bookmarks'}
                      aria-label={isFav ? `Remove ${item.Concept} from bookmarks` : `Bookmark ${item.Concept}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>

                  {/* Links Column - Identifying icons for Wikipedia, Google, APA, OpenAlex */}
                  <td className={`px-4 ${py} text-xs`}>
                    <div className="flex items-center gap-2">
                      {/* 1. Wikipedia Link */}
                      {wikiUrl && (
                        <a
                          href={wikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-cyan-950/60 text-cyan-400 hover:text-cyan-200 border border-slate-700/80 hover:border-cyan-700/60 shadow-sm transition-all hover:scale-105"
                          title={`Wikipedia (Psychology category search for ${item.Concept})`}
                          aria-label={`Open Wikipedia search for ${item.Concept} in a new tab`}
                        >
                          <BookOpen className="w-4 h-4" />
                        </a>
                      )}

                      {/* 2. Google Search Link */}
                      {googleUrl && (
                        <a
                          href={googleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-blue-950/60 text-blue-400 hover:text-blue-200 border border-slate-700/80 hover:border-blue-700/60 shadow-sm transition-all hover:scale-105"
                          title={`Google Search ("${item.Concept}" psychology)`}
                          aria-label={`Open Google search for ${item.Concept} in a new tab`}
                        >
                          <Search className="w-4 h-4" />
                        </a>
                      )}

                      {/* 3. APA PsycNet Link */}
                      {apaUrl && (
                        <a
                          href={apaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-amber-950/60 text-amber-400 hover:text-amber-200 border border-slate-700/80 hover:border-amber-700/60 shadow-sm transition-all hover:scale-105"
                          title={`APA PsycNet Search for ${item.Concept}`}
                          aria-label={`Open APA PsycNet search for ${item.Concept} in a new tab`}
                        >
                          <Library className="w-4 h-4" />
                        </a>
                      )}

                      {/* 4. OpenAlex Research Link */}
                      {openAlexUrl && (
                        <a
                          href={openAlexUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-indigo-950/60 text-indigo-400 hover:text-indigo-200 border border-slate-700/80 hover:border-indigo-700/60 shadow-sm transition-all hover:scale-105"
                          title={`OpenAlex Research Papers for ${item.Concept}`}
                          aria-label={`Open OpenAlex papers for ${item.Concept} in a new tab`}
                        >
                          <GraduationCap className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
