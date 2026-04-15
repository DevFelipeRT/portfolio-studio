# Courses (Frontend)

Scope: admin Inertia pages to manage courses (including translations), plus the public courses highlight grid CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/courses/pages.ts`
- Admin pages: `resources/js/app/pages/courses/admin/index/page.tsx`, `resources/js/app/pages/courses/admin/create/page.tsx`, `resources/js/app/pages/courses/admin/edit/page.tsx`
- Admin UI components: `resources/js/modules/courses/ui/table/CoursesTable.tsx`, `resources/js/modules/courses/ui/table/CoursesRowActions.tsx`, `resources/js/modules/courses/ui/form/course/CourseForm.tsx`, `resources/js/modules/courses/ui/CourseOverlay.tsx`
- Shared table helpers used by the index: `resources/js/common/table/partials/TableCard.tsx`, `resources/js/common/table/partials/TablePagination.tsx`, `resources/js/common/table/query.ts`
- Translation UX + API calls: `resources/js/modules/courses/ui/TranslationModal.tsx`, `resources/js/modules/courses/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/courses/sectionRegistryProvider.ts`, `resources/js/modules/courses/ui/sections/CoursesHighlightGridSection.tsx`
- CMS template definition (data source binding): `resources/templates/courses/courses_highlight_grid/courses_highlight_grid.php`

## Admin UI (Inertia)

Pages are registered under keys like `courses/admin/Index` and rendered from the backend controller (`resources/js/app/pages/courses/pages.ts`, `app/Modules/Courses/Http/Controllers/CourseController.php`).

- Index lists courses and uses a modal overlay (`CourseOverlay`) for a read-only details view; it does not navigate to a `courses.show` page (`resources/js/app/pages/courses/admin/index/page.tsx`, `resources/js/modules/courses/ui/CourseOverlay.tsx`).
- That details overlay now uses the shared `ItemDialog` composition surface so course-specific badges and rich-text content stay aligned with other admin detail overlays (`resources/js/modules/courses/ui/CourseOverlay.tsx`, `resources/js/common/table/item-dialog/ItemDialog.tsx`).
- The index page owns the visible heading/description and passes the create CTA through `TableCard.header`; the table itself no longer owns long-term page copy (`resources/js/app/pages/courses/admin/index/page.tsx`, `resources/js/modules/courses/ui/CoursesHeader.tsx`, `resources/js/modules/courses/ui/table/CoursesTable.tsx`).
- The admin table uses the shared `resources/js/common/table` primitives for card shell, header slot, interactive rows, action cell/menu, and `TablePagination`, while keeping course-specific cells and badges inside the module (`resources/js/modules/courses/ui/table/CoursesTable.tsx`, `resources/js/modules/courses/ui/table/CoursesRow.tsx`, `resources/js/modules/courses/ui/CourseOverlay.tsx`).
- The first admin column now uses the course `name` as the primary title cell with the course summary as subtitle, while `institution` is rendered in its own dedicated column with matching filter and sort support (`resources/js/modules/courses/ui/table/CoursesTable.tsx`, `resources/js/modules/courses/ui/table/CoursesRow.tsx`, `resources/js/app/pages/courses/admin/index/page.tsx`, `app/Modules/Courses/Infrastructure/Repositories/CourseRepository.php`).
- The list is now driven by the server paginator contract returned by the backend and the page uses shared query helpers for text search (`name`, `institution`, `summary`), `page`, `per_page`, and sortable columns (`name`, `started_at`, `completed_at`, `status`, `display`) (`app/Modules/Courses/Http/Controllers/CourseController.php`, `app/Modules/Courses/Http/Mappers/ListCoursesInputMapper.php`, `app/Modules/Courses/Application/UseCases/ListCourses/ListCoursesInput.php`, `app/Modules/Courses/Application/UseCases/ListCourses/ListCourses.php`, `app/Modules/Courses/Infrastructure/Queries/CourseAdminListQuery.php`, `resources/js/common/table/query.ts`, `resources/js/modules/courses/ui/table/CoursesTable.tsx`, `resources/js/common/table/partials/TableSearchField.tsx`).
- The index now also supports dedicated filtering by computed course `Status` and `Visibility`; the status remains a derived domain concept represented by `CourseStatus` + `CourseStatusValue`, while the infrastructure list query applies that rule directly for filtering and sorting (`resources/js/app/pages/courses/admin/index/page.tsx`, `app/Modules/Courses/Http/Mappers/ListCoursesInputMapper.php`, `app/Modules/Courses/Domain/Enums/CourseStatusValue.php`, `app/Modules/Courses/Domain/ValueObjects/CourseStatus.php`, `app/Modules/Courses/Infrastructure/Queries/CourseAdminListQuery.php`).
- Table row actions include edit (`courses.edit`) and delete (`courses.destroy`) (`resources/js/modules/courses/ui/table/CoursesRowActions.tsx`).
- Create/edit pages use `CourseForm` and submit to `courses.store` / `courses.update` (`resources/js/app/pages/courses/admin/create/page.tsx`, `resources/js/app/pages/courses/admin/edit/page.tsx`, `resources/js/modules/courses/ui/form/course/CourseForm.tsx`).

## Translations (modal UX)

The course edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/courses/admin/edit/page.tsx`, `resources/js/modules/courses/core/api/translations.ts`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/courses/core/api/translations.ts`).

## CMS section: `courses_highlight_grid`

This module contributes a public section component to the Content Management renderer:

- Registry: `courses_highlight_grid` → `CoursesHighlightGridSection` (`resources/js/modules/courses/sectionRegistryProvider.ts`)
- Template data source: `courses.visible.v1` injected into section field `courses` and parameter-mapped from `max_items` → `limit` (`resources/templates/courses/courses_highlight_grid/courses_highlight_grid.php`)
- Renderer reads `courses` from section data and optionally applies `max_items` / `maxItems` client-side (`resources/js/modules/courses/ui/sections/CoursesHighlightGridSection.tsx`)
