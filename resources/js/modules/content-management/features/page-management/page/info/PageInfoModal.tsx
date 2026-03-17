import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { PageDto } from '@/modules/content-management/types';
import { PageInfo } from './PageInfo';

interface PageInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Selected page to display. When null, the modal still renders but shows an
   * empty body (useful while switching selection).
   */
  page: PageDto | null;
}

/**
 * Dialog wrapper for `PageInfo`.
 *
 * The parent owns the state (`open` + selected `page`) so this component stays
 * reusable across different page listings.
 */
export function PageInfoModal({ open, onOpenChange, page }: PageInfoModalProps) {
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{tPages('info.title', 'Page details')}</DialogTitle>
          <DialogDescription>
            {tPages(
              'info.description',
              'Snapshot of the current page metadata as returned by the backend.',
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6">{page ? <PageInfo page={page} /> : null}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
