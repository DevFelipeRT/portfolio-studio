# Mail / Contact Messages (Frontend)

Scope: UI for submitting a contact message on the public site and for managing messages in the admin inbox.

Evidence:

- Page registry: `resources/js/app/pages/messages/pages.ts`
- Admin messages page: `resources/js/app/pages/messages/admin/index/page.tsx`
- Modal overlay: `resources/js/modules/messages/ui/MessageOverlay.tsx`
- Public contact form section: `resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`

## Admin inbox

### Page key (Inertia)

- `messages/admin/Index` (`resources/js/app/pages/messages/pages.ts`)

### Details UI (modal, no navigation)

Message “details” are shown using a client-side modal overlay rather than a dedicated `messages.show` page (`resources/js/app/pages/messages/admin/index/page.tsx`, `resources/js/modules/messages/ui/MessageOverlay.tsx`).

### Backend interactions

The admin inbox uses these route names:

- `messages.mark-as-seen`, `messages.mark-as-unseen` (`resources/js/app/pages/messages/admin/index/page.tsx`)
- `messages.mark-as-important`, `messages.mark-as-not-important` (`resources/js/app/pages/messages/admin/index/page.tsx`)
- `messages.destroy` (`resources/js/app/pages/messages/admin/index/page.tsx`)

## Public contact form

The public contact form posts to `messages.store` via Inertia `useForm().post(...)` (`resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`).

