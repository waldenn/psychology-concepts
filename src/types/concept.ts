export interface ConceptItem {
  Concept: string;
  Description: string;
  Category?: string;
  Realm?: string;
  "Wikipedia Link": string;
  "Google Link"?: string;
  "APA Link"?: string;
  "OpenAlex Link": string;
  [key: string]: unknown;
}

export type SortField =
  | 'Concept'
  | 'Realm'
  | 'Category'
  | 'Description'
  | 'Wikipedia Link'
  | 'Google Link'
  | 'APA Link'
  | 'OpenAlex Link';

export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}
