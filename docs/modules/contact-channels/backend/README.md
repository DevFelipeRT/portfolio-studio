# Contact Channels (Backend)

Scope: admin CRUD for contact channels (type + value normalization, activation, ordering), translation endpoints, a small public JSON API, and a capability provider used by CMS sections.

Evidence:

- Routes + wiring: `app/Modules/ContactChannels/Routes/admin.php`, `app/Modules/ContactChannels/Routes/public.php`, `app/Modules/ContactChannels/Infrastructure/Providers/ContactChannelsServiceProvider.php`
- Controllers (admin + public + translations): `app/Modules/ContactChannels/Http/Controllers/Admin/ContactChannelController.php`, `app/Modules/ContactChannels/Http/Controllers/Public/ContactChannelController.php`, `app/Modules/ContactChannels/Http/Controllers/ContactChannelTranslationController.php`
- Models + enums: `app/Modules/ContactChannels/Domain/Models/ContactChannel.php`, `app/Modules/ContactChannels/Domain/Models/ContactChannelTranslation.php`, `app/Modules/ContactChannels/Domain/Enums/ContactChannelType.php`
- Use cases: `app/Modules/ContactChannels/Application/UseCases/*`
- Normalization + href building: `app/Modules/ContactChannels/Application/Services/ContactChannelValueNormalizer.php`, `app/Modules/ContactChannels/Domain/Services/ContactChannelHrefBuilder.php`
- Locale support + swap behavior: `app/Modules/ContactChannels/Application/Services/SupportedLocalesResolver.php`, `app/Modules/ContactChannels/Application/Services/ContactChannelLocaleSwapService.php`, `app/Modules/ContactChannels/Application/UseCases/UpdateContactChannel/UpdateContactChannel.php`
- Persistence: `database/migrations/2026_01_23_000001_create_contact_channels_table.php`, `database/migrations/2026_02_06_140000_add_locale_to_contact_channels.php`, `database/migrations/2026_02_06_141000_add_contact_channel_translations.php`
- Capabilities: `app/Modules/ContactChannels/Application/Capabilities/Providers/VisibleContactChannels.php`

## HTTP Surface

Routes are registered under the `web` middleware group by `ContactChannelsServiceProvider` (`app/Modules/ContactChannels/Infrastructure/Providers/ContactChannelsServiceProvider.php`):

- Admin routes: `web + auth + verified`
- Public route: `web`

### Admin routes

Declared explicitly in `app/Modules/ContactChannels/Routes/admin.php`:

- CRUD:
  - `GET /admin/contact-channels` (`contact-channels.index`)
  - `GET /admin/contact-channels/create` (`contact-channels.create`)
  - `GET /admin/contact-channels/{contactChannel}/edit` (`contact-channels.edit`)
  - `POST /admin/contact-channels` (`contact-channels.store`)
  - `PUT /admin/contact-channels/{contactChannel}` (`contact-channels.update`)
  - `DELETE /admin/contact-channels/{contactChannel}` (`contact-channels.destroy`)
- Ordering:
  - `POST /admin/contact-channels/reorder` (`contact-channels.reorder`)
- Activation:
  - `POST /admin/contact-channels/{contactChannel}/toggle-active` (`contact-channels.toggle-active`)
- Translations:
  - `GET /admin/contact-channels/{contactChannel}/translations` (`contact-channels.translations.index`)
  - `POST /admin/contact-channels/{contactChannel}/translations` (`contact-channels.translations.store`)
  - `PUT /admin/contact-channels/{contactChannel}/translations/{locale}` (`contact-channels.translations.update`)
  - `DELETE /admin/contact-channels/{contactChannel}/translations/{locale}` (`contact-channels.translations.destroy`)

Note: the reorder route has a full backend implementation (`app/Modules/ContactChannels/Infrastructure/Repositories/ContactChannelRepository.php`, `app/Modules/ContactChannels/Application/UseCases/ReorderContactChannels/ReorderContactChannels.php`), but the current admin index UI focuses on edit/toggle-active/delete actions and does not wire a reorder interaction (`resources/js/app/pages/contact-channels/admin/index/page.tsx`).

### Public route

Declared in `app/Modules/ContactChannels/Routes/public.php` and returns JSON (`app/Modules/ContactChannels/Http/Controllers/Public/ContactChannelController.php`):

- `GET /contact-channels` (`contact-channels.public.index`)

This endpoint accepts an optional `locale` query parameter and uses `app()->getFallbackLocale()` for fallback (`app/Modules/ContactChannels/Http/Controllers/Public/ContactChannelController.php`).

## Data model (persistence)

Base records are stored in `contact_channels` (`database/migrations/2026_01_23_000001_create_contact_channels_table.php`) and include:

- `channel_type`, `label` (nullable), `value`, `is_active`, `sort_order`
- `locale` added later (`database/migrations/2026_02_06_140000_add_locale_to_contact_channels.php`)

Translations are stored in `contact_channel_translations` (unique `(contact_channel_id, locale)`) (`database/migrations/2026_02_06_141000_add_contact_channel_translations.php`).

## Value normalization + href derivation

When creating/updating contact channels, `value` is normalized based on channel type (`app/Modules/ContactChannels/Application/Services/ContactChannelValueNormalizer.php`).

For output, the module can derive a click-ready `href` (e.g. `mailto:`, `tel:`, profile URLs) from the stored value via `ContactChannelHrefBuilder` (`app/Modules/ContactChannels/Domain/Services/ContactChannelHrefBuilder.php`).

## Locale + translations behavior

- Admin validation restricts `locale` to supported locales resolved via the capability key `website.locales.supported.v1` (`app/Modules/ContactChannels/Application/Services/SupportedLocalesResolver.php`, `app/Modules/ContactChannels/Http/Requests/ContactChannel/UpdateContactChannelRequest.php`).
- When changing a channel base `locale` to a locale that already exists in translations, updates support an explicit swap behavior controlled by `confirm_swap` (`app/Modules/ContactChannels/Application/UseCases/UpdateContactChannel/UpdateContactChannel.php`, `app/Modules/ContactChannels/Application/Services/ContactChannelLocaleSwapService.php`).

## Capabilities (public data exposure)

The module registers `contact-channels.visible.v1` via `VisibleContactChannels` (`app/Modules/ContactChannels/Infrastructure/Providers/ContactChannelsServiceProvider.php`, `app/Modules/ContactChannels/Application/Capabilities/Providers/VisibleContactChannels.php`).

This capability is used as a CMS section data source: the `contact_primary` template binds `contact-channels.visible.v1` into the section’s `contact_channels` field (`resources/templates/contact-channels/contact_primary/contact_primary.php`).
