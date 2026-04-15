# Mail / Contact Messages (Frontend)

Scope: UI for submitting a contact message on the public site and for managing messages in the admin inbox.

Evidence:

- Page registry: `resources/js/app/pages/messages/pages.ts`
- Admin messages page: `resources/js/app/pages/messages/admin/index/page.tsx`
- Modal overlay: `resources/js/modules/messages/ui/MessageOverlay.tsx`
- Shared table helpers used by the inbox: `resources/js/common/table/partials/TableCard.tsx`, `resources/js/common/table/partials/TablePagination.tsx`, `resources/js/common/table/query.ts`
- Public contact form section: `resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`

## Admin inbox

### Page key (Inertia)

- `messages/admin/Index` (`resources/js/app/pages/messages/pages.ts`)

### Details UI (modal, no navigation)

Message “details” are shown using a client-side modal overlay rather than a dedicated `messages.show` page (`resources/js/app/pages/messages/admin/index/page.tsx`, `resources/js/modules/messages/ui/MessageOverlay.tsx`).

The page owns the inbox heading/description/summary badges, and the table now renders without duplicating that copy inside its card shell (`resources/js/app/pages/messages/admin/index/page.tsx`, `resources/js/modules/messages/ui/MessagesHeader.tsx`, `resources/js/modules/messages/ui/MessagesTable.tsx`).

The admin inbox table uses the shared `resources/js/common/table` primitives for card shell, interactive rows, row actions, the composable `ItemDialog` detail overlay surface, and `TablePagination`, while keeping inbox-specific status rendering and message actions inside the module (`resources/js/modules/messages/ui/MessagesTable.tsx`, `resources/js/modules/messages/ui/MessagesRow.tsx`, `resources/js/modules/messages/ui/MessageOverlay.tsx`, `resources/js/common/table/item-dialog/ItemDialog.tsx`).

The inbox list is paginated on the backend through a canonical list flow (`ListMessagesInputMapper` -> `ListMessages` -> `MessageAdminListQuery` -> `MessagePagePresenter`) while preserving the important-first, newest-first inbox default as explicit table state. The page reads rows directly from the server paginator, keeps draft filter state synchronized with the applied backend query, and uses shared query helpers for `page` / `per_page` transitions plus inbox-aware filtering by search, seen status, and priority (`app/Modules/Mail/Http/Controllers/MessageController.php`, `app/Modules/Mail/Http/Mappers/ListMessagesInputMapper.php`, `app/Modules/Mail/Application/UseCases/ListMessages/ListMessages.php`, `app/Modules/Mail/Infrastructure/Queries/MessageAdminListQuery.php`, `app/Modules/Mail/Presentation/Presenters/MessagePagePresenter.php`, `resources/js/common/table/query.ts`).

The table exposes a dedicated `Priority` column separate from `Status`, supports server-driven ordering on `From`, `Status`, `Priority`, and `When`, and now distinguishes the generic inbox empty state from the filtered zero-results state without reintroducing local shadow collection state (`resources/js/app/pages/messages/admin/index/page.tsx`, `resources/js/modules/messages/ui/MessagesTable.tsx`, `resources/js/modules/messages/ui/MessagesRow.tsx`).

The inbox header exposes server-derived badges for `Results`, `Unread`, and `Important`, explicitly scoped to the current filtered result set instead of implying a global inbox summary (`resources/js/modules/messages/ui/MessagesHeader.tsx`, `app/Modules/Mail/Http/Controllers/MessageController.php`, `app/Modules/Mail/Application/UseCases/ListMessages/ListMessages.php`).

The page now keeps only the selected message id in local state and derives the overlay record from `messages.data`, so the modal and table stay anchored to the same server-driven source of truth after revalidation (`resources/js/app/pages/messages/admin/index/page.tsx`, `resources/js/modules/messages/ui/MessageOverlay.tsx`).

### Backend interactions

The admin inbox uses these route names:

- `messages.mark-as-seen`, `messages.mark-as-unseen` (`resources/js/app/pages/messages/admin/index/page.tsx`)
- `messages.mark-as-important`, `messages.mark-as-not-important` (`resources/js/app/pages/messages/admin/index/page.tsx`)
- `messages.destroy` (`resources/js/app/pages/messages/admin/index/page.tsx`)

## Public contact form

The public contact form posts to `messages.store` via Inertia `useForm().post(...)`, and the backend persists the message through `CreateMessage` before enqueueing the optional host notification flow (`resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`, `app/Modules/Mail/Application/UseCases/CreateMessage/CreateMessage.php`, `app/Modules/Mail/Application/Jobs/SendHostNotificationForMessage.php`).
