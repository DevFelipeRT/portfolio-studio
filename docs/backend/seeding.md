# Database seeding (local dev/demo)

This repository includes deterministic seeders designed for **local development**, **UI previews**, and **demo content**.

Seeders live under `database/seeders/` and are orchestrated by `DatabaseSeeder` (`database/seeders/DatabaseSeeder.php`).

## How to run

Run the full seeding pipeline (includes an admin user and module data):

```sh
php artisan db:seed
```

If you want a clean rebuild (drops all tables and recreates them), use:

```sh
php artisan migrate:fresh --seed
```

You can also run a single module seeder:

```sh
php artisan db:seed --class=Database\\Seeders\\ProjectsSeeder
```

Notes:

- `composer setup` currently runs migrations, but **does not** run seeders (`composer.json`).
- Seeded images are stored on the `public` filesystem disk (`app/Modules/Images/Application/Services/ImageService.php`). For local access via `/storage/...`, ensure you have the symlink:
  ```sh
  php artisan storage:link
  ```

## Seeded content (high level)

`DatabaseSeeder` creates a default admin user:

- Email: `admin@example.com`
- Password: `password`

Then it calls (in order) (`database/seeders/DatabaseSeeder.php`):

- `WebsiteSettingsSeeder`: global site settings (`database/seeders/WebsiteSettingsSeeder.php`)
- `SkillsSeeder`: skill categories + skills + translations (`database/seeders/SkillsSeeder.php`)
- `CoursesSeeder`: courses + translations (`database/seeders/CoursesSeeder.php`)
- `ContactChannelsSeeder`: contact channels + translations (`database/seeders/ContactChannelsSeeder.php`)
- `ExperiencesSeeder`: experiences + translations (`database/seeders/ExperiencesSeeder.php`)
- `ImagesSeeder`: imports committed seed images declared in a manifest (`database/seeders/ImagesSeeder.php`)
- `ProjectsSeeder`: projects + translations + skill links + seeded images (`database/seeders/ProjectsSeeder.php`)
- `InitiativesSeeder`: initiatives + translations + seeded images (`database/seeders/InitiativesSeeder.php`)
- `ContentManagementSeeder`: pages + sections for public rendering (attaches hero image) (`database/seeders/ContentManagementSeeder.php`)
- `MailSeeder`: demo inbox messages (`database/seeders/MailSeeder.php`)

## Determinism and safety

These seeders are intentionally **deterministic**, which means:

- Most module seeders delete existing records for that module before inserting seed data (e.g. `Project::query()->delete()`).
- Projects/initiatives/content-management seeders also delete their `image_attachments` rows for their owner types (when the table exists) before reseeding (`database/seeders/ProjectsSeeder.php`, `database/seeders/InitiativesSeeder.php`, `database/seeders/ContentManagementSeeder.php`).
- `ImagesSeeder` deletes previously seeded images **by `original_filename`** and deletes their stored files via `ImageService::deleteCompletely(...)` (`database/seeders/ImagesSeeder.php`, `app/Modules/Images/Application/Services/ImageService.php`).

Do **not** run these seeders against a database that contains real content you want to keep.

Additionally, all seeders in `database/seeders/*` are blocked when `APP_ENV=production` (they throw an exception at runtime).

## Seed image assets (manifest + attribution)

Seed images are committed under:

- Assets: `database/seeders/assets/images/`
- Manifest: `database/seeders/assets/images/manifest.json`
- Attribution: `database/seeders/assets/images/ATTRIBUTION.md`

The manifest is the source of truth for what `ImagesSeeder` imports. Projects/initiatives attach images by matching the seeded item label to the manifest and then resolving the stored image by `original_filename` (`database/seeders/ProjectsSeeder.php`, `database/seeders/InitiativesSeeder.php`).

### Local preview gallery

For quick visual inspection of the committed seed assets:

- Preview page: `database/seeders/assets/images/_preview/index.html`
- Contact sheet: `database/seeders/assets/images/_preview/contact_sheet.jpg`

### Adding a new seed image

1. Add the image file under `database/seeders/assets/images/{module}/...`.
2. Add an entry to `database/seeders/assets/images/manifest.json` with (at minimum) `module`, `seeder_item`, and `local_path`.
3. Update `database/seeders/assets/images/ATTRIBUTION.md` with the source and license.
4. Ensure the `seeder_item` matches whatever your module seeder uses as the lookup key (for projects/initiatives this is the record `name`).
