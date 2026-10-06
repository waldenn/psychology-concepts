import React, { useState } from 'react';
import {
  X,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Copy,
  Check,
  Bookmark,
  Search,
  Library,
  Compass,
} from 'lucide-react';
import { ConceptItem } from '../types/concept';
import { parseRealmAndCategory, REALM_COLORS } from '../utils/helpers';

interface ConceptModalProps {
  concept: ConceptItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (concept: string) => void;
  allConcepts: ConceptItem[];
  onSelectRelated: (item: ConceptItem) => void;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  concept,
  onClose,
  isFavorite,
  onToggleFavorite,
  allConcepts,
  onSelectRelated,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!concept) return null;

  const { realm, category } = parseRealmAndCategory(concept);
  const colors = REALM_COLORS[realm] || {
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-700/50',
    dot: 'bg-slate-400',
  };

  const wikiUrl = concept['Wikipedia Link'];
  const googleUrl = concept['Google Link'];
  const apaUrl = concept['APA Link'];
  const openAlexUrl = concept['OpenAlex Link'];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Find 4 related concepts in the same realm / category
  const related = allConcepts
    .filter(
      (c) =>
        c.Concept !== concept.Concept &&
        (c.Realm === realm || c.Category === category)
    )
    .slice(0, 4);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close modal (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between pr-8 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <span>{realm} Realm</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                {category}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {concept.Concept}
            </h2>
          </div>

          <button
            onClick={() => onToggleFavorite(concept.Concept)}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={isFavorite ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Definition & Scope
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500">
                {concept.Description.split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                onClick={() => handleCopy(concept.Description, 'desc')}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors p-1 rounded hover:bg-slate-800/60"
                title="Copy definition text"
              >
                {copiedType === 'desc' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {concept.Description}
          </p>
        </div>

        {/* Primary Research Links */}
        <div className="space-y-2.5 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Explore Research, Search & Literature
          </h3>

          {/* Wikipedia Link - Open in New Tab */}
          {wikiUrl && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-cyan-950/50 text-cyan-400 border border-cyan-800/40">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-slate-200">
                    Wikipedia (Deep Category: Psychology)
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {wikiUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleCopy(wikiUrl, 'wiki')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Copy link"
                >
                  {copiedType === 'wiki' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Google Search Link - Open in New Tab */}
          {googleUrl && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-blue-950/50 text-blue-400 border border-blue-800/40">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-slate-200">
                    Google Search (psychology)
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {googleUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleCopy(googleUrl, 'google')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Copy Google Search URL"
                >
                  {copiedType === 'google' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium transition-colors"
                >
                  <span>Search</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* APA PsycNet Link - Open in New Tab */}
          {apaUrl && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-amber-950/50 text-amber-400 border border-amber-800/40">
                  <Library className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-slate-200">
                    APA PsycNet Search
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {apaUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleCopy(apaUrl, 'apa')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Copy APA search URL"
                >
                  {copiedType === 'apa' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={apaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
                >
                  <span>APA</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* OpenAlex Link - Open in New Tab */}
          {openAlexUrl && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-indigo-950/50 text-indigo-400 border border-indigo-800/40">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-slate-200">
                    OpenAlex Scientific Index
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {openAlexUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleCopy(openAlexUrl, 'openalex')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Copy search URL"
                >
                  {copiedType === 'openalex' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={openAlexUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
                >
                  <span>Papers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Related concepts */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Related in {realm}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {related.map((item) => (
                <button
                  key={item.Concept}
                  onClick={() => onSelectRelated(item)}
                  className="text-left p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all text-xs group"
                >
                  <p className="font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                    {item.Concept}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.Category || parseRealmAndCategory(item).category}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
