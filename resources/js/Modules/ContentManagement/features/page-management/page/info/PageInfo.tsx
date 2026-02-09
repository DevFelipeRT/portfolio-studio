import { useGetLocale } from '@/Common/i18n';
import { Badge } from '@/Components/Ui/badge';
import { DateDisplay } from '@/Components/Ui/date-display';
import { Separator } from '@/Components/Ui/separator';
import type { PageDto } from '@/Modules/ContentManagement/types';
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={page.is_published ? 'default' : 'outline'}>
          {page.is_published ? 'Published' : 'Draft'}
        </Badge>
        <Badge variant={page.is_indexable ? 'secondary' : 'outline'}>
          {page.is_indexable ? 'Indexable' : 'Noindex'}
        </Badge>
        <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
          {page.locale}
        </span>
      </div>

      <Separator />

      <div className="space-y-3 text-sm">
        <InfoRow
          label="Title"
          value={<span className="font-medium">{page.title}</span>}
        />
        <InfoRow
          label="Internal name"
          value={<span className="font-mono text-xs">{page.internal_name}</span>}
        />
        <InfoRow
          label="Slug"
          value={<span className="font-mono text-xs">{page.slug}</span>}
        />
        <InfoRow
          label="Layout key"
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
          label="Meta title"
          value={
            page.meta_title ? (
              <span>{page.meta_title}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
        <InfoRow
          label="Meta description"
          value={
            page.meta_description ? (
              <span className="whitespace-pre-wrap">{page.meta_description}</span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
        <InfoRow
          label="Meta image URL"
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
          label="Published at"
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
          label="Created at"
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
          label="Updated at"
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
