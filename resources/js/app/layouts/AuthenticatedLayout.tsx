// resources/js/Layouts/AuthenticatedLayout.tsx

import { MobileSidebar } from '@/app/layouts/partials/MobileSidebar';
import { ContentContainer } from '@/app/layouts/primitives';
import { FooterBar } from '@/app/layouts/regions/FooterBar';
import { HeaderBar } from '@/app/layouts/regions/HeaderBar';
import { ThemeProvider } from '@/app/layouts/partials/theme/ThemeProvider';
import {
  Navigation,
  type AuthUser,
  type NavigationItem,
} from '@/app/navigation';
import type { NavigationConfigNode } from '@/app/navigation/types';
import { useNavigationSheet } from '@/app/navigation/useNavigationSheet';
import { useLayoutsTranslation } from '@/app/layouts/i18n';
import { I18N_NAMESPACES, useTranslation } from '@/common/i18n';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toaster } from '@/components/ui/sonner';
import { useCurrentPage } from '@/common/page-runtime';
import { navigationConfig } from '@/config/navigation';
import { useIsMobile } from '@/hooks/useMobile';
import { PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type SharedProps = {
  auth: {
    user: AuthUser | null;
  };
  errors: Record<string, unknown>;
  status?: string | null;
};

const GLOBAL_ERROR_KEYS = new Set(['global', 'message', 'error', 'server']);

function collectGlobalErrorMessages(errors: Record<string, unknown>): string[] {
  return Object.entries(errors).flatMap(([key, value]) => {
    if (!GLOBAL_ERROR_KEYS.has(key)) {
      return [];
    }

    if (typeof value === 'string') {
      return value.trim().length > 0 ? [value] : [];
    }

    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    if (!value || typeof value !== 'object') {
      return [];
    }

    return Object.values(value as Record<string, unknown>)
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  });
}

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
  children,
}: PropsWithChildren) {
  return <AuthenticatedI18nContent>{children}</AuthenticatedI18nContent>;
}

function AuthenticatedI18nContent({
  children,
}: PropsWithChildren) {
  const page = useCurrentPage();
  const { auth, errors, status } = page.props as SharedProps;
  const url = page.url ?? '';
  const { translate: translateFeedback } = useTranslation(I18N_NAMESPACES.feedback);
  const { translate: translateState } = useTranslation(I18N_NAMESPACES.state);
  const isMobile = useIsMobile();
  const { isSheetOpen, setIsSheetOpen } = useNavigationSheet(url);

  const { translate: translateFromNavigation } =
    useLayoutsTranslation('navigation');

  const navItems: NavigationItem[] = mapConfigToNavigationItems(
    navigationConfig,
    (key, fallback) => translateFromNavigation(key, fallback),
  );

  const globalErrorMessages = collectGlobalErrorMessages(errors ?? {});
  const hasGlobalErrors = globalErrorMessages.length > 0;

  useEffect(() => {
    if (!status) {
      return;
    }

    if (status.endsWith('.failed') || status.endsWith('_failed')) {
      return;
    }

    const message = translateFeedback(status, status);

    toast.success(message);
  }, [status, translateFeedback]);

  const openNavigationLabel = translateFromNavigation(
    'openMenu',
    'Open navigation menu',
  );

  const mobileNavigationTitle = translateFromNavigation(
    'mobileTitle',
    'Navigation',
  );

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="text-foreground flex min-h-dvh w-full flex-col">
        <HeaderBar>
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
        </HeaderBar>

        <main className="w-full grow py-4 sm:py-6">
          <div className="grow">
            {hasGlobalErrors && (
              <ContentContainer contentWidth="default" className="mb-4">
                <Alert variant="destructive">
                  <AlertTitle>
                    {translateState('error', 'Something went wrong.')}
                  </AlertTitle>
                  <AlertDescription>
                    <p className="text-sm">{globalErrorMessages.join(' ')}</p>
                  </AlertDescription>
                </Alert>
              </ContentContainer>
            )}

            {children}
          </div>
        </main>

        <FooterBar />

        <Toaster richColors closeButton />
      </div>
    </ThemeProvider>
  );
}
