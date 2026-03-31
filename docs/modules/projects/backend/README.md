# Projects (Backend)

Scope: admin CRUD for portfolio projects, project translations, project–skill associations, project images (stored via `image_attachments`), and public-facing exposure via a capability provider (for CMS rendering).

Evidence:

- Routes + wiring: `app/Modules/Projects/Routes/admin.php`, `app/Modules/Projects/Infrastructure/Providers/ProjectsServiceProvider.php`
- Controllers (admin): `app/Modules/Projects/Http/Controllers/ProjectController.php`
- Controllers (translations / JSON): `app/Modules/Projects/Http/Controllers/ProjectTranslationController.php`
- Controllers (images / delete endpoint): `app/Modules/Projects/Http/Controllers/ProjectImageController.php`
- Models: `app/Modules/Projects/Domain/Models/Project.php`, `app/Modules/Projects/Domain/Models/ProjectTranslation.php`
- Application layer: `app/Modules/Projects/Application/UseCases/*`, `app/Modules/Projects/Application/Services/*`
- Admin query + application mappers + DTOs: `app/Modules/Projects/Infrastructure/Queries/ProjectAdminListQuery.php`, `app/Modules/Projects/Infrastructure/Queries/ProjectAdminDetailQuery.php`, `app/Modules/Projects/Application/Mappers/ProjectAdminOutputMapper.php`, `app/Modules/Projects/Application/Mappers/ProjectTranslationOutputMapper.php`, `app/Modules/Projects/Application/UseCases/*`
- Dedicated admin/form input mappers: `app/Modules/Projects/Http/Mappers/ListProjectsInputMapper.php`, `app/Modules/Projects/Http/Mappers/CreateProjectInputMapper.php`, `app/Modules/Projects/Http/Mappers/UpdateProjectInputMapper.php`
- Skills integration (admin forms): `app/Modules/Projects/Http/Controllers/ProjectController.php`, `app/Modules/Projects/Application/Capabilities/CapabilitiesGateway.php`
- Persistence: `database/migrations/2025_11_22_130224_create_projects_table.php`, `database/migrations/2026_02_03_160000_add_locale_to_projects.php`, `database/migrations/2026_02_03_170000_rename_project_description_columns.php`, `database/migrations/2026_02_03_150000_add_project_translations.php`, `database/migrations/2026_02_06_110000_add_status_to_project_translations.php`
- Image pivot used by projects: `app/Modules/Projects/Domain/Models/Project.php`, `database/migrations/2025_12_16_191418_create_image_attachments_table.php`
- Capabilities: `app/Modules/Projects/Application/Capabilities/Providers/VisibleProjects.php`

## HTTP Surface

Routes are registered under `web + auth + verified` by `ProjectsServiceProvider` (`app/Modules/Projects/Infrastructure/Providers/ProjectsServiceProvider.php`).

### Admin routes

Declared in `app/Modules/Projects/Routes/admin.php`:

- Projects CRUD (no `show` route): `Route::resource('projects', ProjectController::class)->except(['show'])->names('projects')`
- Admin detail payload for the read-only overlay:
  - `GET /admin/projects/{project}/details` (`projects.details`) → returns the locale-aware detail contract consumed by the index overlay (`app/Modules/Projects/Http/Controllers/ProjectController.php`)
- Project images: `Route::resource('projects.images', ProjectImageController::class)->only(['destroy'])->names('projects.images')`
- Project translations:
  - `GET /admin/projects/{project}/translations` (`projects.translations.index`)
  - `POST /admin/projects/{project}/translations` (`projects.translations.store`)
  - `PUT /admin/projects/{project}/translations/{locale}` (`projects.translations.update`)
  - `DELETE /admin/projects/{project}/translations/{locale}` (`projects.translations.destroy`)

The admin index route now accepts table filter query params:

- `per_page`
- `search`
- `status`
- `visibility`
- `sort`
- `direction`
- `page`

These filters are normalized by `ListProjectsInputMapper`, transported through the dedicated `ListProjectsInput` DTO, passed through `ListProjects`, and applied in `ProjectAdminListQuery` via `ProjectRepository::paginateAdminList()`. `sort` is validated against a mapper whitelist, `direction` is only resolved for an active sortable column, and `page` is clamped back to the last valid page when the request lands out of range. The destroy flow also redirects back when possible so paginated/filter state can survive admin mutations (`app/Modules/Projects/Http/Controllers/ProjectController.php`, `app/Modules/Projects/Http/Mappers/ListProjectsInputMapper.php`, `app/Modules/Projects/Application/UseCases/ListProjects/ListProjectsInput.php`, `app/Modules/Projects/Application/UseCases/ListProjects/ListProjects.php`, `app/Modules/Projects/Infrastructure/Queries/ProjectAdminListQuery.php`, `app/Modules/Projects/Infrastructure/Repositories/ProjectRepository.php`).

Create and update requests now follow the same controller-orchestration pattern used in `courses`: `ProjectController` delegates request normalization to dedicated form mappers, and each use case consumes its own immutable DTO (`CreateProjectInput`, `UpdateProjectInput`) with only the fields needed for that logical flow (`app/Modules/Projects/Http/Mappers/CreateProjectInputMapper.php`, `app/Modules/Projects/Http/Mappers/UpdateProjectInputMapper.php`, `app/Modules/Projects/Application/UseCases/CreateProject/CreateProjectInput.php`, `app/Modules/Projects/Application/UseCases/UpdateProject/UpdateProjectInput.php`).

All `projects` use cases now expose dedicated input and output DTOs instead of receiving Eloquent models or returning shared DTOs / framework collections directly. That applies to admin list/detail/mutations, translation CRUD/listing, and the public `ListVisibleProjects` capability flow (`app/Modules/Projects/Application/UseCases/*`, `app/Modules/Projects/Application/Capabilities/Providers/VisibleProjects.php`). The DTO mapping now lives in `Application` mappers so the use cases no longer depend on `Presentation`.

The index contract is intentionally split from the detail contract:

- the paginated list returns lightweight rows through the dedicated `ListProjectItem` DTO with resolved locale-aware `name`, `summary`, `status`, visibility, and `image_count`
- the overlay fetches the full detail payload separately through `GetProjectDetails` / `GetProjectDetailsOutput`, including `description`, localized links, timestamps, and image metadata

The admin index serializes locale-aware content through `ProjectAdminOutputMapper`, while the edit form continues to use the base-record `ProjectMapper` so the editing contract stays aligned with the persisted source record. Detail loading for the overlay is now isolated in `GetProjectDetails` plus `ProjectAdminDetailQuery`, which keeps the controller from accumulating list/filter/eager-load responsibilities (`app/Modules/Projects/Application/Mappers/ProjectAdminOutputMapper.php`, `app/Modules/Projects/Presentation/Mappers/ProjectMapper.php`, `app/Modules/Projects/Application/UseCases/GetProjectDetails/GetProjectDetails.php`, `app/Modules/Projects/Infrastructure/Queries/ProjectAdminDetailQuery.php`).

Search and status filtering now follow the same locale resolution contract as the rendered list rows: the repository evaluates the active locale translation first, then the configured fallback translation, and only then the base project record. This keeps filtering aligned with what the admin user actually sees in the table (`app/Modules/Projects/Infrastructure/Repositories/ProjectRepository.php`, `app/Modules/Projects/Application/Mappers/ProjectAdminOutputMapper.php`).

Project status is now a canonical domain concept represented by `ProjectStatusValue` + `ProjectStatus`. The backend validates and transports canonical scalar values only, the Eloquent models expose domain-typed status accessors, and labels remain exclusively a frontend/i18n concern. The canonical values are `planned`, `in_progress`, `delivered`, and `maintenance`; legacy values such as `completed`, `published`, and the older Portuguese aliases are normalized to the new model through `ProjectStatus` plus a dedicated data migration (`app/Modules/Projects/Domain/Enums/ProjectStatusValue.php`, `app/Modules/Projects/Domain/ValueObjects/ProjectStatus.php`, `app/Modules/Projects/Domain/Models/Project.php`, `app/Modules/Projects/Domain/Models/ProjectTranslation.php`, `app/Modules/Projects/Http/Requests/Project/StoreProjectRequest.php`, `app/Modules/Projects/Http/Requests/Project/UpdateProjectRequest.php`, `app/Modules/Projects/Http/Requests/ProjectTranslation/StoreProjectTranslationRequest.php`, `app/Modules/Projects/Http/Requests/ProjectTranslation/UpdateProjectTranslationRequest.php`, `database/migrations/2026_03_31_000001_normalize_legacy_project_statuses.php`).

## Data model (persistence)

Base projects are stored in `projects` and include (among other fields) `locale`, `name`, `summary`, `description`, `status`, URLs and a `display` flag (`database/migrations/2025_11_22_130224_create_projects_table.php`, `database/migrations/2026_02_03_160000_add_locale_to_projects.php`, `database/migrations/2026_02_03_170000_rename_project_description_columns.php`).

### Rich text (`description`)

`description` is persisted as serialized Lexical JSON (normalized before write) using the shared RichText pipeline (`app/Modules/Shared/Contracts/RichText/IRichTextService.php`, `app/Modules/Shared/Support/RichText/LexicalRichTextService.php`).

Projects also enforce a domain-level character limit on visible/plain text via `ProjectDescription` (`app/Modules/Projects/Domain/ValueObjects/ProjectDescription.php`).

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

That capability now returns a form-oriented skill catalog shape rather than the full admin skills payload: each item includes the skill id, display name, optional category summary, and `skill_category_id`, which is enough for project form selection without coupling Projects to the Skills admin table contract (`app/Modules/Skills/Application/Capabilities/Providers/SkillList.php`, `app/Modules/Skills/Application/UseCases/ListSkills/ListSkills.php`).

This stays intentionally separate from the project detail payload used when editing an existing project, where attached skills are serialized as part of the project output instead of reusing the capability response verbatim (`app/Modules/Projects/Application/Mappers/ProjectAdminOutputMapper.php`, `resources/js/modules/projects/core/types.ts`).
