# Courses (Backend)

Scope: admin CRUD for courses, translation endpoints, locale-aware persistence, and public-facing “visible courses” exposure via capabilities (for CMS rendering).

Evidence:

- Routes + wiring: `app/Modules/Courses/Routes/admin.php`, `app/Modules/Courses/Infrastructure/Providers/CoursesServiceProvider.php`
- Controllers (admin): `app/Modules/Courses/Http/Controllers/CourseController.php`
- Controllers (translations / JSON): `app/Modules/Courses/Http/Controllers/CourseTranslationController.php`
- Models + enums: `app/Modules/Courses/Domain/Models/Course.php`, `app/Modules/Courses/Domain/Models/CourseTranslation.php`, `app/Modules/Courses/Domain/Enums/CourseCategories.php`
- Use cases: `app/Modules/Courses/Application/UseCases/*`
- Locale support + swap behavior: `app/Modules/Courses/Application/Services/SupportedLocalesResolver.php`, `app/Modules/Courses/Application/Services/CourseLocaleSwapService.php`, `app/Modules/Courses/Application/UseCases/UpdateCourse/UpdateCourse.php`
- Persistence (schema evolution): `database/migrations/2025_11_24_201327_create_courses_table.php`, `database/migrations/2025_11_29_191432_add_category_and_nullable_start_date_to_courses_table.php`, `database/migrations/2025_12_02_141224_rename_columns_in_courses_table.php`, `database/migrations/2026_02_03_120000_add_course_translations.php`, `database/migrations/2026_02_06_100000_add_locale_to_courses.php`
- Capabilities: `app/Modules/Courses/Application/Capabilities/Providers/VisibleCourses.php`

## HTTP Surface

Routes are registered under `web + auth + verified` by `CoursesServiceProvider` (`app/Modules/Courses/Infrastructure/Providers/CoursesServiceProvider.php`).

### Admin routes

Courses CRUD is a resource route excluding `show` (`app/Modules/Courses/Routes/admin.php`):

- `Route::resource('courses', CourseController::class)->except(['show'])->names('courses')`

`CourseController::index()` supports a `per_page` query parameter (default `15`) (`app/Modules/Courses/Http/Controllers/CourseController.php`).

### Translation JSON endpoints

Declared in `app/Modules/Courses/Routes/admin.php` and handled by `CourseTranslationController`:

- `GET /admin/courses/{course}/translations` (`courses.translations.index`)
- `POST /admin/courses/{course}/translations` (`courses.translations.store`)
- `PUT /admin/courses/{course}/translations/{locale}` (`courses.translations.update`)
- `DELETE /admin/courses/{course}/translations/{locale}` (`courses.translations.destroy`)

## Data model (persistence)

The base table was introduced and later renamed to align with the application’s “summary/description” and “started_at/completed_at” naming (`database/migrations/2025_11_24_201327_create_courses_table.php`, `database/migrations/2025_12_02_141224_rename_columns_in_courses_table.php`).

Notable changes:

- Category column was added and `start_date` became nullable (later renamed) (`database/migrations/2025_11_29_191432_add_category_and_nullable_start_date_to_courses_table.php`)
- Translation records are stored in `course_translations` (unique `(course_id, locale)`) (`database/migrations/2026_02_03_120000_add_course_translations.php`)
- Base records store a `locale` column (`database/migrations/2026_02_06_100000_add_locale_to_courses.php`)

The Course model casts `category` to an enum and appends a computed `status` attribute derived from date fields (`app/Modules/Courses/Domain/Models/Course.php`).

### Rich text (`description`)

`description` is persisted as serialized Lexical JSON (normalized before write) using the shared RichText pipeline (`app/Modules/Shared/Contracts/RichText/IRichTextService.php`, `app/Modules/Shared/Support/RichText/LexicalRichTextService.php`).

## Locale + translations behavior

- Admin validation restricts `locale` to supported locales resolved via the capability key `website.locales.supported.v1` (`app/Modules/Courses/Application/Services/SupportedLocalesResolver.php`, `app/Modules/Courses/Http/Requests/Course/UpdateCourseRequest.php`).
- When changing a course base `locale` to a locale that already exists in translations, updates support an explicit swap behavior controlled by `confirm_swap` (`app/Modules/Courses/Application/UseCases/UpdateCourse/UpdateCourse.php`, `app/Modules/Courses/Application/Services/CourseLocaleSwapService.php`).

## Capabilities (public data exposure)

The module registers `courses.visible.v1` via `VisibleCourses` (`app/Modules/Courses/Infrastructure/Providers/CoursesServiceProvider.php`, `app/Modules/Courses/Application/Capabilities/Providers/VisibleCourses.php`).

This capability is used as a CMS section data source: the `courses_highlight_grid` template binds `courses.visible.v1` into the section’s `courses` field (`resources/templates/courses/courses_highlight_grid/courses_highlight_grid.php`).
