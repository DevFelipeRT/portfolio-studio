// resources/js/Layouts/PublicLayout.tsx

import { MobileSidebar } from '@/app/layouts/partials/MobileSidebar';
import { FooterBar } from '@/app/layouts/regions/FooterBar';
import { HeaderBar } from '@/app/layouts/regions/HeaderBar';
import { ThemeProvider } from '@/app/layouts/partials/theme/ThemeProvider';
import {
  Navigation,
  type AuthUser,
  type NavigationItem,
} from '@/app/navigation';
import { useNavigationSheet } from '@/app/navigation/useNavigationSheet';
import { useLayoutsTranslation } from '@/app/layouts/i18n';
import { useCurrentPage } from '@/common/page-runtime';
import { useIsMobile } from '@/hooks/useMobile';
import { PropsWithChildren } from 'react';

type SharedProps = {
  auth: {
    user: AuthUser | null;
  };
};

type PublicLayoutProps = PropsWithChildren<{
  navigationItems?: NavigationItem[];
}>;

export default function PublicLayout({
  children,
  navigationItems,
}: PublicLayoutProps) {
  return (
    <PublicLayoutI18nContent navigationItems={navigationItems}>
      {children}
    </PublicLayoutI18nContent>
  );
}

function PublicLayoutI18nContent({
  children,
  navigationItems,
}: PublicLayoutProps) {
  const page = useCurrentPage();
  const { auth } = page.props as SharedProps;
  const url = page.url ?? '';
  const isMobile = useIsMobile();
  const { isSheetOpen, setIsSheetOpen } = useNavigationSheet(url);
  const { translate: translateFromNavigation } =
    useLayoutsTranslation('navigation');

  const navItems: NavigationItem[] = navigationItems ?? [];
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

        <main className="flex w-full flex-1 flex-col">{children}</main>

        <FooterBar />
      </div>
    </ThemeProvider>
  );
}
