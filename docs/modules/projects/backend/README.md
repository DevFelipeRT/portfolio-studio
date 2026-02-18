# Projects (Backend)

Scope: admin CRUD for portfolio projects, project translations, project–skill associations, project images (stored via `image_attachments`), and public-facing exposure via a capability provider (for CMS rendering).

Evidence:

- Routes + wiring: `app/Modules/Projects/Routes/admin.php`, `app/Modules/Projects/Infrastructure/Providers/ProjectsServiceProvider.php`
- Controllers (admin): `app/Modules/Projects/Http/Controllers/ProjectController.php`
- Controllers (translations / JSON): `app/Modules/Projects/Http/Controllers/ProjectTranslationController.php`
- Controllers (images / delete endpoint): `app/Modules/Projects/Http/Controllers/ProjectImageController.php`
- Models: `app/Modules/Projects/Domain/Models/Project.php`, `app/Modules/Projects/Domain/Models/ProjectTranslation.php`
- Application layer: `app/Modules/Projects/Application/UseCases/*`, `app/Modules/Projects/Application/Services/*`
- Skills integration (admin forms): `app/Modules/Projects/Http/Controllers/ProjectController.php`, `app/Modules/Projects/Application/Capabilities/CapabilitiesGateway.php`
- Persistence: `database/migrations/2025_11_22_130224_create_projects_table.php`, `database/migrations/2026_02_03_160000_add_locale_to_projects.php`, `database/migrations/2026_02_03_170000_rename_project_description_columns.php`, `database/migrations/2026_02_03_150000_add_project_translations.php`, `database/migrations/2026_02_06_110000_add_status_to_project_translations.php`
- Image pivot used by projects: `app/Modules/Projects/Domain/Models/Project.php`, `database/migrations/2025_12_16_191418_create_image_attachments_table.php`
- Capabilities: `app/Modules/Projects/Application/Capabilities/Providers/VisibleProjects.php`

## HTTP Surface

Routes are registered under `web + auth + verified` by `ProjectsServiceProvider` (`app/Modules/Projects/Infrastructure/Providers/ProjectsServiceProvider.php`).

### Admin routes

Declared in `app/Modules/Projects/Routes/admin.php`:

- Projects CRUD (no `show` route): `Route::resource('projects', ProjectController::class)->except(['show'])->names('projects')`
- Project images: `Route::resource('projects.images', ProjectImageController::class)->only(['destroy'])->names('projects.images')`
- Project translations:
  - `GET /admin/projects/{project}/translations` (`projects.translations.index`)
  - `POST /admin/projects/{project}/translations` (`projects.translations.store`)
  - `PUT /admin/projects/{project}/translations/{locale}` (`projects.translations.update`)
  - `DELETE /admin/projects/{project}/translations/{locale}` (`projects.translations.destroy`)

## Data model (persistence)

Base projects are stored in `projects` and include (among other fields) `locale`, `name`, `summary`, `description`, `status`, URLs and a `display` flag (`database/migrations/2025_11_22_130224_create_projects_table.php`, `database/migrations/2026_02_03_160000_add_locale_to_projects.php`, `database/migrations/2026_02_03_170000_rename_project_description_columns.php`).

Translations are stored in `project_translations` (unique `(project_id, locale)`) and include localized copies of the content fields plus a translation-level `status` (`database/migrations/2026_02_03_150000_add_project_translations.php`, `database/migrations/2026_02_06_110000_add_status_to_project_translations.php`, `app/Modules/Projects/Domain/Models/ProjectTranslation.php`).

Projects can be associated with:

- Images via `image_attachments` morph pivot (`Project::images()` in `app/Modules/Projects/Domain/Models/Project.php`).
- Skills via the `project_skill` pivot (`Project::skills()` in `app/Modules/Projects/Domain/Models/Project.php`, `database/migrations/2026_01_19_191549_transform_technologies_to_skills.php`).

## Images behavior (replace vs delete)

- Project create/update requests accept an `images[]` payload (files + optional metadata), and the use cases replace the project image collection when images are provided (`app/Modules/Projects/Http/Requests/Project/StoreProjectRequest.php`, `app/Modules/Projects/Http/Requests/Project/UpdateProjectRequest.php`, `app/Modules/Projects/Application/UseCases/CreateProject/CreateProject.php`, `app/Modules/Projects/Application/UseCases/UpdateProject/UpdateProject.php`).
- Existing images can be deleted via `projects.images.destroy`, which delegates to `ProjectImageService::detach()` (`app/Modules/Projects/Http/Controllers/ProjectImageController.php`, `app/Modules/Projects/Application/Services/ProjectImageService.php`).

## Locale + translations behavior

- Admin validation restricts `locale` to supported locales resolved via the capability key `website.locales.supported.v1` (`app/Modules/Projects/Application/Services/SupportedLocalesResolver.php`, `app/Modules/Projects/Http/Requests/Project/StoreProjectRequest.php`, `app/Modules/Projects/Http/Requests/Project/UpdateProjectRequest.php`).
- When changing a project base `locale` to a locale that already exists in translations, updates support a swap behavior controlled by `confirm_swap` (`app/Modules/Projects/Application/UseCases/UpdateProject/UpdateProject.php`, `app/Modules/Projects/Application/Services/ProjectLocaleSwapService.php`).

## Capabilities (public data exposure)

The module registers `projects.visible.v1` via `VisibleProjects` (`app/Modules/Projects/Infrastructure/Providers/ProjectsServiceProvider.php`, `app/Modules/Projects/Application/Capabilities/Providers/VisibleProjects.php`).

This capability is used by Content Management templates as a data source: `project_highlight_list` binds `projects.visible.v1` into the section’s `projects` field (`resources/templates/projects/project_highlight_list/project_highlight_list.php`).

## Admin skills integration

The project create/edit payload includes a “skills catalog” resolved via `skills.list.v1` using the module’s `CapabilitiesGateway` (`app/Modules/Projects/Http/Controllers/ProjectController.php`, `app/Modules/Projects/Application/Capabilities/CapabilitiesGateway.php`).

