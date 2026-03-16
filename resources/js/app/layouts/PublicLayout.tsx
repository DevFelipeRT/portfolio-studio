// resources/js/Layouts/PublicLayout.tsx

import { MobileSidebar } from '@/app/layouts/partials/MobileSidebar';
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
import Footer from './partials/Footer';
import Header from './partials/Header';

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

        <main className="w-full flex flex-1">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
