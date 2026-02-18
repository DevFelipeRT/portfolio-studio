# Mail / Contact Messages (Backend)

Scope: accepting contact form submissions, persisting them, optionally sending a host notification email, and providing admin inbox actions (list, mark as seen/important, delete).

Evidence:

- Routes: `routes/web.php`, `app/Modules/Mail/Routes/admin.php`
- Controller + service: `app/Modules/Mail/Http/Controllers/MessageController.php`, `app/Modules/Mail/Application/Services/MessageService.php`
- Request validation: `app/Modules/Mail/Http/Requests/StoreMessageRequest.php`
- Model + migration: `app/Modules/Mail/Domain/Models/Message.php`, `database/migrations/2025_11_25_185130_create_messages_table.php`
- Mailable + view: `app/Modules/Mail/Domain/ValueObjects/ContactMessageReceived.php`, `resources/views/emails/contact-message.blade.php`
- Mail config/env: `config/mail.php`, `.env.example`

## HTTP Surface

### Public submission

- `POST /contact/messages` (named `messages.store`) persists a new message and redirects back with a success flash message (`routes/web.php`, `app/Modules/Mail/Http/Controllers/MessageController.php`)

Validation rules (`app/Modules/Mail/Http/Requests/StoreMessageRequest.php`):

- `name`: required, string, max 255
- `email`: required, valid email, max 255
- `message`: required, string, max 2000

### Admin inbox

Admin routes are registered under `admin/*` and protected by `web`, `auth`, `verified` (`app/Modules/Mail/Infrastructure/Providers/MailServiceProvider.php`, `app/Modules/Mail/Routes/admin.php`).

- `GET /admin/messages` (named `messages.index`) lists messages ordered by `important` then `created_at` (`app/Modules/Mail/Http/Controllers/MessageController.php`, `app/Modules/Mail/Application/Services/MessageService.php`)
- `PATCH /admin/messages/{message}/seen` (named `messages.mark-as-seen`) toggles `seen=true` (`app/Modules/Mail/Routes/admin.php`, `app/Modules/Mail/Application/Services/MessageService.php`)
- `PATCH /admin/messages/{message}/unseen` (named `messages.mark-as-unseen`) toggles `seen=false` (`app/Modules/Mail/Routes/admin.php`)
- `PATCH /admin/messages/{message}/important` (named `messages.mark-as-important`) toggles `important=true` (`app/Modules/Mail/Routes/admin.php`)
- `PATCH /admin/messages/{message}/not-important` (named `messages.mark-as-not-important`) toggles `important=false` (`app/Modules/Mail/Routes/admin.php`)
- `DELETE /admin/messages/{message}` (named `messages.destroy`) deletes a message (`app/Modules/Mail/Routes/admin.php`, `app/Modules/Mail/Application/Services/MessageService.php`)

## Persistence

Messages are stored in the `messages` table with fields:

- `name`, `email`, `message`, `important`, `seen`, timestamps (`database/migrations/2025_11_25_185130_create_messages_table.php`)

## Email notification behavior

On message creation, the app attempts to send a host notification email (`app/Modules/Mail/Application/Services/MessageService.php`):

- Recipient: `config('mail.to.address')` (configured via `MAIL_TO_ADDRESS`) (`config/mail.php`, `.env.example`)
- If `MAIL_TO_ADDRESS` is empty, the notification is skipped (`app/Modules/Mail/Application/Services/MessageService.php`)
- Email content uses the `emails.contact-message` view (`app/Modules/Mail/Domain/ValueObjects/ContactMessageReceived.php`, `resources/views/emails/contact-message.blade.php`)

