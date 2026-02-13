import { definePageRegistry } from '@/app/pages/registryHelpers';

export const authPages = definePageRegistry({
  'auth/public/ConfirmPassword': () => import('./public/confirm-password/page'),
  'auth/public/ForgotPassword': () => import('./public/forgot-password/page'),
  'auth/public/Login': () => import('./public/login/page'),
  'auth/public/Register': () => import('./public/register/page'),
  'auth/public/ResetPassword': () => import('./public/reset-password/page'),
  'auth/public/VerifyEmail': () => import('./public/verify-email/page'),
});
