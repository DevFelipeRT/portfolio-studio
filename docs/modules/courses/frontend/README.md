# Courses (Frontend)

Scope: admin Inertia pages to manage courses (including translations), plus the public courses highlight grid CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/courses/pages.ts`
- Admin pages: `resources/js/app/pages/courses/admin/index/page.tsx`, `resources/js/app/pages/courses/admin/create/page.tsx`, `resources/js/app/pages/courses/admin/edit/page.tsx`
- Admin UI components: `resources/js/modules/courses/ui/CoursesTable.tsx`, `resources/js/modules/courses/ui/CoursesRowActions.tsx`, `resources/js/modules/courses/ui/CourseForm.tsx`, `resources/js/modules/courses/ui/CourseOverlay.tsx`
- Translation UX + API calls: `resources/js/modules/courses/ui/TranslationModal.tsx`, `resources/js/modules/courses/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/courses/sectionRegistryProvider.ts`, `resources/js/modules/courses/ui/sections/CoursesHighlightGridSection.tsx`
- CMS template definition (data source binding): `resources/templates/courses/courses_highlight_grid/courses_highlight_grid.php`

## Admin UI (Inertia)

Pages are registered under keys like `courses/admin/Index` and rendered from the backend controller (`resources/js/app/pages/courses/pages.ts`, `app/Modules/Courses/Http/Controllers/CourseController.php`).

- Index lists courses and uses a modal overlay (`CourseOverlay`) for a read-only details view; it does not navigate to a `courses.show` page (`resources/js/app/pages/courses/admin/index/page.tsx`, `resources/js/modules/courses/ui/CourseOverlay.tsx`).
- Table row actions include edit (`courses.edit`) and delete (`courses.destroy`) (`resources/js/modules/courses/ui/CoursesRowActions.tsx`).
- Create/edit pages use `CourseForm` and submit to `courses.store` / `courses.update` (`resources/js/app/pages/courses/admin/create/page.tsx`, `resources/js/app/pages/courses/admin/edit/page.tsx`, `resources/js/modules/courses/ui/CourseForm.tsx`).

## Translations (modal UX)

The course edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/courses/admin/edit/page.tsx`, `resources/js/modules/courses/core/api/translations.ts`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/courses/core/api/translations.ts`).

## CMS section: `courses_highlight_grid`

This module contributes a public section component to the Content Management renderer:

- Registry: `courses_highlight_grid` → `CoursesHighlightGridSection` (`resources/js/modules/courses/sectionRegistryProvider.ts`)
- Template data source: `courses.visible.v1` injected into section field `courses` and parameter-mapped from `max_items` → `limit` (`resources/templates/courses/courses_highlight_grid/courses_highlight_grid.php`)
- Renderer reads `courses` from section data and optionally applies `max_items` / `maxItems` client-side (`resources/js/modules/courses/ui/sections/CoursesHighlightGridSection.tsx`)

