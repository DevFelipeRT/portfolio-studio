# Experiences (Frontend)

Scope: admin Inertia pages to manage experiences (including translations), plus the public experience timeline CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/experiences/pages.ts`
- Admin pages: `resources/js/app/pages/experiences/admin/index/page.tsx`, `resources/js/app/pages/experiences/admin/create/page.tsx`, `resources/js/app/pages/experiences/admin/edit/page.tsx`
- Admin UI components: `resources/js/modules/experiences/ui/table/ExperiencesTable.tsx`, `resources/js/modules/experiences/ui/table/ExperiencesRow.tsx`, `resources/js/modules/experiences/ui/ExperienceOverlay.tsx`
- Shared table helpers used by the index: `resources/js/common/table/partials/TableCard.tsx`, `resources/js/common/table/partials/TablePagination.tsx`, `resources/js/common/table/query.ts`
- Translation UX + API calls: `resources/js/modules/experiences/ui/TranslationModal.tsx`, `resources/js/modules/experiences/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/experiences/sectionRegistryProvider.ts`, `resources/js/modules/experiences/ui/sections/ExperienceTimelineSection.tsx`
- CMS template definition (data source binding): `resources/templates/experiences/experience_timeline/experience_timeline.php`

## Admin UI (Inertia)

Pages are registered under keys like `experiences/admin/Index` and rendered from the backend controller (`resources/js/app/pages/experiences/pages.ts`, `app/Modules/Experiences/Http/Controllers/ExperienceController.php`).

- Index lists experiences, opens a read-only details overlay from the row, and still provides edit/delete actions (`resources/js/app/pages/experiences/admin/index/page.tsx`, `resources/js/modules/experiences/ui/ExperienceOverlay.tsx`).
- The index page now owns the visible heading/description and passes the create CTA through `TableCard.header`; the table no longer owns page-level copy (`resources/js/app/pages/experiences/admin/index/page.tsx`, `resources/js/modules/experiences/ui/table/ExperiencesTable.tsx`).
- The experiences admin table uses the shared `resources/js/common/table` primitives for card shell, header slot, action cell, actions menu, and `TablePagination`, while keeping experience-specific period and summary rendering inside the module (`resources/js/modules/experiences/ui/table/ExperiencesTable.tsx`, `resources/js/modules/experiences/ui/table/ExperiencesRow.tsx`).
- The admin list now uses the repository paginator path and shared query helpers for text search, `page`, `per_page`, and sortable columns (`position`, `company`, `start_date`, internal `display`); the visible `Period` header still maps to backend sorting on `start_date`, the period cell can be rendered as stacked `From` / `To` lines, `Updated at` now lives only inside the details overlay instead of the index grid, and below `md` the company column collapses into a side label next to the position so the main title column is the only one that grows (`app/Modules/Experiences/Http/Controllers/ExperienceController.php`, `app/Modules/Experiences/Application/UseCases/ListExperiences/ListExperiences.php`, `app/Modules/Experiences/Infrastructure/Repositories/ExperienceRepository.php`, `resources/js/common/table/query.ts`, `resources/js/modules/experiences/ui/table/ExperiencesTable.tsx`, `resources/js/modules/experiences/ui/table/ExperiencesRow.tsx`, `resources/js/modules/experiences/ui/ExperienceOverlay.tsx`, `resources/js/common/table/partials/TableSearchField.tsx`).
- The admin index now also supports dedicated `Visibility` filtering alongside the existing search, pagination, and sorting controls (`resources/js/app/pages/experiences/admin/index/page.tsx`, `app/Modules/Experiences/Http/Controllers/ExperienceController.php`, `app/Modules/Experiences/Infrastructure/Repositories/ExperienceRepository.php`).
- Create and edit pages use Inertia form submissions to `experiences.store` / `experiences.update` (`resources/js/app/pages/experiences/admin/create/page.tsx`, `resources/js/app/pages/experiences/admin/edit/page.tsx`).
- The edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/experiences/admin/edit/page.tsx`, `resources/js/modules/experiences/core/api/translations.ts`, `app/Modules/Experiences/Application/UseCases/UpdateExperience/UpdateExperience.php`).

## CMS section: `experience_timeline`

This module contributes a public section component to the Content Management renderer:

- Registry: `experience_timeline` → `ExperienceTimelineSection` (`resources/js/modules/experiences/sectionRegistryProvider.ts`)
- Template data source: `experiences.visible.v1` injected into section field `experiences` and parameter-mapped from `max_items` → `limit` (`resources/templates/experiences/experience_timeline/experience_timeline.php`)
- Renderer reads `experiences` from section data and optionally applies `max_items` / `maxItems` client-side (`resources/js/modules/experiences/ui/sections/ExperienceTimelineSection.tsx`)
