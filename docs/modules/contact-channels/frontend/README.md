# Contact Channels (Frontend)

Scope: admin Inertia pages to manage contact channels (including translations), plus the public “contact primary” CMS section implementation (contact form + social links).

Evidence:

- Admin page registry: `resources/js/app/pages/contact-channels/pages.ts`
- Admin pages: `resources/js/app/pages/contact-channels/admin/index/page.tsx`, `resources/js/app/pages/contact-channels/admin/create/page.tsx`, `resources/js/app/pages/contact-channels/admin/edit/page.tsx`
- Admin UI components: `resources/js/modules/contact-channels/ui/table/ContactChannelsTable.tsx`, `resources/js/modules/contact-channels/ui/table/ContactChannelsRow.tsx`, `resources/js/modules/contact-channels/ui/ContactChannelOverlay.tsx`, `resources/js/modules/contact-channels/ui/form/contact-channel/ContactChannelForm.tsx`, `resources/js/modules/contact-channels/ui/TranslationModal.tsx`
- Shared table helpers used by the index: `resources/js/common/table/partials/TableCard.tsx`, `resources/js/common/table/partials/TablePagination.tsx`, `resources/js/common/table/query.ts`
- Translation API calls: `resources/js/modules/contact-channels/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/contact-channels/sectionRegistryProvider.ts`, `resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `resources/js/modules/contact-channels/ui/SocialLinksBar.tsx`
- CMS template definition (data source binding): `resources/templates/contact-channels/contact_primary/contact_primary.php`
- Contact form submission target (Mail module): `resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `routes/web.php`, `app/Modules/Mail/Http/Controllers/MessageController.php`

## Admin UI (Inertia)

Pages are registered under keys like `contact-channels/admin/Index` and rendered from the backend controller (`resources/js/app/pages/contact-channels/pages.ts`, `app/Modules/ContactChannels/Http/Controllers/Admin/ContactChannelController.php`).

- Index lists channels, opens a read-only details overlay from the row, and uses Inertia `Link` with `method="post"` to toggle active (`contact-channels.toggle-active`) and `method="delete"` to delete (`contact-channels.destroy`) (`resources/js/app/pages/contact-channels/admin/index/page.tsx`, `resources/js/modules/contact-channels/ui/ContactChannelOverlay.tsx`).
- The index page now owns the visible heading/description and passes the create CTA through `TableCard.header`; the table no longer owns page-level copy (`resources/js/app/pages/contact-channels/admin/index/page.tsx`, `resources/js/modules/contact-channels/ui/table/ContactChannelsTable.tsx`).
- The contact channels admin table uses the shared `resources/js/common/table` primitives for card shell, header slot, action cell, actions menu, and `TablePagination`, while keeping channel-type labeling and toggle behavior inside the module (`resources/js/modules/contact-channels/ui/table/ContactChannelsTable.tsx`, `resources/js/modules/contact-channels/ui/table/ContactChannelsRow.tsx`).
- This module intentionally keeps `Active` / `Inactive` status language instead of the `Visibility` / `Public` / `Private` vocabulary used by publication-oriented modules, because the underlying concept here is channel availability (`resources/js/modules/contact-channels/ui/table/ContactChannelsTable.tsx`, `resources/js/modules/contact-channels/ui/table/ContactChannelsRow.tsx`, `resources/js/modules/contact-channels/ui/ContactChannelOverlay.tsx`).
- The admin list now uses a paginated backend contract, shared query helpers for `page` / `per_page` transitions, lightweight filtering by search, type, and active status, and query-driven sorting on visible columns (`app/Modules/ContactChannels/Http/Controllers/Admin/ContactChannelController.php`, `app/Modules/ContactChannels/Application/UseCases/ListContactChannels/ListContactChannels.php`, `app/Modules/ContactChannels/Infrastructure/Repositories/ContactChannelRepository.php`, `resources/js/common/table/query.ts`).
- The default list order remains the editorial `sort_order` then `id` sequence; interactive table sorting is an admin-view concern and does not replace the persisted ordering used by reorder flows and public rendering (`app/Modules/ContactChannels/Infrastructure/Repositories/ContactChannelRepository.php`, `resources/js/app/pages/contact-channels/admin/index/page.tsx`, `resources/js/modules/contact-channels/ui/table/ContactChannelsTable.tsx`).
- Create/edit pages use `ContactChannelForm` and submit to `contact-channels.store` / `contact-channels.update` (`resources/js/app/pages/contact-channels/admin/create/page.tsx`, `resources/js/app/pages/contact-channels/admin/edit/page.tsx`, `resources/js/modules/contact-channels/ui/form/contact-channel/ContactChannelForm.tsx`).

## Translations (modal UX)

The edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/contact-channels/admin/edit/page.tsx`, `resources/js/modules/contact-channels/core/api/translations.ts`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/contact-channels/core/api/translations.ts`).

## CMS section: `contact_primary`

This module contributes a public section component to the Content Management renderer:

- Registry: `contact_primary` → `ContactPrimarySection` (`resources/js/modules/contact-channels/sectionRegistryProvider.ts`)
- Template data source: `contact-channels.visible.v1` injected into section field `contact_channels` (`resources/templates/contact-channels/contact_primary/contact_primary.php`)
- Renderer maps the `contact_channels` array into a `SocialLinksBar` and also renders a contact form (`resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `resources/js/modules/contact-channels/ui/SocialLinksBar.tsx`)

The contact form posts to `route('messages.store')` (public contact form endpoint) (`resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `routes/web.php`).
