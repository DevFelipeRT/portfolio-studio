import ApplicationLogo from '@/app/layouts/partials/application-logo/ApplicationLogo';
import { ThemeProvider } from '@/app/layouts/partials/theme/ThemeProvider';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

/**
 * Guest layout for authentication pages.
 *
 * Renders the application logo and a centered card for auth forms.
 */
export default function Guest({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
        <div>
          <Link href="/">
            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
          </Link>
        </div>

        <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
