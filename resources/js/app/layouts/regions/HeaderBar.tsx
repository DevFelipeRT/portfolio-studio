'use client';

import type { PropsWithChildren } from 'react';
import { useAppLocalizationContext } from '../../shell';
import { LocaleSwitcher } from '../../../common/locale';
import {
  PageLink,
  pageRouter,
  usePageProps,
} from '../../../common/page-runtime';
import { useLayoutsTranslation } from '../i18n';
import ApplicationLogo from '../partials/application-logo/ApplicationLogo';
import { ModeToggle } from '../partials/theme/ModeToggle';
import { UserMenu } from '../partials/UserMenu';
import { ContentContainer } from '../primitives';

type AuthUser = {
  name: string;
  email: string;
  avatar?: string | null;
};

type SharedProps = {
  auth: {
    user: AuthUser | null;
  };
};

export function HeaderBar({ children }: PropsWithChildren) {
  const props = usePageProps<SharedProps>();
  const user = props.auth.user;
  const localizationContext = useAppLocalizationContext();
  const { translate: tHeader } = useLayoutsTranslation('header');
  const { translate: tNavigation } = useLayoutsTranslation('navigation');

  const headerLabel = tHeader('landmarkLabel', 'Application header');
  const homeLabel = tHeader('brand.homeLabel', 'Go to home page');

  return (
    <header
      id="app-header"
      className="border-border bg-popover/80 supports-[backdrop-filter]:bg-popover/60 sticky top-0 z-40 w-full border-b backdrop-blur"
      aria-label={headerLabel}
    >
      <ContentContainer
        contentWidth="default"
        className="3xl:h-20 flex h-14 items-center gap-3 sm:h-16"
      >
        <div className="order-1 flex flex-1 items-center gap-3">
          <PageLink
            href="/"
            className="flex items-center gap-3"
            aria-label={homeLabel}
          >
            <ApplicationLogo className="fill-current" />
          </PageLink>
        </div>

        <div
          className="order-3 flex items-center justify-center gap-4 md:order-2 md:flex-[2]"
          role="navigation"
          aria-label={tNavigation('primaryLabel', 'Primary navigation')}
        >
          {children}
        </div>

        <div className="order-2 flex flex-1 items-center justify-end gap-3 md:order-3">
          <ModeToggle />
          <LocaleSwitcher
            localization={{
              supportedLocales: localizationContext.supportedLocales,
            }}
            cookieName={localizationContext.persistence.cookieName ?? undefined}
            apiEndpoint={localizationContext.persistence.apiEndpoint ?? undefined}
            persistClientCookie={
              localizationContext.persistence.persistClientCookie
            }
            reload={() => {
              pageRouter.visit(window.location.href, {
                replace: true,
                preserveScroll: true,
                preserveState: true,
                headers: {
                  'Cache-Control': 'no-cache',
                },
              });
            }}
          />
          {user && (
            <div className="hidden md:flex">
              <UserMenu user={user} variant="icon" />
            </div>
          )}
        </div>
      </ContentContainer>
    </header>
  );
}

