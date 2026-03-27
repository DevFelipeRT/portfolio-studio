# Projects (Frontend)

Scope: admin Inertia pages to manage projects (including translations, skills and images), plus the public “project highlight list” CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/projects/pages.ts`
- Admin pages: `resources/js/app/pages/projects/admin/index/page.tsx`, `resources/js/app/pages/projects/admin/create/page.tsx`, `resources/js/app/pages/projects/admin/edit/page.tsx`
- Admin UI components: `resources/js/modules/projects/ui/table/ProjectsTable.tsx`, `resources/js/modules/projects/ui/table/ProjectsRow.tsx`, `resources/js/modules/projects/ui/ProjectOverlay.tsx`, `resources/js/modules/projects/ui/form/project/ProjectForm.tsx`, `resources/js/modules/projects/ui/ProjectImageCarousel.tsx`
- Shared table helpers used by the index: `resources/js/common/table/partials/TableCard.tsx`, `resources/js/common/table/partials/TablePagination.tsx`, `resources/js/common/table/query.ts`
- Project admin UI: `resources/js/modules/projects/ui/form/project/ProjectForm.tsx`, `resources/js/modules/projects/ui/ProjectImageCarousel.tsx`
- Translations: `resources/js/modules/projects/ui/TranslationModal.tsx`, `resources/js/modules/projects/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/projects/sectionRegistryProvider.ts`, `resources/js/modules/projects/ui/sections/ProjectHighlightListSection.tsx`
- CMS template definition (data source binding): `resources/templates/projects/project_highlight_list/project_highlight_list.php`

## Admin UI (Inertia)

Pages are registered under keys like `projects/admin/Index` and rendered from the backend controller (`resources/js/app/pages/projects/pages.ts`, `app/Modules/Projects/Http/Controllers/ProjectController.php`).

- Index lists projects, opens a read-only details overlay from the row, and still provides edit/delete actions; the overlay now lazy-loads its detail payload from `projects.details` instead of reusing the row payload as a pseudo-detail object (`resources/js/app/pages/projects/admin/index/page.tsx`, `resources/js/modules/projects/ui/ProjectOverlay.tsx`, `resources/js/modules/projects/core/api/details.ts`).
- The index page now owns the visible heading/description and passes the create CTA through `TableCard.header`; the table no longer owns page-level copy (`resources/js/app/pages/projects/admin/index/page.tsx`, `resources/js/modules/projects/ui/table/ProjectsTable.tsx`).
- The projects admin table uses the shared `resources/js/common/table` primitives for card shell, header slot, action cell, actions menu, and `TablePagination`, while keeping project-specific status/visibility/image-count rendering inside the module (`resources/js/modules/projects/ui/table/ProjectsTable.tsx`, `resources/js/modules/projects/ui/table/ProjectsRow.tsx`).
- Project status rendering is now centralized in a shared module-level status helper/badge, so table rows, overlays, forms, translation modals, filters, and public project cards all consume the same canonical status values. Labels live exclusively in frontend i18n; backend payloads only transport the scalar value (`resources/js/modules/projects/core/status.ts`, `resources/js/modules/projects/ui/ProjectStatusBadge.tsx`, `resources/js/modules/projects/ui/table/ProjectsRow.tsx`, `resources/js/modules/projects/ui/ProjectOverlay.tsx`, `resources/js/modules/projects/ui/ProjectCard.tsx`, `resources/js/modules/projects/ui/form/project/ProjectForm.tsx`, `resources/js/modules/projects/ui/TranslationModal.tsx`).
- The admin list now uses the repository paginator path and shared query helpers for text search, `page`, `per_page`, and sortable scalar columns (`name`, `status`, internal `display`, `image_count`); `updated_at` is now shown only inside the details overlay. Search only covers `name` and `summary`, while `status` is handled by its own canonical select filter. The overlay now also renders project images using its dedicated detail payload, mirroring the pattern already used in `initiatives` (`app/Modules/Projects/Http/Controllers/ProjectController.php`, `app/Modules/Projects/Application/UseCases/ListProjects/ListProjects.php`, `app/Modules/Projects/Infrastructure/Repositories/ProjectRepository.php`, `resources/js/common/table/query.ts`, `resources/js/modules/projects/ui/table/ProjectsTable.tsx`, `resources/js/common/table/partials/TableSearchField.tsx`, `resources/js/modules/projects/ui/ProjectOverlay.tsx`).
- The admin index now also supports dedicated filtering by canonical `Status` and boolean `Visibility` in addition to the existing search, pagination, and sorting controls (`resources/js/app/pages/projects/admin/index/page.tsx`, `app/Modules/Projects/Http/Controllers/ProjectController.php`, `app/Modules/Projects/Infrastructure/Repositories/ProjectRepository.php`).
- Project status is now canonicalized across create/edit, translations, badges and filters; the backend accepts only domain-defined scalar values while labels remain frontend-only through i18n (`app/Modules/Projects/Domain/Enums/ProjectStatusValue.php`, `app/Modules/Projects/Domain/ValueObjects/ProjectStatus.php`, `resources/js/modules/projects/core/status.ts`, `resources/js/modules/projects/ui/ProjectStatusBadge.tsx`, `resources/js/modules/projects/ui/form/project/ProjectForm.tsx`, `resources/js/modules/projects/ui/TranslationModal.tsx`).
- The list is now driven by a lightweight row contract (`ProjectListItem`) instead of the full edit/detail payload, and both the rendered row values and the backend search/filter pipeline resolve `name`, `summary`, and `status` against the active locale first, fallback second, and the base record last (`resources/js/modules/projects/core/types.ts`, `app/Modules/Projects/Http/Controllers/ProjectController.php`, `app/Modules/Projects/Infrastructure/Repositories/ProjectRepository.php`, `app/Modules/Projects/Application/Mappers/ProjectAdminOutputMapper.php`).
- Empty-state copy is now filter-aware, so the table distinguishes true onboarding from zero-result searches (`resources/js/app/pages/projects/admin/index/page.tsx`, `resources/js/modules/projects/ui/table/ProjectsTable.tsx`).
- The index controller clamps invalid `page` requests back to the last valid page, and row deletion now preserves the current list context instead of always bouncing back to a clean index (`app/Modules/Projects/Http/Controllers/ProjectController.php`, `resources/js/app/pages/projects/admin/index/page.tsx`, `resources/js/modules/projects/ui/table/ProjectsRow.tsx`).
- Create and edit pages submit multipart form data (images + fields) to `projects.store` / `projects.update` (`resources/js/app/pages/projects/admin/create/page.tsx`, `resources/js/app/pages/projects/admin/edit/page.tsx`).
- Edit uses `_method: 'put'` for update submissions (method spoofing) (`resources/js/app/pages/projects/admin/edit/page.tsx`).

### Skills on projects

The form allows associating skills to a project via `skill_ids` (`resources/js/modules/projects/ui/form/project/ProjectForm.tsx`, `app/Modules/Projects/Http/Requests/Project/UpdateProjectRequest.php`).

### Images on projects

- Existing images (from the backend payload) can be deleted via `projects.images.destroy` (`resources/js/modules/projects/ui/form/project/ProjectForm.tsx`, `app/Modules/Projects/Routes/admin.php`).
- New images are collected client-side and submitted as part of the create/update request using `forceFormData` (`resources/js/app/pages/projects/admin/create/page.tsx`, `resources/js/app/pages/projects/admin/edit/page.tsx`).

## Translations (modal UX)

The edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/projects/admin/edit/page.tsx`, `resources/js/modules/projects/core/api/translations.ts`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/projects/core/api/translations.ts`).

## CMS section: `project_highlight_list`

This module contributes a public section component to the Content Management renderer:

- Registry: `project_highlight_list` → `ProjectHighlightListSection` (`resources/js/modules/projects/sectionRegistryProvider.ts`)
- Template data source: `projects.visible.v1` injected into section field `projects` and parameter-mapped from `max_items` → `limit` (`resources/templates/projects/project_highlight_list/project_highlight_list.php`)
- Renderer reads `projects` from section data and optionally applies `max_items` / `maxItems` client-side (`resources/js/modules/projects/ui/sections/ProjectHighlightListSection.tsx`)

Note: the template defines fields such as `project_ids` and `highlight_only`, but only `max_items` is mapped to a capability parameter in the template definition (`resources/templates/projects/project_highlight_list/project_highlight_list.php`). Any additional filtering is not evidenced in the frontend section component.
