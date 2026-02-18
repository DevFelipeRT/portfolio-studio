# Skills (Backend)

Scope: admin CRUD for skills and skill categories, translation endpoints, locale-aware persistence, and public-facing data exposure via capabilities (for CMS rendering).

Evidence:

- Routes + wiring: `app/Modules/Skills/Routes/admin.php`, `app/Modules/Skills/Infrastructure/Providers/SkillsServiceProvider.php`
- Controllers (admin): `app/Modules/Skills/Http/Controllers/SkillController.php`, `app/Modules/Skills/Http/Controllers/SkillCategoryController.php`
- Controllers (translations / JSON): `app/Modules/Skills/Http/Controllers/SkillTranslationController.php`, `app/Modules/Skills/Http/Controllers/SkillCategoryTranslationController.php`
- Models: `app/Modules/Skills/Domain/Models/Skill.php`, `app/Modules/Skills/Domain/Models/SkillCategory.php`, `app/Modules/Skills/Domain/Models/SkillTranslation.php`, `app/Modules/Skills/Domain/Models/SkillCategoryTranslation.php`
- Use cases (application layer): `app/Modules/Skills/Application/UseCases/*`
- Locale support + swap behavior: `app/Modules/Skills/Application/Services/SupportedLocalesResolver.php`, `app/Modules/Skills/Application/Services/SkillLocaleSwapService.php`, `app/Modules/Skills/Application/Services/SkillCategoryLocaleSwapService.php`, `app/Modules/Skills/Application/UseCases/UpdateSkill/UpdateSkill.php`, `app/Modules/Skills/Application/UseCases/UpdateSkillCategory/UpdateSkillCategory.php`
- Persistence: `database/migrations/2026_01_19_191549_transform_technologies_to_skills.php`, `database/migrations/2026_02_02_120000_add_skill_translations.php`, `database/migrations/2026_02_06_090000_add_locale_to_skills_and_categories.php`
- Capabilities: `app/Modules/Skills/Application/Capabilities/Providers/SkillList.php`, `app/Modules/Skills/Application/Capabilities/Providers/SkillsByCategory.php`

## HTTP Surface

Routes are registered under `web + auth + verified` by `SkillsServiceProvider` (`app/Modules/Skills/Infrastructure/Providers/SkillsServiceProvider.php`).

### Admin routes

Declared as resource routes in `app/Modules/Skills/Routes/admin.php`:

- Skills CRUD (no `show` route): `Route::resource('skills', SkillController::class)->except(['show'])->names('skills')` (`app/Modules/Skills/Routes/admin.php`)
- Skill categories CRUD (no `index` / no `show` routes): `Route::resource('skill-categories', SkillCategoryController::class)->except(['index','show'])...` (`app/Modules/Skills/Routes/admin.php`)

### Translation JSON endpoints

Skills translations (`app/Modules/Skills/Routes/admin.php`, `app/Modules/Skills/Http/Controllers/SkillTranslationController.php`):

- `GET /admin/skills/{skill}/translations` (`skills.translations.index`)
- `POST /admin/skills/{skill}/translations` (`skills.translations.store`)
- `PUT /admin/skills/{skill}/translations/{locale}` (`skills.translations.update`)
- `DELETE /admin/skills/{skill}/translations/{locale}` (`skills.translations.destroy`)

Category translations (`app/Modules/Skills/Routes/admin.php`, `app/Modules/Skills/Http/Controllers/SkillCategoryTranslationController.php`):

- `GET /admin/skill-categories/{skillCategory}/translations` (`skill-categories.translations.index`)
- `POST /admin/skill-categories/{skillCategory}/translations` (`skill-categories.translations.store`)
- `PUT /admin/skill-categories/{skillCategory}/translations/{locale}` (`skill-categories.translations.update`)
- `DELETE /admin/skill-categories/{skillCategory}/translations/{locale}` (`skill-categories.translations.destroy`)

## Data model (persistence)

This module migrated an earlier `technologies` table into `skills` and introduced skill categories + a pivot table (`database/migrations/2026_01_19_191549_transform_technologies_to_skills.php`):

- `skills`
- `skill_categories` (with unique `slug`)
- `project_skill` (pivot between projects and skills)

Translations are stored separately (`database/migrations/2026_02_02_120000_add_skill_translations.php`):

- `skill_translations` (unique `(skill_id, locale)`)
- `skill_category_translations` (unique `(skill_category_id, locale)`)

Base records also store a `locale` column (`database/migrations/2026_02_06_090000_add_locale_to_skills_and_categories.php`), and both `Skill` and `SkillCategory` expose `translations()` relations (`app/Modules/Skills/Domain/Models/Skill.php`, `app/Modules/Skills/Domain/Models/SkillCategory.php`).

## Locale + translations behavior

- Admin validation restricts `locale` to “supported locales” resolved via the capability key `website.locales.supported.v1` (`app/Modules/Skills/Application/Services/SupportedLocalesResolver.php`, `app/Modules/Skills/Http/Requests/Skill/UpdateSkillRequest.php`, `app/Modules/Skills/Http/Requests/SkillCategory/UpdateSkillCategoryRequest.php`).
- When changing a skill/category base `locale` to a locale that already exists in translations, updates support a “swap” behavior controlled by `confirm_swap` (swaps base content with the translation and persists the previous base into translations) (`app/Modules/Skills/Application/UseCases/UpdateSkill/UpdateSkill.php`, `app/Modules/Skills/Application/Services/SkillLocaleSwapService.php`, `app/Modules/Skills/Application/UseCases/UpdateSkillCategory/UpdateSkillCategory.php`, `app/Modules/Skills/Application/Services/SkillCategoryLocaleSwapService.php`).

## Capabilities (public data exposure)

This module registers capability providers from its service provider (`app/Modules/Skills/Infrastructure/Providers/SkillsServiceProvider.php`):

- `skills.list.v1` → `SkillList` (`app/Modules/Skills/Application/Capabilities/Providers/SkillList.php`)
- `skills.grouped_by_category.v1` → `SkillsByCategory` (`app/Modules/Skills/Application/Capabilities/Providers/SkillsByCategory.php`)

These capabilities are used as data sources for CMS sections (e.g. `skills_primary` binds `skills.grouped_by_category.v1` into the `groups` field) (`resources/templates/skills/skills_primary/skills_primary.php`).
