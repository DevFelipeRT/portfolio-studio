# Common Table

This document describes the shared admin-table surface under `resources/js/common/table`.

## Scope

`resources/js/common/table` contains shared React primitives for admin-style tables. The package currently provides compositional building blocks rather than a schema-driven table abstraction.

## Exports

The public entrypoint is `resources/js/common/table/index.ts`.

### Core components

- `SystemTable`: wrapper around `@/components/ui/table` with shared `layout` (`fixed` | `auto`) and `density` (`default` | `compact`) options.
- `InteractiveTableRow`: accessible row primitive for clickable rows, with keyboard activation and protection against accidental row activation when interacting with nested controls.
- `TableSurfaceRow`: non-interactive row primitive with the same shared surface variants used by interactive rows.

### Shell and layout helpers

- `TableCard`: card shell with optional legacy header props and a free-form `header` slot rendered in `CardHeader`.
- `TableToolbar`: shared layout wrapper for filter/action rows; it does not render its own card chrome.
- `NewButton`: standardized creation CTA for table cards, with shared icon, typography, and spacing.
- `TableHeaderRow`: shared visual treatment for table header rows.
- `TableEmptyState`: empty-row helper that renders a centered fallback message spanning the provided column count.
- `TableActionCell`: right-aligned action cell with optional chevron affordance.
- `TableTitleCell`: summary/title cell with shared title + subtitle layout.
- `TableMetaCell`: shared table cell wrapper for metadata columns.
- `TableStatusStack`: shared stack layout for multiple badges/status pills in one cell.
- `TableDateText`: nowrap date/text wrapper for compact metadata values.

### Actions and detail helpers

- `TableActionsMenu`: standardized dropdown trigger/content wrapper for row actions.
- `TableActionsMenuItem`: re-exported action item primitive for dropdown entries.
- `ItemDialog`: composable item-detail dialog surface for overlays, exposing `Content`, `Header`, `HeaderRow`, `Main`, `Title`, `Description`, `Badges`, `Metadata`, `Actions`, and `Body`.
- Admin create actions should live in `TableCard.actions`; avoid rendering standalone “new” buttons outside the table shell.

### Badge helpers

- `TableBadge`: lightweight badge wrapper for table status/meta presentation.
- `TableBooleanBadge`: helper for yes/no, visible/hidden, active/inactive states with icons.
- `TableBadgeButton`: button helper that renders badge-styled interactive content.

### Formatting helpers

- `formatTableDate(...)`: shared locale-aware formatter for admin table date cells.
- `formatTableDateRange(...)`: shared locale-aware formatter for admin table period/range cells.

### Pagination helpers

- `TablePagination`: shared footer for result summary, previous/next controls, optional page links, and optional per-page controls.
- `normalizeTablePagination(...)`: normalizes a flat Laravel paginator payload into the UI-friendly `TablePaginationState`.
- `serializeTableQueryParams(...)`: serializes table-related query params while omitting empty values.
- `setTablePageInQueryParams(...)`: applies the current `page` to an existing query param object, omitting page `1`.
- `resetTablePageInQueryParams(...)`: removes the `page` param from an existing query param object.
- `setTablePerPageInQueryParams(...)`: applies a `per_page` value to an existing query param object.
- `toggleTableSortState(...)`: returns the next single-column sort state for a given header click.
- `setTableSortInQueryParams(...)`: applies `sort` / `direction` to an existing query param object and resets `page`.

### Sorting helpers

- `TableSortHeader`: shared sortable-header primitive for semantic table headers, rendering either an interactive control or a static label depending on availability.
- `TableSortDirection`: canonical direction union for table sorting (`'asc' | 'desc'`).
- `TableSortState`: single-column sort state (`column`, `direction`) shared across table listings.
- `TableSortHeaderProps`: props contract for sortable header content rendered inside `TableHead`.

### Shared paginator types

- `TablePaginated<TItem>`: canonical flat Laravel length-aware paginator contract for admin tables.
- `TablePaginationLink`: pagination link metadata, including an optional resolved page number.
- `TablePaginationState`: normalized pagination state consumed by shared table controls.

### Styling presets

- `tablePresets.headerCell`
- `tablePresets.summaryCell`
- `tablePresets.metaCell`
- `tablePresets.statusCell`
- `tablePresets.actionCell`

These presets provide lightweight semantic class groupings for common table cell roles.

`tablePresets.headerCell` is the canonical source for column-header typography. Sortable headers rendered via `TableSortHeader` should inherit that styling instead of redefining text transform or letter spacing locally.

## Files

- `resources/js/common/table/Table.tsx`: `SystemTable`
- `resources/js/common/table/types.ts`: shared prop and variant types
- `resources/js/common/table/pagination.ts`: pagination normalization helpers
- `resources/js/common/table/query.ts`: stateless query-string helpers for table listings
- `resources/js/common/table/presets.ts`: class presets
- `resources/js/common/table/item-dialog/*`: composable dialog primitives for item/detail overlays
- `resources/js/common/table/partials/*`: card, toolbar, sortable header, action, badge, empty-state, menu, and pagination helpers
- `resources/js/common/table/row/InteractiveTableRow.tsx`: clickable-row primitive
- `resources/js/common/table/DemoTable.tsx`: local demo of the shared API used by the admin dashboard page

## Canonical pagination contract

Admin table listings should expose the flat Laravel length-aware paginator shape:

- `data`
- `current_page`
- `last_page`
- `per_page`
- `from`
- `to`
- `total`
- optional `path`
- optional `links`

When the backend provides pagination links, prefer preserving active filters with Laravel `withQueryString()` so shared footers can render consistent navigation metadata.

## Composition guidance

Preferred composition for filterable admin tables:

1. `TableToolbar`
2. `TableCard`
3. `SystemTable`
4. `TableSortHeader` inside sortable `TableHead`
5. `TablePagination`

Keep filter controls domain-specific in their module. `common/table` owns shared shells, paginator types, footer rendering, and generic query helpers for `page` / `per_page`.

Sorting stays single-column only. Module code owns the allowed sort keys and any query-state normalization for raw `sort` / `direction` values.

For item/detail overlays, prefer composing `ItemDialog` directly. The current shared header model is:

1. `ItemDialog`
2. `ItemDialog.Content`
3. `ItemDialog.Header`
4. optional `ItemDialog.HeaderRow`
5. `ItemDialog.Main`
6. optional `ItemDialog.Title`, `ItemDialog.Description`, `ItemDialog.Badges`, `ItemDialog.Metadata`
7. optional `ItemDialog.Actions`
8. `ItemDialog.Body`

Use `Badges`, `Metadata`, and `Actions` instead of packing those concerns into a single custom title node. This keeps overlays like Projects, Courses, Messages, and Initiatives structurally consistent while still allowing module-specific body content.

When a table needs filters or custom controls inside the card header, prefer `TableCard.header` over nesting another card-like wrapper above the table.

For sortable headers:

- use `TableSortHeader` inside a semantic `TableHead`
- apply `aria-sort` on the owning `TableHead`
- keep generic sort status/action copy in the common `table` i18n namespace
- keep module-specific visible column labels in the module namespace

## Current usage

The shared table surface is used by multiple admin listings, including:

- `resources/js/modules/projects/ui/table/*`
- `resources/js/modules/experiences/ui/table/*`
- `resources/js/modules/courses/ui/table/*`
- `resources/js/modules/messages/ui/*`
- `resources/js/modules/skills/ui/table/*`
- `resources/js/modules/contact-channels/ui/table/*`
- `resources/js/modules/initiatives/ui/table/*`
- `resources/js/modules/content-management/features/page-management/page/listing/*`

`resources/js/common/table/DemoTable.tsx` remains the local playground for the shared API.
