import { Button } from '@/Components/Ui/button';
import type {
  SectionDataValue,
  SectionImage,
} from '@/Modules/ContentManagement/types';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { JSX } from 'react';
import { useFieldValueResolver } from '../../rendering/section-renderer/field-value/useFieldValueResolver';
import { SectionComponentProps } from '../../types';
import { SectionHeader } from './partials/SectionHeader';

/**
 * Renders the primary hero section for a content-managed page.
 */
export function HeroPrimarySection({
  section: renderModel,
  className,
}: SectionComponentProps): JSX.Element | null {
  const fieldResolver = useFieldValueResolver();

  const targetId = renderModel.anchor || `hero-${renderModel.id}`;

  const baseClassName = 'lg:py-28';

  const resolvedClassName =
    [baseClassName, className].filter(Boolean).join(' ').trim() || undefined;

  const rawHeroImage = fieldResolver.getFieldValue<SectionDataValue>('hero_image');

  const heroImage: SectionImage | null = Array.isArray(rawHeroImage)
    ? ((rawHeroImage[0] as SectionImage | undefined) ?? null)
    : ((rawHeroImage as SectionImage | null | undefined) ?? null);

  const eyebrow = fieldResolver.getFieldValue<string>('eyebrow');

  const title =
    fieldResolver.getFieldValue<string>('headline') ??
    fieldResolver.getFieldValue<string>('title') ??
    fieldResolver.getFieldValue<string>('heading') ??
    '';

  const description =
    fieldResolver.getFieldValue<string>('subheadline') ??
    fieldResolver.getFieldValue<string>('description') ??
    undefined;

  const primaryCtaLabel =
    fieldResolver.getFieldValue<string>('primary_cta_label') ??
    fieldResolver.getFieldValue<string>('primaryCtaLabel');

  const primaryCtaUrl =
    fieldResolver.getFieldValue<string>('primary_cta_url') ??
    fieldResolver.getFieldValue<string>('primaryCtaUrl');

  if (!title && !description && !primaryCtaLabel) {
    return null;
  }

  return (
    <section id={targetId} className={resolvedClassName}>
      <div className="mx-auto">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text column */}
          <div className="space-y-8">
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              align="left"
              level={1}
            />

            {primaryCtaLabel && primaryCtaUrl && (
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" asChild>
                  <a href={primaryCtaUrl}>{primaryCtaLabel}</a>
                </Button>
              </div>
            )}
          </div>

          {/* Image / visual column */}
          <div className="relative" aria-hidden="true">
            {heroImage ? (
              <div className="relative w-full overflow-hidden rounded-2xl border">
                <AspectRatio ratio={4 / 3}>
                  <img
                    src={heroImage.url}
                    alt={heroImage.alt ?? heroImage.title ?? ''}
                    className="h-full w-full object-cover"
                  />
                </AspectRatio>
                <div className="from-background/60 via-background/20 pointer-events-none absolute inset-0 bg-gradient-to-tr to-transparent" />
              </div>
            ) : (
              <div className="bg-muted relative h-48 w-full overflow-hidden rounded-2xl border md:h-64 lg:h-72" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
