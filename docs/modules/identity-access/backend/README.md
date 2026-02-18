# Identity & Access (Backend)

Scope: authentication, email verification, password confirmation/update, and profile management.

Evidence:

- Routes: `app/Modules/IdentityAccess/Routes/auth.php`, `app/Modules/IdentityAccess/Routes/profile.php`
- Service provider (route loading): `app/Modules/IdentityAccess/Infrastructure/Providers/IdentityAccessServiceProvider.php`
- Controllers: `app/Modules/IdentityAccess/Http/Controllers/Auth/*`, `app/Modules/IdentityAccess/Http/Controllers/ProfileController.php`
- Requests: `app/Modules/IdentityAccess/Http/Requests/Auth/LoginRequest.php`, `app/Modules/IdentityAccess/Http/Requests/ProfileUpdateRequest.php`

## HTTP Surface

All routes are registered under the `web` middleware group by `IdentityAccessServiceProvider` (`app/Modules/IdentityAccess/Infrastructure/Providers/IdentityAccessServiceProvider.php`).

### Guest routes (enabled)

- `GET /login` → renders `auth/public/Login` (`app/Modules/IdentityAccess/Routes/auth.php`, `app/Modules/IdentityAccess/Http/Controllers/Auth/AuthenticatedSessionController.php`)
- `POST /login` → authenticates (rate limited) (`app/Modules/IdentityAccess/Routes/auth.php`, `app/Modules/IdentityAccess/Http/Requests/Auth/LoginRequest.php`)

### Authenticated routes (enabled)

- `POST /logout` (`app/Modules/IdentityAccess/Routes/auth.php`, `app/Modules/IdentityAccess/Http/Controllers/Auth/AuthenticatedSessionController.php`)
- `GET /verify-email` → renders `auth/public/VerifyEmail` unless already verified (`app/Modules/IdentityAccess/Routes/auth.php`, `app/Modules/IdentityAccess/Http/Controllers/Auth/EmailVerificationPromptController.php`)
- `GET /verify-email/{id}/{hash}` (signed + throttled) → marks email as verified (`app/Modules/IdentityAccess/Routes/auth.php`, `app/Modules/IdentityAccess/Http/Controllers/Auth/VerifyEmailController.php`)
- `POST /email/verification-notification` (throttled) → resends verification email (`app/Modules/IdentityAccess/Routes/auth.php`)
- `GET /confirm-password` → renders `auth/public/ConfirmPassword` (`app/Modules/IdentityAccess/Http/Controllers/Auth/ConfirmablePasswordController.php`)
- `POST /confirm-password` → validates password and sets `auth.password_confirmed_at` in session (`app/Modules/IdentityAccess/Http/Controllers/Auth/ConfirmablePasswordController.php`)
- `PUT /password` → validates current password and updates it (`app/Modules/IdentityAccess/Routes/auth.php`, `app/Modules/IdentityAccess/Http/Controllers/Auth/PasswordController.php`)

### Profile routes (enabled; authenticated)

- `GET /profile` → renders `profile/admin/Edit` (`app/Modules/IdentityAccess/Routes/profile.php`, `app/Modules/IdentityAccess/Http/Controllers/ProfileController.php`)
- `PATCH /profile` → updates name/email; clears `email_verified_at` when email changes (`app/Modules/IdentityAccess/Routes/profile.php`, `app/Modules/IdentityAccess/Http/Controllers/ProfileController.php`, `app/Modules/IdentityAccess/Http/Requests/ProfileUpdateRequest.php`)
- `DELETE /profile` → deletes user account (requires `current_password`) (`app/Modules/IdentityAccess/Routes/profile.php`, `app/Modules/IdentityAccess/Http/Controllers/ProfileController.php`)

## Disabled routes (present but commented out)

The following typical auth flows are currently commented out (not registered) in `app/Modules/IdentityAccess/Routes/auth.php`:

- Registration: `GET /register`, `POST /register`
- Password reset: `GET/POST /forgot-password`, `GET /reset-password/{token}`, `POST /reset-password`

Maintainer note: these are intentionally disabled for a personal project (per repository owner).

## Inertia integration notes

- The login page receives `canResetPassword` computed via `Route::has('password.request')` (`app/Modules/IdentityAccess/Http/Controllers/Auth/AuthenticatedSessionController.php`), which will be `false` while the password reset routes are disabled.

