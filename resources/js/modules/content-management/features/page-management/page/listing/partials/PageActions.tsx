import {
  TableActionsMenu,
  TableActionsMenuItem,
} from '@/common/table';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import {
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { PageLink, pageRouter } from '@/common/page-runtime';
import { ExternalLink, Home, Pencil, Trash2 } from 'lucide-react';

interface PageActionsProps {
  pageId: number;
  pageTitle: string;
  /**
   * Public URL for the page (already resolved for home vs slug).
   */
  publicUrl: string;
  showSetHome?: boolean;
}

/**
 * Row-level overflow menu.
 *
 * Designed to be used inside a clickable row: trigger/content stop propagation.
 */
export function PageActions({
  pageId,
  pageTitle,
  publicUrl,
  showSetHome,
}: PageActionsProps) {
  const { translate: tActions } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.actions,
  );
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );

  const handleDelete = (): void => {
    if (
      !window.confirm(
        tPages(
          'listing.deleteConfirm',
          'Delete "{{title}}"? This cannot be undone.',
          { title: pageTitle },
        ),
      )
    ) {
      return;
    }

    pageRouter.delete(route('admin.content.pages.destroy', pageId), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <TableActionsMenu triggerLabel={tActions('openMenu', 'Open menu')}>
      <TableActionsMenuItem asChild>
        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>{tActions('openPage', 'Open page')}</span>
        </a>
      </TableActionsMenuItem>

      <DropdownMenuSeparator />

      <TableActionsMenuItem asChild>
        <PageLink
          href={route('admin.content.pages.edit', pageId)}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          <span>{tActions('edit', 'Edit')}</span>
        </PageLink>
      </TableActionsMenuItem>

      {showSetHome && (
        <>
          <DropdownMenuSeparator />
          <TableActionsMenuItem asChild>
            <PageLink
              href={route('admin.content.pages.set-home', pageId)}
              method="post"
              as="button"
              preserveScroll
              className="w-full cursor-pointer"
            >
              <Home className="mr-2 h-4 w-4" />
              <span>{tActions('setAsHome', 'Set as home')}</span>
            </PageLink>
          </TableActionsMenuItem>
        </>
      )}

      <DropdownMenuSeparator />

      <TableActionsMenuItem
        onSelect={(event) => {
          event.stopPropagation();
          handleDelete();
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        <span>{tActions('delete', 'Delete')}</span>
      </TableActionsMenuItem>
    </TableActionsMenu>
  );
}
