import { useGetLocale } from '@/common/locale';
import { Badge } from '@/components/ui/badge';
import { DateDisplay } from '@/components/ui/date-display';
import { Separator } from '@/components/ui/separator';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import type { PageDto } from '@/modules/content-management/types';
import type { ReactNode } from 'react';

interface PageInfoProps {
  page: PageDto;
}

/**
 * Single label/value row used by `PageInfo`.
 *
 * Kept intentionally simple (not a shared UI primitive) to avoid coupling this
 * feature to a global "description list" abstraction.
 */
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
      <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </div>
      <div className="sm:col-span-2">{value}</div>
    </div>
  );
}

/**
 * Read-only view of the `PageDto` as provided by the backend.
 *
 * Use this inside a modal/dialog. This component is presentation-only and
 * performs no navigation.
 */
export function PageInfo({ page }: PageInfoProps) {
  const locale = useGetLocale();
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );
  const statusBadge =
    page.status === 'published'
      ? {
          label: tPages('info.badges.published', 'Published'),
          variant: 'default' as const,
        }
      : page.status === 'archived'
        ? {
            label: tPages('info.badges.archived', 'Archived'),
            variant: 'secondary' as const,
          }
        : {
            label: tPages('info.badges.draft', 'Draft'),
            variant: 'outline' as const,
          };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        <Badge variant={page.is_indexable ? 'secondary' : 'outline'}>
          {page.is_indexable
            ? tPages('info.badges.indexable', 'Indexable')
            : tPages('info.badges.noindex', 'Noindex')}
        </Badge>
        <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
          {page.locale}
        </span>
      </div>

      <Separator />

      <div className="space-y-3 text-sm">
        <InfoRow
          label={tPages('info.fields.title', 'Title')}
          value={<span className="font-medium">{page.title}</span>}
        />
        <InfoRow
          label={tPages('info.fields.internalName', 'Internal name')}
          value={<span className="font-mono text-xs">{page.internal_name}</span>}
        />
        <InfoRow
          label={tPages('info.fields.slug', 'Slug')}
          value={<span className="font-mono text-xs">{page.slug}</span>}
        />
        <InfoRow
          label={tPages('info.fields.layoutKey', 'Layout key')}
          value={
            page.layout_key ? (
              <span className="font-mono text-xs">{page.layout_key}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
      </div>

      <Separator />

      <div className="space-y-3 text-sm">
        <InfoRow
          label={tPages('info.fields.metaTitle', 'Meta title')}
          value={
            page.meta_title ? (
              <span>{page.meta_title}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
        <InfoRow
          label={tPages('info.fields.metaDescription', 'Meta description')}
          value={
            page.meta_description ? (
              <span className="whitespace-pre-wrap">{page.meta_description}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
        <InfoRow
          label={tPages('info.fields.metaImageUrl', 'Meta image URL')}
          value={
            page.meta_image_url ? (
              <a
                href={page.meta_image_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary break-all text-xs underline underline-offset-4"
              >
                {page.meta_image_url}
              </a>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
      </div>

      <Separator />

      <div className="space-y-3 text-sm">
        <InfoRow
          label={tPages('info.fields.publishedAt', 'Published at')}
          value={
            <DateDisplay
              value={page.published_at}
              fallback={'—'}
              locale={locale}
              format="PPpp"
            />
          }
        />
        <InfoRow
          label={tPages('info.fields.createdAt', 'Created at')}
          value={
            <DateDisplay
              value={page.created_at}
              fallback={'—'}
              locale={locale}
              format="PPpp"
            />
          }
        />
        <InfoRow
          label={tPages('info.fields.updatedAt', 'Updated at')}
          value={
            <DateDisplay
              value={page.updated_at}
              fallback={'—'}
              locale={locale}
              format="PPpp"
            />
          }
        />
      </div>
    </div>
  );
}
