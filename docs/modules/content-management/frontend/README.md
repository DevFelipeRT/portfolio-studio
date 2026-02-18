# Content Management (Frontend)

Scope: Inertia pages and UI for managing content pages/sections (admin) and rendering content-managed pages (public).

Evidence:

- Page registry: `resources/js/app/pages/content-management/pages.ts`
- Admin pages: `resources/js/app/pages/content-management/admin/*`
- Public renderer page: `resources/js/app/pages/content-management/public/rendered-page/page.tsx`
- Content management UI + rendering framework: `resources/js/modules/content-management/*`
- Template section component registry: `resources/js/modules/content-management/features/page-rendering/template/registry/componentRegistryProvider.ts`

## Page keys (Inertia)

Registered pages (`resources/js/app/pages/content-management/pages.ts`):

- `content-management/admin/PageIndex`
- `content-management/admin/PageCreate`
- `content-management/admin/PageEdit`
- `content-management/public/RenderedPage`

## Admin: page management

### Listing and filtering

- The admin index page applies filters via `router.get(route('admin.content.pages.index'), ...)` (`resources/js/app/pages/content-management/admin/page-index/page.tsx`).
- The server provides `extra.homeSlug` used to show “home” state and enable the “Set as home” action (`resources/js/app/pages/content-management/admin/page-index/page.tsx`, `app/Modules/ContentManagement/Presentation/Presenters/PageAdminPresenter.php`).

### Create and edit flows

- Create posts to `admin.content.pages.store` (`resources/js/app/pages/content-management/admin/page-create/page.tsx`).
- Edit persists changes with `put(route('admin.content.pages.update', page.id))` and supports deletion with `router.delete(route('admin.content.pages.destroy', page.id))` (`resources/js/app/pages/content-management/admin/page-edit/page.tsx`).

## Admin: section management (within PageEdit)

The edit screen wires CRUD operations for sections to Inertia endpoints using dedicated hooks (`resources/js/app/pages/content-management/admin/page-edit/page.tsx`):

- Create: `useCreateSection` → `router.post(route('admin.content.sections.store'), ...)` (`resources/js/modules/content-management/features/page-management/section/hooks/useCreateSection.ts`)
- Update: `useUpdateSection` → `route('admin.content.sections.update', sectionId)` (`resources/js/modules/content-management/features/page-management/section/hooks/useUpdateSection.ts`)
- Toggle active: `useToggleSectionActive` → `route('admin.content.sections.toggle-active', sectionId)` (`resources/js/modules/content-management/features/page-management/section/hooks/useToggleSectionActive.ts`)
- Delete: `useDeleteSection` → `router.delete(route('admin.content.sections.destroy', sectionId))` (`resources/js/modules/content-management/features/page-management/section/hooks/useDeleteSection.ts`)
- Reorder: `useReorderSections` → `router.post(route('admin.content.sections.reorder'), { page_id, ordered_ids })` (`resources/js/modules/content-management/features/page-management/section/hooks/useReorderSections.ts`)

The UI uses dialogs for creating and editing sections, passing available templates and navigation grouping derived from the current section list (`resources/js/app/pages/content-management/admin/page-edit/page.tsx`).

## Public: rendering model

### Section renderer + template resolution

The public `RenderedPage`:

- filters active sections (`section.is_active`)
- builds navigation items from visible sections
- renders all sections using `sectionSlotLayoutManager.render(visibleSections, templates)` (`resources/js/app/pages/content-management/public/rendered-page/page.tsx`).

At render-time, `SectionRenderer` chooses between:

- a template-specific React component (registered by template key), or
- a generic fallback renderer that prints non-empty field values (`resources/js/modules/content-management/features/page-rendering/rendering/section-renderer/SectionRenderer.tsx`, `resources/js/modules/content-management/features/page-rendering/rendering/section-renderer/RenderGenericTemplateSection.tsx`).

### Template component registry (ContentManagement origin)

The content-management module registers components for a subset of templates (`resources/js/modules/content-management/features/page-rendering/template/registry/componentRegistryProvider.ts`):

- `hero_primary` → `HeroPrimarySection`
- `rich_text` → `RichTextSection`
- `cards_grid_primary` → `CardsGridSection`

Each component reads fields through a shared `FieldValueResolver`, which merges section `data` and template defaults consistently across component-driven and generic rendering (`resources/js/modules/content-management/features/page-rendering/rendering/section-renderer/SectionRenderer.tsx`).

### Slot-based layout

`SectionSlotLayoutManager` groups sections by their `slot` (`hero`, `main`, `secondary`, `footer`, or `other`) and renders each slot group in a semantic container (`header`, `main`, `aside`, `footer`) when applicable (`resources/js/modules/content-management/features/page-rendering/rendering/SectionSlotLayout.tsx`).

## SEO metadata (client-side Head)

`RenderedPage` uses Inertia `<Head>` to set title and basic OpenGraph tags using page fields (`meta_title`, `meta_description`, `meta_image_url`) (`resources/js/app/pages/content-management/public/rendered-page/page.tsx`).

