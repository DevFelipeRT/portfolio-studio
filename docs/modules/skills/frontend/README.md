# Skills (Frontend)

Scope: admin Inertia pages to manage skills and categories (including translations), plus the public “skills” CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/skills/pages.ts`
- Admin pages: `resources/js/app/pages/skills/admin/index/page.tsx`, `resources/js/app/pages/skills/admin/create/page.tsx`, `resources/js/app/pages/skills/admin/edit/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/create/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/edit/page.tsx`
- Admin UI components: `resources/js/modules/skills/ui/SkillsTable.tsx`, `resources/js/modules/skills/ui/SkillForm.tsx`, `resources/js/modules/skills/ui/SkillCategoryForm.tsx`, `resources/js/modules/skills/ui/sections/SkillCategoriesSection.tsx`
- Translation UX + API calls: `resources/js/modules/skills/ui/TranslationModal.tsx`, `resources/js/modules/skills/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/skills/sectionRegistryProvider.ts`, `resources/js/modules/skills/ui/sections/TechStackPrimarySection.tsx`
- CMS template definition (data source binding): `resources/templates/skills/skills_primary/skills_primary.php`

## Admin UI (Inertia)

Pages are registered under keys like `skills/admin/Index` and rendered from the backend controllers (`resources/js/app/pages/skills/pages.ts`, `app/Modules/Skills/Http/Controllers/SkillController.php`).

### Skills

- Index lists skills and allows delete/edit actions (`resources/js/app/pages/skills/admin/index/page.tsx`).
- Create and edit pages use `SkillForm` and submit to `skills.store` / `skills.update` (`resources/js/app/pages/skills/admin/create/page.tsx`, `resources/js/app/pages/skills/admin/edit/page.tsx`, `resources/js/modules/skills/ui/SkillForm.tsx`).

### Skill categories

Categories are surfaced inside the Skills index page via `SkillCategoriesSection` (rather than having a dedicated category index page) (`resources/js/app/pages/skills/admin/index/page.tsx`, `resources/js/modules/skills/ui/sections/SkillCategoriesSection.tsx`).

Create/edit pages exist and are registered (`resources/js/app/pages/skills/pages.ts`, `resources/js/app/pages/skills/admin/skill-categories/create/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/edit/page.tsx`).

After create/update/delete, the backend redirects back to `skills.index` (since there is no standalone category index route/page) (`app/Modules/Skills/Http/Controllers/SkillCategoryController.php`, `app/Modules/Skills/Routes/admin.php`).

## Translations (modal UX)

Both skill and category edit pages include a “Manage translations” modal (`resources/js/app/pages/skills/admin/edit/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/edit/page.tsx`).

The modal loads and mutates translations via JSON endpoints using `window.axios` and Ziggy `route(...)` helpers (`resources/js/modules/skills/core/api/translations.ts`, `app/Modules/Skills/Routes/admin.php`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/skills/core/api/translations.ts`).

## CMS section: `skills_primary`

This module contributes a public section component to the Content Management renderer:

- Registry: `skills_primary` → `TechStackPrimarySection` (`resources/js/modules/skills/sectionRegistryProvider.ts`)
- Template data source: `skills.grouped_by_category.v1` injected into section field `groups` (`resources/templates/skills/skills_primary/skills_primary.php`)
- Renderer expects `groups` to be an array of groups with `title` and `skills[]` (`resources/js/modules/skills/ui/sections/TechStackPrimarySection.tsx`)
