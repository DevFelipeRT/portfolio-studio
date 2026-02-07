// resources/js/Layouts/AuthenticatedLayout.tsx

import { MobileSidebar } from '@/app/layouts/partials/MobileSidebar';
import { ThemeProvider } from '@/app/layouts/partials/theme/ThemeProvider';
import {
  Navigation,
  type AuthUser,
  type NavigationItem,
} from '@/app/navigation';
import type { NavigationConfigNode } from '@/app/navigation/configTypes';
import { useNavigationSheet } from '@/app/navigation/hooks/useNavigationSheet';
import { NAMESPACES, useTranslation } from '@/Common/i18n';
import { Alert, AlertDescription, AlertTitle } from '@/Components/Ui/alert';
import { Toaster } from '@/Components/Ui/sonner';
import { navigationConfig } from '@/config/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import Footer from './partials/Footer';
import Header from './partials/Header';

type SharedProps = {
  auth: {
    user: AuthUser | null;
  };
  errors: Record<string, string>;
  status?: string | null;
};

function mapConfigToNavigationItems(
  items: NavigationConfigNode[],
  translate: (key: string, fallback: string) => string,
): NavigationItem[] {
  return items.map<NavigationItem>((item) => {
    const base = {
      id: item.id,
      label: translate(item.translationKey, item.fallbackLabel),
    };

    if (item.kind === 'link') {
      const href = route(item.routeName);
      const isActive =
        !!route().current(item.routeName) ||
        !!item.children?.some(
          (child) => child.kind === 'link' && route().current(child.routeName),
        );

      const children = item.children
        ? mapConfigToNavigationItems(item.children, translate)
        : undefined;

      return {
        ...base,
        kind: 'link',
        href,
        isActive,
        children,
      };
    }

    if (item.kind === 'section') {
      const children = item.children
        ? mapConfigToNavigationItems(item.children, translate)
        : undefined;

      return {
        ...base,
        kind: 'section',
        targetId: item.targetId,
        scrollToTop: item.scrollToTop,
        children,
      };
    }

    const children = item.children
      ? mapConfigToNavigationItems(item.children, translate)
      : undefined;

    return {
      ...base,
      kind: 'group',
      children,
    };
  });
}

export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const page = usePage();
  const { auth, errors, status } = page.props as SharedProps;
  const { url } = page;
  const { translate: translateFromLayout } = useTranslation(NAMESPACES.layout);
  const { translate: translateFromCommon } = useTranslation(NAMESPACES.common);
  const isMobile = useIsMobile();
  const { isSheetOpen, setIsSheetOpen } = useNavigationSheet(url);

  const navItems: NavigationItem[] = mapConfigToNavigationItems(
    navigationConfig,
    (key, fallback) => translateFromLayout(key, fallback),
  );

  const hasErrors = !!errors && Object.keys(errors).length > 0;

  useEffect(() => {
    if (!status) {
      return;
    }

    if (status.endsWith('.failed') || status.endsWith('_failed')) {
      return;
    }

    const messageKey = `flash.${status}`;
    const message = translateFromLayout(messageKey, status);

    toast.success(message);
  }, [status, translateFromLayout]);

  const openNavigationLabel = translateFromCommon(
    'navigation.openMenu',
    'Open navigation menu',
  );

  const mobileNavigationTitle = translateFromLayout(
    'header.navigation.mobileTitle',
    'Navigation',
  );

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="text-foreground flex min-h-dvh w-full flex-col">
        <Header>
          {!isMobile ? (
            <Navigation items={navItems} />
          ) : (
            <MobileSidebar
              isOpen={isSheetOpen}
              setIsOpen={setIsSheetOpen}
              openNavigationLabel={openNavigationLabel}
              mobileNavigationTitle={mobileNavigationTitle}
              user={auth.user}
            >
              <Navigation
                items={navItems}
                onClose={() => setIsSheetOpen(false)}
              />
            </MobileSidebar>
          )}
        </Header>

        <main className="w-full grow py-4 sm:py-6">
          {header && (
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {header}
            </div>
          )}

          <div className="mx-auto max-w-7xl grow px-4 sm:px-6 lg:px-8">
            {hasErrors && (
              <div className="mb-4">
                <Alert variant="destructive">
                  <AlertTitle>
                    {translateFromLayout(
                      'validation.title',
                      'There were some problems with your submission.',
                    )}
                  </AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {children}
          </div>
        </main>

        <Footer />

        <Toaster richColors closeButton />
      </div>
    </ThemeProvider>
  );
}
