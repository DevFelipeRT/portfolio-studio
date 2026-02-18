# Contact Channels (Frontend)

Scope: admin Inertia pages to manage contact channels (including translations), plus the public “contact primary” CMS section implementation (contact form + social links).

Evidence:

- Admin page registry: `resources/js/app/pages/contact-channels/pages.ts`
- Admin pages: `resources/js/app/pages/contact-channels/admin/index/page.tsx`, `resources/js/app/pages/contact-channels/admin/create/page.tsx`, `resources/js/app/pages/contact-channels/admin/edit/page.tsx`
- Admin UI components: `resources/js/modules/contact-channels/ui/ContactChannelForm.tsx`, `resources/js/modules/contact-channels/ui/TranslationModal.tsx`
- Translation API calls: `resources/js/modules/contact-channels/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/contact-channels/sectionRegistryProvider.ts`, `resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `resources/js/modules/contact-channels/ui/SocialLinksBar.tsx`
- CMS template definition (data source binding): `resources/templates/contact-channels/contact_primary/contact_primary.php`
- Contact form submission target (Mail module): `resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `routes/web.php`, `app/Modules/Mail/Http/Controllers/MessageController.php`

## Admin UI (Inertia)

Pages are registered under keys like `contact-channels/admin/Index` and rendered from the backend controller (`resources/js/app/pages/contact-channels/pages.ts`, `app/Modules/ContactChannels/Http/Controllers/Admin/ContactChannelController.php`).

- Index lists channels and uses Inertia `Link` with `method="post"` to toggle active (`contact-channels.toggle-active`) and `method="delete"` to delete (`contact-channels.destroy`) (`resources/js/app/pages/contact-channels/admin/index/page.tsx`).
- Create/edit pages use `ContactChannelForm` and submit to `contact-channels.store` / `contact-channels.update` (`resources/js/app/pages/contact-channels/admin/create/page.tsx`, `resources/js/app/pages/contact-channels/admin/edit/page.tsx`, `resources/js/modules/contact-channels/ui/ContactChannelForm.tsx`).

## Translations (modal UX)

The edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/contact-channels/admin/edit/page.tsx`, `resources/js/modules/contact-channels/core/api/translations.ts`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/contact-channels/core/api/translations.ts`).

## CMS section: `contact_primary`

This module contributes a public section component to the Content Management renderer:

- Registry: `contact_primary` → `ContactPrimarySection` (`resources/js/modules/contact-channels/sectionRegistryProvider.ts`)
- Template data source: `contact-channels.visible.v1` injected into section field `contact_channels` (`resources/templates/contact-channels/contact_primary/contact_primary.php`)
- Renderer maps the `contact_channels` array into a `SocialLinksBar` and also renders a contact form (`resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `resources/js/modules/contact-channels/ui/SocialLinksBar.tsx`)

The contact form posts to `route('messages.store')` (public contact form endpoint) (`resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `routes/web.php`).
