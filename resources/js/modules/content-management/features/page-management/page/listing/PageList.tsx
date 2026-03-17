import { useGetLocale } from '@/common/locale';
import { Button } from '@/components/ui/button';
import { DateDisplay } from '@/components/ui/date-display';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { PageDto, Paginated } from '@/modules/content-management/types';
import { ChevronRight, ExternalLink } from 'lucide-react';

import { canSetAsHome, isHomePage, publicPageUrl } from './rules';
import { PageActions } from './partials/PageActions';
import { PageSlug } from './partials/PageSlug';
import { StatusBadge } from './partials/StatusBadge';
import { PageTitle } from './partials/PageTitle';
import { EmptyState } from './partials/EmptyState';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

interface PageListProps {
  pages: Paginated<PageDto>;
  homeSlug?: string;
  /**
   * Called when a row is activated (click, Enter, Space). The parent should
   * typically open an info modal for the selected page.
   */
  onShowInfo?: (page: PageDto) => void;
}

/**
 * Admin listing for content-managed pages.
 *
 * UX notes:
 * - Rows are keyboard-accessible (`tabIndex=0`) and activate on Enter/Space.
 * - Inline actions stop propagation so they do not trigger the row handler.
 * - Mobile keeps secondary actions inside the dropdown menu.
 */
export function PageList({ pages, homeSlug, onShowInfo }: PageListProps) {
  const hasItems = pages.data.length > 0;
  const locale = useGetLocale();
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );
  const columnCount = 6;

  return (
    <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[30%]">
              {tPages('listing.columns.title', 'Title')}
            </TableHead>
            <TableHead>{tPages('listing.columns.slug', 'Slug')}</TableHead>
            <TableHead className="hidden md:table-cell">
              {tPages('listing.columns.locale', 'Locale')}
            </TableHead>
            <TableHead className="hidden md:table-cell">
              {tPages('listing.columns.status', 'Status')}
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              {tPages('listing.columns.lastUpdated', 'Last updated')}
            </TableHead>
            <TableHead className="text-right">
              <span className="sr-only">
                {tPages('listing.columns.rowActions', 'Row actions')}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!hasItems && (
            <EmptyState
              colSpan={columnCount}
              message={tPages(
                'listing.empty',
                'No pages found for the current filters.',
              )}
            />
          )}

          {pages.data.map((page) => {
            const isHome = isHomePage(homeSlug, page.slug);
            const publicUrl = publicPageUrl(isHome, page.slug);
            const showSetHome = canSetAsHome(homeSlug, page.slug);

            return (
              <TableRow
                key={page.id}
                className="group hover:bg-muted/50 focus-visible:ring-ring cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                tabIndex={0}
                onClick={() => onShowInfo?.(page)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onShowInfo?.(page);
                  }
                }}
              >
                <TableCell className="font-medium">
                  <PageTitle title={page.title} internalName={page.internal_name} />
                </TableCell>

                <TableCell>
                  <PageSlug slug={page.slug} isHome={isHome} />
                </TableCell>

                <TableCell className="text-muted-foreground hidden text-xs tracking-wide uppercase md:table-cell">
                  {page.locale}
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <StatusBadge page={page} />
                </TableCell>

                <TableCell className="text-muted-foreground hidden text-sm lg:table-cell">
                  <DateDisplay
                    value={page.updated_at}
                    fallback={'—'}
                    locale={locale}
                    format="PP"
                  />
                </TableCell>

                <TableCell className="w-0">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:bg-primary hover:text-primary-foreground hidden h-8 w-8 sm:inline-flex"
                      onClick={(event) => {
                        event.stopPropagation();
                        window.open(publicUrl, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">
                        {tPages(
                          'listing.openNewTab',
                          'Open page in a new tab',
                        )}
                      </span>
                    </Button>

                    <PageActions
                      pageId={page.id}
                      pageTitle={page.title}
                      publicUrl={publicUrl}
                      showSetHome={showSetHome}
                    />

                    <ChevronRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
