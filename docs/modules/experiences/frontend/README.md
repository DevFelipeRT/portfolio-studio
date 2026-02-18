# Experiences (Frontend)

Scope: admin Inertia pages to manage experiences (including translations), plus the public experience timeline CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/experiences/pages.ts`
- Admin pages: `resources/js/app/pages/experiences/admin/index/page.tsx`, `resources/js/app/pages/experiences/admin/create/page.tsx`, `resources/js/app/pages/experiences/admin/edit/page.tsx`
- Translation UX + API calls: `resources/js/modules/experiences/ui/TranslationModal.tsx`, `resources/js/modules/experiences/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/experiences/sectionRegistryProvider.ts`, `resources/js/modules/experiences/ui/sections/ExperienceTimelineSection.tsx`
- CMS template definition (data source binding): `resources/templates/experiences/experience_timeline/experience_timeline.php`

## Admin UI (Inertia)

Pages are registered under keys like `experiences/admin/Index` and rendered from the backend controller (`resources/js/app/pages/experiences/pages.ts`, `app/Modules/Experiences/Http/Controllers/ExperienceController.php`).

- Index lists experiences and provides edit/delete actions (`resources/js/app/pages/experiences/admin/index/page.tsx`).
- Create and edit pages use Inertia form submissions to `experiences.store` / `experiences.update` (`resources/js/app/pages/experiences/admin/create/page.tsx`, `resources/js/app/pages/experiences/admin/edit/page.tsx`).
- The edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/experiences/admin/edit/page.tsx`, `resources/js/modules/experiences/core/api/translations.ts`, `app/Modules/Experiences/Application/UseCases/UpdateExperience/UpdateExperience.php`).

## CMS section: `experience_timeline`

This module contributes a public section component to the Content Management renderer:

- Registry: `experience_timeline` → `ExperienceTimelineSection` (`resources/js/modules/experiences/sectionRegistryProvider.ts`)
- Template data source: `experiences.visible.v1` injected into section field `experiences` and parameter-mapped from `max_items` → `limit` (`resources/templates/experiences/experience_timeline/experience_timeline.php`)
- Renderer reads `experiences` from section data and optionally applies `max_items` / `maxItems` client-side (`resources/js/modules/experiences/ui/sections/ExperienceTimelineSection.tsx`)

