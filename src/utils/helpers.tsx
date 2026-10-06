import React from 'react';
import { ConceptItem } from '../types/concept';

export const REALM_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Thinking: {
    bg: 'bg-cyan-950/40',
    text: 'text-cyan-300',
    border: 'border-cyan-800/50',
    dot: 'bg-cyan-400',
  },
  Feeling: {
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    border: 'border-rose-800/50',
    dot: 'bg-rose-400',
  },
  Connecting: {
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-800/50',
    dot: 'bg-amber-400',
  },
  Becoming: {
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-800/50',
    dot: 'bg-emerald-400',
  },
  Performing: {
    bg: 'bg-indigo-950/40',
    text: 'text-indigo-300',
    border: 'border-indigo-800/50',
    dot: 'bg-indigo-400',
  },
  Recovering: {
    bg: 'bg-teal-950/40',
    text: 'text-teal-300',
    border: 'border-teal-800/50',
    dot: 'bg-teal-400',
  },
};

export function parseRealmAndCategory(item: ConceptItem): { realm: string; category: string } {
  if (item.Realm && item.Category) {
    return { realm: item.Realm, category: item.Category };
  }

  const desc = item.Description || '';
  // Pattern: "A psychological concept relating to (category) within the (Realm) realm."
  const match = desc.match(/relating to (.*?) within the (.*?) realm/i);
  if (match) {
    return {
      category: match[1].trim(),
      realm: match[2].trim(),
    };
  }

  return {
    realm: item.Realm || 'General',
    category: item.Category || 'general',
  };
}

export function exportToCSV(data: ConceptItem[], filename = 'psychological_concepts.csv') {
  if (!data || !data.length) return;

  const headers = ['Concept', 'Realm', 'Category', 'Description', 'Wikipedia Link', 'Google Link', 'APA Link', 'OpenAlex Link'];
  const rows = data.map((item) => {
    const { realm, category } = parseRealmAndCategory(item);
    return [
      `"${(item.Concept || '').replace(/"/g, '""')}"`,
      `"${(realm || '').replace(/"/g, '""')}"`,
      `"${(category || '').replace(/"/g, '""')}"`,
      `"${(item.Description || '').replace(/"/g, '""')}"`,
      `"${(item['Wikipedia Link'] || '').replace(/"/g, '""')}"`,
      `"${(item['Google Link'] || '').replace(/"/g, '""')}"`,
      `"${(item['APA Link'] || '').replace(/"/g, '""')}"`,
      `"${(item['OpenAlex Link'] || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: ConceptItem[], filename = 'psychological_concepts.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  
  const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-amber-400/25 text-amber-200 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
