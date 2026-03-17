import { Button } from '@/components/ui/button';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageLink, pageRouter } from '@/common/page-runtime';
import { ExternalLink, Home, MoreVertical, Pencil, Trash2 } from 'lucide-react';

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

  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:bg-primary hover:text-primary-foreground h-8 w-8"
          onClick={handleTriggerClick}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">{tActions('openMenu', 'Open menu')}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-44"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem asChild>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>{tActions('openPage', 'Open page')}</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <PageLink
            href={route('admin.content.pages.edit', pageId)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>{tActions('edit', 'Edit')}</span>
          </PageLink>
        </DropdownMenuItem>

        {showSetHome && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
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
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
