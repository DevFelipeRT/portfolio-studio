import { useGetLocale } from '@/Common/i18n';
import { Button } from '@/Components/Ui/button';
import { DateDisplay } from '@/Components/Ui/date-display';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/Ui/table';
import type {
  PageDto,
  Paginated,
} from '@/Modules/ContentManagement/core/types';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { PageStatusBadge } from './PageStatusBadge';

interface PageTableProps {
  pages: Paginated<PageDto>;
  homeSlug?: string;
}

/**
 * Data table for listing content-managed pages.
 */
export function PageTable({ pages, homeSlug }: PageTableProps) {
  const hasItems = pages.data.length > 0;
  const locale = useGetLocale();

  return (
    <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[30%]">Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="hidden md:table-cell">Locale</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Last updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!hasItems && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground py-10 text-center text-sm"
              >
                No pages found for the current filters.
              </TableCell>
            </TableRow>
          )}

          {pages.data.map((page) => (
            <TableRow key={page.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{page.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {page.internal_name}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
                    {page.slug}
                  </span>

                  {homeSlug && page.slug === homeSlug && (
                    <span className="bg-primary/10 text-primary inline-flex rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                      Home
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-muted-foreground hidden text-xs tracking-wide uppercase md:table-cell">
                {page.locale}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <PageStatusBadge page={page} />
              </TableCell>

              <TableCell className="text-muted-foreground hidden text-sm lg:table-cell">
                <DateDisplay
                  value={page.updated_at}
                  fallback={'—'}
                  locale={locale}
                  format="PP"
                />
              </TableCell>

              <TableCell className="space-x-2 text-right">
                {homeSlug !== page.slug && (
                  <Button asChild variant="outline" size="sm" className="gap-1">
                    <Link
                      href={route('admin.content.pages.set-home', page.id)}
                      method="post"
                      as="button"
                      preserveScroll
                    >
                      Set as home
                    </Link>
                  </Button>
                )}

                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link href={route('admin.content.pages.edit', page.id)}>
                    Edit
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
