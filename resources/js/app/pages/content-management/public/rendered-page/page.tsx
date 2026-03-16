// resources/js/app/pages/content-management/public/RenderedPage.tsx
import PublicLayout from '@/app/layouts/PublicLayout';
import { PageHead } from '@/common/page-runtime';
import { RenderedPageLoadingState } from './partials/RenderedPageLoadingState';
import {
  buildNavigationItems,
  buildPageRenderingContext,
  deriveI18nScopeFromSections,
  PageRenderingContextProvider,
  sectionSlotLayoutManager,
} from '@/modules/content-management/features/page-rendering';
import type {
  PageRenderViewModelProps,
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/modules/content-management/types';
import { defaultStringNormalizer } from '@/modules/content-management/utils/strings';
import { JSX } from 'react';

// TEMP (DEV): set to `true` to keep the loader visible while testing UI.
const FORCE_RENDERED_PAGE_LOADER = false;

/**
 * Public screen that renders a content-managed page using the SectionRenderer.
 */
export default function RenderedPage({
  page,
  sections,
  extra,
}: PageRenderViewModelProps): JSX.Element {
  const templates: TemplateDefinitionDto[] = Array.isArray(extra?.templates)
    ? extra.templates
    : [];

  const visibleSections = sections.filter((section) => section.is_active);

  const navigationItems = buildNavigationItems(
    visibleSections,
    defaultStringNormalizer,
  );

  const headTitle: string = page.meta_title || page.title;
  const headDescription: string | undefined =
    page.meta_description || undefined;
  const headImageUrl: string | undefined = page.meta_image_url || undefined;

  const renderingContext = buildPageRenderingContext([]);

  if (FORCE_RENDERED_PAGE_LOADER) {
    return (
      <PublicLayout navigationItems={[]}>
        <RenderedPageLoadingState />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout navigationItems={navigationItems}>
      <PageRenderingContextProvider value={renderingContext}>
        <PageHead title={headTitle}>
          {headDescription && (
            <meta name="description" content={headDescription} />
          )}

          {headImageUrl && (
            <>
              <meta property="og:title" content={headTitle} />
              <meta property="og:description" content={headDescription ?? ''} />
              <meta property="og:image" content={headImageUrl} />
            </>
          )}
        </PageHead>

        {sectionSlotLayoutManager.render(visibleSections, templates)}
      </PageRenderingContextProvider>
    </PublicLayout>
  );
}

RenderedPage.getI18nScope = (props: unknown) => {
  const sections = (props as { sections?: PageSectionDto[] }).sections;
  if (!Array.isArray(sections)) {
    return [];
  }

  const active = sections.filter((section) => section.is_active);
  return deriveI18nScopeFromSections(active);
};
