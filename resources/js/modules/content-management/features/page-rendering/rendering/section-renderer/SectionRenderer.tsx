import {
  resolveAppLocalizationContext,
  type AppPageProps,
} from '@/app/shell';
import { sectionRegistryProviders } from '@/config/sectionRegistryProviders';
import {
  Section,
  SectionContent,
} from '@/app/layouts/primitives';
import { preloaderForI18nScopes } from '@/common/i18n';
import {
  canonicalizeLocale,
  useGetLocale,
  type Locale,
} from '@/common/locale';
import { usePageProps } from '@/common/page-runtime';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/modules/content-management/types';
import { JSX, ReactNode, useEffect, useMemo, useState } from 'react';
import { deriveI18nScopeForTemplateKey } from '../../i18nScope';
import { buildComponentRegistry } from '../../template/registry/componentRegistry';
import { createFieldValueResolver } from './field-value/fieldValueResolver';
import { FieldValueResolverProvider } from './field-value/FieldValueResolverProvider';
import { renderGenericTemplateSection } from './RenderGenericTemplateSection';
import { resolveSectionLayout } from './sectionLayout';
import { buildSectionRenderModel } from './sectionRenderModel';
import { findTemplateDefinition } from './template/findTemplateDefinition';
import { resolveTemplateComponent } from './template/resolveTemplateComponent';

export interface SectionRendererProps {
  sections: PageSectionDto[];
  templates?: TemplateDefinitionDto[];
  /**
   * Optional base class names applied to all rendered sections.
   * Components can merge this value with their own internal classes.
   */
  sectionClassName?: string;
  /**
   * Controls whether the last rendered section should drop its bottom border.
   * Defaults to true so single-slot renders keep the current behavior.
   */
  omitBorderOnLastSection?: boolean;
}

type SectionContentI18nBoundaryProps = {
  scopeIds: readonly string[];
  children: ReactNode;
};

type RenderableSectionEntry = {
  key: PageSectionDto['id'];
  sectionId: string;
  fieldValueResolver: ReturnType<typeof createFieldValueResolver>;
  layout: ReturnType<typeof resolveSectionLayout>;
  gatedContent: ReactNode;
};

function SectionContentLoadingOverlay(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex w-full flex-col gap-4 py-2"
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-2/5 max-w-sm" />
        <Skeleton className="h-4 w-3/4 max-w-2xl" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

function normalizeScopeIds(scopeIds: readonly string[]): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];

  scopeIds.forEach((id) => {
    if (typeof id !== 'string') {
      return;
    }

    const normalized = id.trim();
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    ids.push(normalized);
  });

  return ids;
}

function SectionContentI18nBoundary({
  scopeIds,
  children,
}: SectionContentI18nBoundaryProps): JSX.Element {
  const locale = useGetLocale();
  const pageProps = usePageProps<AppPageProps>();
  const localizationContext = resolveAppLocalizationContext(pageProps);
  const fallbackLocale: Locale | null = canonicalizeLocale(
    localizationContext.fallbackLocale ?? '',
  );
  const normalizedScopeIds = useMemo(
    () => normalizeScopeIds(scopeIds),
    [scopeIds],
  );
  const preloader = useMemo(() => {
    if (normalizedScopeIds.length === 0) {
      return null;
    }

    return preloaderForI18nScopes(normalizedScopeIds);
  }, [normalizedScopeIds]);
  const [isReady, setIsReady] = useState(normalizedScopeIds.length === 0);

  useEffect(() => {
    if (!preloader) {
      setIsReady(true);
      return;
    }

    const activePreloader = preloader;
    let cancelled = false;

    async function run(): Promise<void> {
      setIsReady(false);

      await activePreloader.preloadLocale?.(locale);
      if (fallbackLocale && fallbackLocale !== locale) {
        await activePreloader.preloadLocale?.(fallbackLocale);
      }

      if (!cancelled) {
        setIsReady(true);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [fallbackLocale, locale, preloader]);

  return (
    <div className="relative">
      <div
        key={isReady ? 'ready' : 'loading'}
        aria-hidden={isReady ? undefined : true}
        className={isReady ? undefined : 'invisible pointer-events-none select-none'}
      >
        {children}
      </div>

      {!isReady && <SectionContentLoadingOverlay />}
    </div>
  );
}

/**
 * Renders a list of page sections, using template-specific components when available
 * and falling back to a generic template-based renderer otherwise.
 *
 * Each rendered section receives a field value resolver through context so that
 * components can read CMS values with the correct precedence between
 * persisted section data and template defaults.
 *
 * Layout-related metadata is resolved here so CMS sections share one
 * structural contract for bleed, spacing, borders, and horizontal containment.
 */
export function SectionRenderer({
  sections,
  templates,
  sectionClassName,
  omitBorderOnLastSection = true,
}: SectionRendererProps): JSX.Element | null {
  if (!sections.length) {
    return null;
  }

  const componentRegistry = buildComponentRegistry(
    {},
    sectionRegistryProviders,
  );
  const renderableSections: RenderableSectionEntry[] = sections.flatMap((section) => {
    const sectionModel = buildSectionRenderModel(section);

    const template = findTemplateDefinition(
      templates,
      sectionModel.templateKey,
    );

    const Component = resolveTemplateComponent(
      componentRegistry,
      sectionModel.templateKey,
    );

    if (!Component && !template) {
      return [];
    }

    const fieldValueResolver = createFieldValueResolver(
      section.data ?? null,
      template,
    );
    const layout = resolveSectionLayout(sectionModel.templateKey);
    const sectionScopeIds = deriveI18nScopeForTemplateKey(
      sectionModel.templateKey,
    );
    const sectionId =
      sectionModel.anchor ??
      `${sectionModel.templateKey.replace(/_/g, '-')}-${sectionModel.id}`;

    const content = Component ? (
      <Component
        section={sectionModel}
        template={template}
      />
    ) : (
      renderGenericTemplateSection(
        template,
        fieldValueResolver,
      )
    );

    if (!content) {
      return [];
    }

    const gatedContent =
      sectionScopeIds.length > 0 ? (
        <SectionContentI18nBoundary scopeIds={sectionScopeIds}>
          {content}
        </SectionContentI18nBoundary>
      ) : (
        content
      );

    return [
      {
        key: section.id,
        sectionId,
        fieldValueResolver,
        layout,
        gatedContent,
      },
    ];
  });

  if (!renderableSections.length) {
    return null;
  }

  return (
    <>
      {renderableSections.map((section, index) => {
        const isLastSection = index === renderableSections.length - 1;
        const shouldOmitBorder = omitBorderOnLastSection && isLastSection;
        const baseSectionClassName = shouldOmitBorder
          ? 'm-0'
          : 'm-0 border-b';
        const resolvedSectionClassName =
          [baseSectionClassName, sectionClassName]
            .filter(Boolean)
            .join(' ')
            .trim() || undefined;

        return (
          <FieldValueResolverProvider
            key={section.key}
            resolver={section.fieldValueResolver}
          >
            <Section
              id={section.sectionId}
              className={resolvedSectionClassName}
              spacing={section.layout.spacing}
              surface={section.layout.surface}
              bleed={section.layout.bleed}
            >
              <SectionContent contentWidth={section.layout.contentWidth}>
                {section.gatedContent}
              </SectionContent>
            </Section>
          </FieldValueResolverProvider>
        );
      })}
    </>
  );
}
