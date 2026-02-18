# Projects (Frontend)

Scope: admin Inertia pages to manage projects (including translations, skills and images), plus the public “project highlight list” CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/projects/pages.ts`
- Admin pages: `resources/js/app/pages/projects/admin/index/page.tsx`, `resources/js/app/pages/projects/admin/create/page.tsx`, `resources/js/app/pages/projects/admin/edit/page.tsx`
- Project admin UI: `resources/js/modules/projects/ui/ProjectForm.tsx`, `resources/js/modules/projects/ui/ProjectImageCarousel.tsx`
- Translations: `resources/js/modules/projects/ui/TranslationModal.tsx`, `resources/js/modules/projects/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/projects/sectionRegistryProvider.ts`, `resources/js/modules/projects/ui/sections/ProjectHighlightListSection.tsx`
- CMS template definition (data source binding): `resources/templates/projects/project_highlight_list/project_highlight_list.php`

## Admin UI (Inertia)

Pages are registered under keys like `projects/admin/Index` and rendered from the backend controller (`resources/js/app/pages/projects/pages.ts`, `app/Modules/Projects/Http/Controllers/ProjectController.php`).

- Index lists projects and provides edit/delete actions (`resources/js/app/pages/projects/admin/index/page.tsx`).
- Create and edit pages submit multipart form data (images + fields) to `projects.store` / `projects.update` (`resources/js/app/pages/projects/admin/create/page.tsx`, `resources/js/app/pages/projects/admin/edit/page.tsx`).
- Edit uses `_method: 'put'` for update submissions (method spoofing) (`resources/js/app/pages/projects/admin/edit/page.tsx`).

### Skills on projects

The form allows associating skills to a project via `skill_ids` (`resources/js/modules/projects/ui/ProjectForm.tsx`, `app/Modules/Projects/Http/Requests/Project/UpdateProjectRequest.php`).

### Images on projects

- Existing images (from the backend payload) can be deleted via `projects.images.destroy` (`resources/js/modules/projects/ui/ProjectForm.tsx`, `app/Modules/Projects/Routes/admin.php`).
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

