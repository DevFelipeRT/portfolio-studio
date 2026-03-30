# Skills (Frontend)

Scope: admin Inertia pages to manage skills and categories (including translations), plus the public “skills” CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/skills/pages.ts`
- Admin pages: `resources/js/app/pages/skills/admin/index/page.tsx`, `resources/js/app/pages/skills/admin/create/page.tsx`, `resources/js/app/pages/skills/admin/edit/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/index/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/create/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/edit/page.tsx`
- Admin UI components: `resources/js/modules/skills/ui/table/SkillsTable.tsx`, `resources/js/modules/skills/ui/table/SkillCategoriesTable.tsx`, `resources/js/modules/skills/ui/SkillOverlay.tsx`, `resources/js/modules/skills/ui/SkillCategoryOverlay.tsx`, `resources/js/modules/skills/ui/form/skill/SkillForm.tsx`, `resources/js/modules/skills/ui/form/skill-category/SkillCategoryForm.tsx`
- Shared table helpers used by the skills index: `resources/js/common/table/partials/TableCard.tsx`, `resources/js/common/table/partials/TablePagination.tsx`, `resources/js/common/table/query.ts`
- Translation UX + API calls: `resources/js/modules/skills/ui/TranslationModal.tsx`, `resources/js/modules/skills/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/skills/sectionRegistryProvider.ts`, `resources/js/modules/skills/ui/sections/TechStackPrimarySection.tsx`
- CMS template definition (data source binding): `resources/templates/skills/skills_primary/skills_primary.php`

## Admin UI (Inertia)

Pages are registered under keys like `skills/admin/Index` and rendered from the backend controllers (`resources/js/app/pages/skills/pages.ts`, `app/Modules/Skills/Http/Controllers/SkillController.php`).

### Skills

- Index lists skills, opens a read-only details overlay from the row, and allows delete/edit actions (`resources/js/app/pages/skills/admin/index/page.tsx`, `resources/js/modules/skills/ui/SkillOverlay.tsx`).
- The page now owns the visible heading/description for the skills list and passes the create CTA through `TableCard.header`; the table no longer owns page-level copy (`resources/js/app/pages/skills/admin/index/page.tsx`, `resources/js/modules/skills/ui/table/SkillsTable.tsx`).
- The skills admin table uses the shared `resources/js/common/table` primitives for card shell, header slot, action cell, actions menu, and `TablePagination`, while keeping skill-specific cells inside the module (`resources/js/modules/skills/ui/table/SkillsTable.tsx`, `resources/js/modules/skills/ui/table/SkillsRow.tsx`).
- The primary skills list is paginated, supports shared column sorting for `name`, `category`, `created_at`, and `updated_at`, and now exposes page-owned filtering for text search plus category selection, while the main page exposes category management through a dedicated entry card instead of rendering the full categories table inline (`app/Modules/Skills/Http/Controllers/SkillController.php`, `app/Modules/Skills/Application/UseCases/ListSkills/ListSkills.php`, `app/Modules/Skills/Infrastructure/Repositories/SkillRepository.php`, `resources/js/common/table/query.ts`, `resources/js/modules/skills/ui/table/SkillsTable.tsx`, `resources/js/app/pages/skills/admin/index/page.tsx`).
- The default admin ordering for skills is now explicitly `category` ascending, with category groupings alphabetized by category name and skills alphabetized by skill name inside each group; the page receives that default as the active table sort state from the backend (`app/Modules/Skills/Http/Controllers/SkillController.php`, `app/Modules/Skills/Infrastructure/Repositories/SkillRepository.php`, `resources/js/app/pages/skills/admin/index/page.tsx`).
- Create and edit pages use `SkillForm`, receive server-provided `initial` form state from the backend presentation layer, and submit to `skills.store` / `skills.update` (`resources/js/app/pages/skills/admin/create/page.tsx`, `resources/js/app/pages/skills/admin/edit/page.tsx`, `app/Modules/Skills/Presentation/Presenters/SkillPagePresenter.php`, `resources/js/modules/skills/ui/form/skill/SkillForm.tsx`).

### Skill categories

Skill categories now have a dedicated admin index page with pagination, but the entry point remains inside the main skills page rather than the global navigation (`resources/js/app/pages/skills/admin/index/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/index/page.tsx`, `app/Modules/Skills/Routes/admin.php`).

The dedicated categories page uses the same shared table primitives, `TablePagination`, and `TableSortHeader`, with server-driven sorting for `name`, `slug`, and `updated_at`, plus page-owned text search on `name` and `slug`, while each row still opens a read-only details overlay for quick inspection (`resources/js/app/pages/skills/admin/skill-categories/index/page.tsx`, `resources/js/modules/skills/ui/table/SkillCategoriesTable.tsx`, `resources/js/modules/skills/ui/SkillCategoryOverlay.tsx`).

Create/edit pages exist and are registered, now return to the standalone categories listing instead of the main skills page, and receive their initial form payload from the backend presentation layer (`resources/js/app/pages/skills/pages.ts`, `resources/js/app/pages/skills/admin/skill-categories/create/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/edit/page.tsx`, `app/Modules/Skills/Presentation/Presenters/SkillCategoryPagePresenter.php`).

After create/update/delete, the backend redirects back to `skill-categories.index`, which is also the paginated source for the category table payload (`app/Modules/Skills/Http/Controllers/SkillCategoryController.php`, `app/Modules/Skills/Application/UseCases/ListSkillCategories/ListSkillCategories.php`, `app/Modules/Skills/Infrastructure/Repositories/SkillCategoryRepository.php`).

## Translations (modal UX)

Both skill and category edit pages include a “Manage translations” modal (`resources/js/app/pages/skills/admin/edit/page.tsx`, `resources/js/app/pages/skills/admin/skill-categories/edit/page.tsx`).

The modal loads and mutates translations via JSON endpoints using `window.axios` and Ziggy `route(...)` helpers (`resources/js/modules/skills/core/api/translations.ts`, `app/Modules/Skills/Routes/admin.php`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/skills/core/api/translations.ts`).

## CMS section: `skills_primary`

This module contributes a public section component to the Content Management renderer:

- Registry: `skills_primary` → `TechStackPrimarySection` (`resources/js/modules/skills/sectionRegistryProvider.ts`)
- Template data source: `skills.grouped_by_category.v1` injected into section field `groups` (`resources/templates/skills/skills_primary/skills_primary.php`)
- Renderer expects `groups` to be an array of groups with `title` and `skills[]` (`resources/js/modules/skills/ui/sections/TechStackPrimarySection.tsx`)
