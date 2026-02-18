# Experiences (Backend)

Scope: admin CRUD for experiences, translation endpoints, locale-aware persistence, and public-facing experience data exposure via capabilities (for CMS rendering).

Evidence:

- Routes + wiring: `app/Modules/Experiences/Routes/admin.php`, `app/Modules/Experiences/Infrastructure/Providers/ExperiencesServiceProvider.php`
- Controllers (admin): `app/Modules/Experiences/Http/Controllers/ExperienceController.php`
- Controllers (translations / JSON): `app/Modules/Experiences/Http/Controllers/ExperienceTranslationController.php`
- Models: `app/Modules/Experiences/Domain/Models/Experience.php`, `app/Modules/Experiences/Domain/Models/ExperienceTranslation.php`
- Use cases: `app/Modules/Experiences/Application/UseCases/*`
- Locale support + swap behavior: `app/Modules/Experiences/Application/Services/SupportedLocalesResolver.php`, `app/Modules/Experiences/Application/Services/ExperienceLocaleSwapService.php`, `app/Modules/Experiences/Application/UseCases/UpdateExperience/UpdateExperience.php`
- Persistence: `database/migrations/2025_11_24_181514_create_experiences_table.php`, `database/migrations/2026_01_22_000001_rename_experience_descriptions_columns.php`, `database/migrations/2026_02_03_130000_add_experience_translations.php`, `database/migrations/2026_02_03_140000_add_locale_to_experiences.php`
- Capabilities: `app/Modules/Experiences/Application/Capabilities/Providers/VisibleExperiences.php`

## HTTP Surface

Routes are registered under `web + auth + verified` by `ExperiencesServiceProvider` (`app/Modules/Experiences/Infrastructure/Providers/ExperiencesServiceProvider.php`).

### Admin routes

Experiences CRUD is declared as a resource (`app/Modules/Experiences/Routes/admin.php`):

- `Route::resource('experiences', ExperienceController::class)->except(['show'])->names('experiences')`

### Translation JSON endpoints

Declared in `app/Modules/Experiences/Routes/admin.php` and handled by `ExperienceTranslationController`:

- `GET /admin/experiences/{experience}/translations` (`experiences.translations.index`)
- `POST /admin/experiences/{experience}/translations` (`experiences.translations.store`)
- `PUT /admin/experiences/{experience}/translations/{locale}` (`experiences.translations.update`)
- `DELETE /admin/experiences/{experience}/translations/{locale}` (`experiences.translations.destroy`)

## Data model (persistence)

The base experiences table was introduced and later renamed to match the `summary` / `description` naming used by the application layer (`database/migrations/2025_11_24_181514_create_experiences_table.php`, `database/migrations/2026_01_22_000001_rename_experience_descriptions_columns.php`).

Translation records are stored separately (`database/migrations/2026_02_03_130000_add_experience_translations.php`), and base records store a `locale` column (`database/migrations/2026_02_03_140000_add_locale_to_experiences.php`).

The Eloquent model exposes the translation relationship (`app/Modules/Experiences/Domain/Models/Experience.php`).

## Locale + translations behavior

- Admin validation restricts `locale` to supported locales resolved via the capability key `website.locales.supported.v1` (`app/Modules/Experiences/Application/Services/SupportedLocalesResolver.php`, `app/Modules/Experiences/Http/Requests/Experience/UpdateExperienceRequest.php`).
- When changing a base experience `locale` to a locale that already exists in translations, updates support an explicit swap behavior controlled by `confirm_swap` (`app/Modules/Experiences/Application/UseCases/UpdateExperience/UpdateExperience.php`, `app/Modules/Experiences/Application/Services/ExperienceLocaleSwapService.php`).

## Capabilities (public data exposure)

The module registers `experiences.visible.v1` via `VisibleExperiences` (`app/Modules/Experiences/Infrastructure/Providers/ExperiencesServiceProvider.php`, `app/Modules/Experiences/Application/Capabilities/Providers/VisibleExperiences.php`).

This capability is used as a CMS section data source: the `experience_timeline` template binds `experiences.visible.v1` into the section’s `experiences` field (`resources/templates/experiences/experience_timeline/experience_timeline.php`).
