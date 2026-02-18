# Identity & Access (Frontend)

Scope: Inertia pages and UI for login, email verification, password confirmation/update, and profile editing.

Evidence:

- Page registry: `resources/js/app/pages/auth/pages.ts`, `resources/js/app/pages/profile/pages.ts`
- Auth pages: `resources/js/app/pages/auth/public/*`
- Profile page: `resources/js/app/pages/profile/admin/edit/page.tsx`

## Page keys (Inertia)

Registered auth pages (`resources/js/app/pages/auth/pages.ts`):

- `auth/public/Login`
- `auth/public/VerifyEmail`
- `auth/public/ConfirmPassword`
- `auth/public/Register`
- `auth/public/ForgotPassword`
- `auth/public/ResetPassword`

Registered profile page (`resources/js/app/pages/profile/pages.ts`):

- `profile/admin/Edit`

## Important consistency note

Some auth pages exist on the frontend but their backend routes are currently disabled (commented out):

- `auth/public/Register` expects `route('register')` (`resources/js/app/pages/auth/public/register/page.tsx`), but `/register` is commented out in `app/Modules/IdentityAccess/Routes/auth.php`.
- `auth/public/ForgotPassword` and `auth/public/ResetPassword` are registered in `resources/js/app/pages/auth/pages.ts`, but the related routes (`password.request`, `password.email`, `password.reset`, `password.store`) are commented out in `app/Modules/IdentityAccess/Routes/auth.php`.

The login page only shows the “Forgot your password?” link when the backend route exists (`canResetPassword` prop computed by `Route::has('password.request')`) (`app/Modules/IdentityAccess/Http/Controllers/Auth/AuthenticatedSessionController.php`, `resources/js/app/pages/auth/public/login/page.tsx`).

