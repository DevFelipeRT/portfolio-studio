# Images (Frontend)

Scope: Inertia pages and UI for the admin “image library”: listing with filters, upload, metadata editing, and preview dialogs.

Evidence:

- Page registry: `resources/js/app/pages/images/pages.ts`
- Pages: `resources/js/app/pages/images/admin/*`
- UI module: `resources/js/modules/images/*`

## Page keys (Inertia)

Registered pages (`resources/js/app/pages/images/pages.ts`):

- `images/admin/Index` (`resources/js/app/pages/images/admin/index/page.tsx`)
- `images/admin/Create` (`resources/js/app/pages/images/admin/create/page.tsx`)
- `images/admin/Edit` (`resources/js/app/pages/images/admin/edit/page.tsx`)

## Runtime behavior

### List + filters

The index page uses Inertia `router.get(...)` to apply filters and paginate while preserving state/scroll (`resources/js/app/pages/images/admin/index/page.tsx`).

Filters sent to the backend include:

- `search`, `usage`, `mime_type`, `storage_disk`, `per_page`, `page` (`resources/js/app/pages/images/admin/index/page.tsx`)

### Preview dialog (no navigation)

Clicking an image opens a client-side preview dialog (no dedicated “show” route/page) (`resources/js/app/pages/images/admin/index/page.tsx`, `resources/js/modules/images/ui/ImagePreviewDialog.tsx`).

### Delete

Deletion is performed via `router.delete(route('images.destroy', image.id))` (`resources/js/app/pages/images/admin/index/page.tsx`).

## Potentially-unused endpoint

The backend provides `images.bulk-destroy` (`app/Modules/Images/Routes/admin.php`), but no frontend usage was found in `resources/js/**` at the time this doc was generated.

