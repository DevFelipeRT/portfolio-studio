// resources/js/app/pages/content-management/public/RenderedPage.tsx
import PublicLayout from '@/app/layouts/PublicLayout';

import {
  buildNavigationItemsFromSections,
  type SectionEnvironment,
  SectionEnvironmentProvider,
  sectionSlotLayoutManager,
  sortSectionsByPosition,
} from '@/Modules/ContentManagement/features/page-rendering';
import { defaultStringNormalizer } from '@/Modules/ContentManagement/shared/strings';
import type {
  PageRenderViewModelProps,
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
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

  const sortedSections: PageSectionDto[] = sortSectionsByPosition(sections);

  const visibleSections = sortedSections.filter((section) => section.is_active);

  const navigationItems = buildNavigationItemsFromSections(
    visibleSections,
    defaultStringNormalizer,
  );

  const headTitle: string = page.meta_title || page.title;
  const headDescription: string | undefined =
    page.meta_description || undefined;
  const headImageUrl: string | undefined = page.meta_image_url || undefined;

  const environment: SectionEnvironment = {};

  return (
    <PublicLayout navigationItems={navigationItems}>
      <SectionEnvironmentProvider value={environment}>
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
      </SectionEnvironmentProvider>
    </PublicLayout>
  );
}
