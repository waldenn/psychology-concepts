# Comprehensive Psychology Concepts Expansion & Authoritative Definitions Plan

A comprehensive plan to expand the psychology concept repository using Wikipedia's root `Category:Psychology` and upgrade all concept descriptions to concise, accurate scientific definitions under 200 words.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of Key Decisions:**
> 1. **Data Source Scope**: Ingest concepts from `Category:Psychology` and its core theoretical, methodological, and cognitive branches (excluding non-concept biographical entries, universities, or book reviews) to ensure high academic quality.
> 2. **Description Quality (Max 200 Words)**: Replace generic template descriptions ("A psychological concept relating to X...") with authoritative, concise lead extracts sourced directly from domain literature and Wikipedia's summary API, capped strictly at under 200 words.
> 3. **Strict De-duplication**: Apply canonical title normalization and case-insensitive matching across existing and new concepts so that no duplicate concepts enter the dataset.
> 4. **Preserved Schema & Link Integrations**: Keep all required fields (`Concept`, `Description`, `Category`, `Realm`, `Wikipedia Link`, `Google Link`, `APA Link`, `OpenAlex Link`) with new-tab targets (`target="_blank"`).

---

## 1. Overview & Core Concept

* **What It Does**: Upgrades the standalone directory into an authoritative compendium of psychology concepts with concise, informative textbook-grade definitions (under 200 words) and expanded coverage across all major psychological branches.
* **Target Audience**: Psychology students, researchers, clinicians, and lifelong learners needing rapid conceptual clarity, empirical references, and literature links.
* **Key Value**: Replaces boilerplate filler descriptions with genuine, concise domain definitions while expanding the breadth of concepts and retaining instant search, sorting, and multi-database research links.

---

## 2. User Experience & Visual Design

* **Table Presentation**:
  * **Compact Row Mode**: Keeps the clean single-line concept, category badge, and concise truncated preview of the new rich descriptions.
  * **Inline Description Expansion**: Clicking or expanding a row reveals the full substantive definition without layout disruption.
  * **One-Click Links Column**: Continues to display the four distinct identifying icon buttons (Wikipedia, Google Search, APA PsycNet, OpenAlex), all opening in new tabs.
  * **Bookmark Placement**: Retains the bookmark star right after the description column for immediate saving during reading.
* **Concept Detail Modal**:
  * Displays the full definition in an editorial, high-contrast reading card with word count indicator (< 200 words).
  * Direct action buttons to open Wikipedia, Google, APA PsycNet, and OpenAlex in new tabs.
  * Related concepts section for adjacent exploration within the same realm and subfield.
* **Visual Identity & Theme**:
  * Dark obsidian aesthetic (`bg-slate-950`) with high-contrast text (`text-slate-100`), subtle slate border dividers, and dedicated realm color accents (Thinking, Feeling, Connecting, Becoming, Performing, Recovering).
  * Tabular numeric counters and monospace link indicators for empirical clarity.

---

## 3. Key Product Decisions & Trade-Offs

* **Decision 1: Direct Encyclopedic Lead Summaries vs. LLM Paraphrasing**
  * *Chosen Approach*: Extract Wikipedia lead summaries (`prop=extracts&exintro=1&explaintext=1`) and sanitize them to concise 1-2 sentence definitions under 200 words.
  * *Why*: Provides verifiable, consensus-reviewed, academically accurate definitions without risk of synthetic hallucinations.
* **Decision 2: Categorization & Realm Routing Strategy**
  * *Chosen Approach*: Maintain the six psychological realms (*Thinking*, *Feeling*, *Connecting*, *Becoming*, *Performing*, *Recovering*) with automatic classification based on psychological taxonomy.
  * *Why*: Retains fast faceted filtering, realm counters, and visual grouping across 2,000+ concepts.
* **Decision 3: De-duplication & Title Normalization**
  * *Chosen Approach*: Strip parenthetical disambiguations (e.g. `(psychology)`, `(cognitive science)`), normalize casing, and cross-reference an indexed lookup table.
  * *Why*: Guarantees zero duplicate entries while ensuring all concept names display cleanly in UI and search queries.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│             Wikipedia Category:Psychology              │
│       (Branches, Theories, Phenomena & Concepts)       │
└──────────────────────────┬─────────────────────────────┘
                           │ Category Crawl & Filter
                           ▼
┌────────────────────────────────────────────────────────┐
│               Data Ingestion & Extraction              │
│  • Filter out non-concept pages (biographies, books)   │
│  • Extract canonical lead summary (< 200 words)        │
│  • Classify into 6 Psychological Realms                │
│  • Compute Wiki, Google, APA & OpenAlex URLs           │
└──────────────────────────┬─────────────────────────────┘
                           │ Strict Deduplication (Normalized Key)
                           ▼
┌────────────────────────────────────────────────────────┐
│             Updated src/data/concepts.json             │
│  [Concept, Description, Category, Realm, 4 Links]      │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│     ConceptsTable       │ │      ConceptModal       │
│  • Sortable columns     │ │  • Full definition      │
│  • Bookmarks after desc │ │  • Word count badge     │
│  • 4 link icon buttons  │ │  • All links in new tab │
└─────────────────────────┘ └─────────────────────────┘
```

---

## 5. Implementation Stages & Verification Plan

1. **Category Gathering & Candidate Ingestion**:
   * Collect psychology concepts from `Category:Psychology` and its primary branches.
   * Filter out lists, biographical articles, institutes, and works.
2. **Authoritative Definitions Extraction (< 200 Words)**:
   * Fetch lead definition extracts from Wikipedia API.
   * Format each description into a concise, accurate definition strictly under 200 words.
   * Provide high-quality domain fallback summaries for any concept missing a direct API lead.
3. **De-duplication & Schema Alignment**:
   * Merge with existing dataset using strict case-insensitive key comparison.
   * Verify all 8 fields are populated for every record.
4. **UI Adaptation & Verification**:
   * Ensure table column widths accommodate the richer text with graceful line clamping.
   * Verify search indexing covers the rich definitions.
   * Run `compile_applet` and `lint_applet` to confirm zero regressions.
