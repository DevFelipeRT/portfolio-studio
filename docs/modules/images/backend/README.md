# Images (Backend)

Scope: a global image library (upload + metadata) and a shared attachment model used by other modules (projects, initiatives, content sections).

Evidence:

- Routes: `app/Modules/Images/Routes/admin.php`
- Controller + service: `app/Modules/Images/Http/Controllers/ImageController.php`, `app/Modules/Images/Application/Services/ImageService.php`
- Models: `app/Modules/Images/Domain/Models/Image.php`, `app/Modules/Images/Domain/Models/ImageAttachment.php`
- Migrations: `database/migrations/2025_11_09_145616_create_images_table.php`, `database/migrations/2025_12_16_191418_create_image_attachments_table.php`, `database/migrations/2025_12_20_164054_add_slot_to_image_attachments_table.php`
- Allowed disks + morph map: `config/images.php`, `config/image_owners.php`, `app/Providers/AppServiceProvider.php`
- Orphan pruning command: `app/Console/Commands/PruneOrphanImages.php`, `routes/console.php`

## HTTP Surface (Admin)

Routes are registered under `admin/*` and protected by `web`, `auth`, `verified` via the module service provider (`app/Modules/Images/Infrastructure/Providers/ImagesServiceProvider.php`, `app/Modules/Images/Routes/admin.php`).

- `GET /admin/images` → list + filters + pagination (`app/Modules/Images/Http/Controllers/ImageController.php`)
- `GET /admin/images/create` → create form (`app/Modules/Images/Http/Controllers/ImageController.php`)
- `POST /admin/images` → upload image + store metadata (`app/Modules/Images/Http/Controllers/ImageController.php`)
- `GET /admin/images/{image}/edit` → edit global metadata + usage (`app/Modules/Images/Http/Controllers/ImageController.php`)
- `PUT/PATCH /admin/images/{image}` → update global metadata (`app/Modules/Images/Http/Controllers/ImageController.php`, `app/Modules/Images/Http/Requests/Image/UpdateImageRequest.php`)
- `DELETE /admin/images/{image}` → delete DB record + attachments + stored file (`app/Modules/Images/Http/Controllers/ImageController.php`, `app/Modules/Images/Application/Services/ImageService.php`)
- `DELETE /admin/images/bulk-destroy` → bulk delete (`app/Modules/Images/Routes/admin.php`, `app/Modules/Images/Http/Controllers/ImageController.php`)

### List filters

`GET /admin/images` accepts these query params (controller-level evidence):

- `search` (matches filename/title/alt/caption) (`app/Modules/Images/Application/Services/ImageService.php`)
- `usage`: `orphans` | `used` (`app/Modules/Images/Application/Services/ImageService.php`)
- `mime_type` (`app/Modules/Images/Application/Services/ImageService.php`)
- `storage_disk` (`app/Modules/Images/Application/Services/ImageService.php`)
- `per_page` (default `15`) (`app/Modules/Images/Http/Controllers/ImageController.php`)

## Data model

### `images`

Stores the canonical file location and global metadata (`database/migrations/2025_11_09_145616_create_images_table.php`):

- `storage_disk`, `storage_path`
- `original_filename`, `mime_type`, `file_size_bytes`
- `image_width`, `image_height`
- `alt_text`, `image_title`, `caption`

`Image::url` computes a public URL via the configured filesystem disk and prefixes `APP_URL` when needed (`app/Modules/Images/Domain/Models/Image.php`).

### `image_attachments` (polymorphic)

Links an image to an owning entity via `owner_type` + `owner_id` and stores ordering and display fields (`database/migrations/2025_12_16_191418_create_image_attachments_table.php`, `database/migrations/2025_12_20_164054_add_slot_to_image_attachments_table.php`):

- `owner_type`, `owner_id`
- `slot` (nullable; part of uniqueness)
- `position`, `is_cover`, `caption`

The application enforces a morph map for stable owner types (`config/image_owners.php`, `app/Providers/AppServiceProvider.php`).

Known morph aliases include:

- `project` → `App\Modules\Projects\Domain\Models\Project` (`config/image_owners.php`)
- `initiative` → `App\Modules\Initiatives\Domain\Models\Initiative` (`config/image_owners.php`)
- `page_section` → `App\Modules\ContentManagement\Domain\Models\PageSection` (`config/image_owners.php`)

## Storage policy (allowed disks)

The image subsystem restricts which filesystem disks can be used for persisted images (`config/images.php`).

- Allowed disks: `public` (default) (`config/images.php`, `app/Modules/Images/Application/Services/ImageService.php`)

## Orphan cleanup

There are two complementary mechanisms for cleaning up stored files:

- “Soft” cleanup when detaching from an owner: services call `ImageService::deleteIfOrphan(...)` after detaching an attachment (`app/Modules/Projects/Application/Services/ProjectImageService.php`, `app/Modules/Initiatives/Application/Services/InitiativeImageService.php`).
- Scheduled pruning command that scans storage and deletes files that have no DB record:
  - Command: `images:prune-orphans` (`app/Console/Commands/PruneOrphanImages.php`)
  - Schedule: daily at `00:00` UTC (`routes/console.php`)

