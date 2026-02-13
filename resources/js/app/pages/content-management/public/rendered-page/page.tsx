// resources/js/app/pages/content-management/public/RenderedPage.tsx
import PublicLayout from '@/app/layouts/PublicLayout';
import {
  buildNavigationItems,
  buildPageRenderingContext,
  PageRenderingContextProvider,
  sectionSlotLayoutManager,
} from '@/modules/content-management/features/page-rendering';
import type {
  PageRenderViewModelProps,
  TemplateDefinitionDto,
} from '@/modules/content-management/types';
import { defaultStringNormalizer } from '@/modules/content-management/utils/strings';
import { Head } from '@inertiajs/react';
import { JSX } from 'react';

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

  return (
    <PublicLayout navigationItems={navigationItems}>
      <PageRenderingContextProvider value={renderingContext}>
        <Head title={headTitle}>
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
        </Head>

        {sectionSlotLayoutManager.render(visibleSections, templates)}
      </PageRenderingContextProvider>
    </PublicLayout>
  );
}
