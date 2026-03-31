// resources/js/Pages/Messages/Index.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, pageRouter } from '@/common/page-runtime';
import {
  serializeTableQueryParams,
  setTablePageInQueryParams,
  setTablePerPageInQueryParams,
  setTableSortInQueryParams,
  TableSearchField,
  TableToolbar,
  type TablePaginated,
  toggleTableSortState,
  type TableSortState,
} from '@/common/table';
import { Button } from '@/components/ui/button';
import { type FormEvent, useEffect, useState } from 'react';

import type { Message } from '@/modules/messages/core/types';
import {
  MESSAGES_NAMESPACES,
  useMessagesTranslation,
} from '@/modules/messages/i18n';
import { MessageOverlay } from '@/modules/messages/ui/MessageOverlay';
import { MessagesHeader } from '@/modules/messages/ui/MessagesHeader';
import { MessagesTable } from '@/modules/messages/ui/MessagesTable';

interface MessagesIndexProps {
  messages: TablePaginated<Message>;
  stats: {
    results_total: number;
    results_unread_count: number;
    results_important_count: number;
  };
  filters: {
    per_page?: number | null;
    search?: string | null;
    seen?: string | null;
    important?: string | null;
    sort?: string | null;
    direction?: string | null;
  };
}

const MESSAGE_PER_PAGE_OPTIONS = [15, 30, 50] as const;
const MESSAGE_SORTABLE_COLUMNS = {
  name: true,
  seen: true,
  important: true,
  created_at: true,
} as const;

/**
 * Messages index page for listing and managing contact messages.
 */
export default function Index({
  messages,
  stats,
  filters,
}: MessagesIndexProps) {
  const { translate: tMessages } = useMessagesTranslation(
    MESSAGES_NAMESPACES.messages,
  );
  const appliedSearch =
    typeof filters.search === 'string' ? filters.search : '';
  const appliedSeenFilter =
    typeof filters.seen === 'string' ? filters.seen : '';
  const appliedImportantFilter =
    typeof filters.important === 'string' ? filters.important : '';
  const sortState: TableSortState = {
    column: typeof filters.sort === 'string' ? filters.sort : null,
    direction:
      filters.direction === 'asc' || filters.direction === 'desc'
        ? filters.direction
        : null,
  };
  const hasAppliedFilters =
    appliedSearch !== '' ||
    appliedSeenFilter !== '' ||
    appliedImportantFilter !== '';
  const emptyStateMessage = hasAppliedFilters
    ? tMessages('emptyState.filteredDescription')
    : tMessages('emptyState.description');
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [draftSearch, setDraftSearch] = useState(appliedSearch);
  const [draftSeenFilter, setDraftSeenFilter] = useState(appliedSeenFilter);
  const [draftImportantFilter, setDraftImportantFilter] =
    useState(appliedImportantFilter);
  const currentPerPage =
    typeof filters.per_page === 'number' && filters.per_page > 0
      ? filters.per_page
      : messages.per_page;

  useEffect(() => {
    setDraftSearch(appliedSearch);
  }, [appliedSearch]);

  useEffect(() => {
    setDraftSeenFilter(appliedSeenFilter);
  }, [appliedSeenFilter]);

  useEffect(() => {
    setDraftImportantFilter(appliedImportantFilter);
  }, [appliedImportantFilter]);

  const currentIndexQuery = buildMessagesIndexQueryParams({
    search: appliedSearch,
    seen: appliedSeenFilter,
    important: appliedImportantFilter,
    perPage: currentPerPage,
    sort: sortState,
    page: messages.current_page,
  });
  const selectedMessage =
    selectedMessageId === null
      ? null
      : messages.data.find((message) => message.id === selectedMessageId) ?? null;

  useEffect(() => {
    if (overlayOpen && selectedMessageId !== null && selectedMessage === null) {
      setOverlayOpen(false);
      setSelectedMessageId(null);
    }
  }, [overlayOpen, selectedMessage, selectedMessageId]);

  function handleRowClick(message: Message): void {
    if (!message.seen) {
      pageRouter.patch(
        route('messages.mark-as-seen', {
          message: message.id,
          ...currentIndexQuery,
        }),
        {},
        {
          preserveScroll: true,
          preserveState: true,
        },
      );

      setSelectedMessageId(message.id);
      setOverlayOpen(true);
      return;
    }

    setSelectedMessageId(message.id);
    setOverlayOpen(true);
  }

  function handleOverlayChange(open: boolean): void {
    if (!open) {
      setOverlayOpen(false);
      setSelectedMessageId(null);
      return;
    }

    setOverlayOpen(true);
  }

  function handleToggleImportant(
    message: Message,
    event?: React.MouseEvent,
  ): void {
    event?.stopPropagation();

    pageRouter.patch(
      route(
        !message.important
          ? 'messages.mark-as-important'
          : 'messages.mark-as-not-important',
        {
          message: message.id,
          ...currentIndexQuery,
        },
      ),
      {},
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  }

  function handleToggleSeen(message: Message, event?: React.MouseEvent): void {
    event?.stopPropagation();

    pageRouter.patch(
      route(
        !message.seen ? 'messages.mark-as-seen' : 'messages.mark-as-unseen',
        {
          message: message.id,
          ...currentIndexQuery,
        },
      ),
      {},
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  }

  function handleDelete(message: Message, event?: React.MouseEvent): void {
    event?.stopPropagation();

    if (!window.confirm(tMessages('confirm.delete'))) {
      return;
    }

    pageRouter.delete(route('messages.destroy', {
      message: message.id,
      ...currentIndexQuery,
    }), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        if (selectedMessageId === message.id) {
          setSelectedMessageId(null);
          setOverlayOpen(false);
        }
      },
    });
  }

  function handlePageChange(page: number): void {
    pageRouter.get(
      route('messages.index'),
      setTablePageInQueryParams(
        buildMessagesIndexQueryParams({
          search: appliedSearch,
          seen: appliedSeenFilter,
          important: appliedImportantFilter,
          perPage: currentPerPage,
          sort: sortState,
        }),
        page,
      ),
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  }

  function handlePerPageChange(perPage: number): void {
    pageRouter.get(
      route('messages.index'),
      setTablePerPageInQueryParams(
        buildMessagesIndexQueryParams({
          search: appliedSearch,
          seen: appliedSeenFilter,
          important: appliedImportantFilter,
          sort: sortState,
        }),
        perPage,
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    pageRouter.get(
      route('messages.index'),
      buildMessagesIndexQueryParams({
        search: draftSearch,
        seen: draftSeenFilter,
        important: draftImportantFilter,
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  }

  function handleResetFilters(): void {
    setDraftSearch('');
    setDraftSeenFilter('');
    setDraftImportantFilter('');

    pageRouter.get(
      route('messages.index'),
      buildMessagesIndexQueryParams({
        search: '',
        seen: '',
        important: '',
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  }

  function handleSortChange(column: string): void {
    pageRouter.get(
      route('messages.index'),
      setTableSortInQueryParams(
        serializeTableQueryParams({
          per_page: currentPerPage,
          search: appliedSearch,
          seen: appliedSeenFilter,
          important: appliedImportantFilter,
        }),
        toggleTableSortState(sortState, column),
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  }

  return (
    <AuthenticatedLayout>
      <PageHead title={tMessages('page.title')} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <MessagesHeader
          resultsTotal={stats.results_total}
          unreadCount={stats.results_unread_count}
          importantCount={stats.results_important_count}
        />

        <MessagesTable
          messages={messages}
          emptyStateMessage={emptyStateMessage}
          header={
            <TableToolbar className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <form
                className="flex w-full flex-col gap-3 md:flex-row md:items-center"
                onSubmit={handleSearchSubmit}
              >
                <TableSearchField
                  className="w-full md:max-w-md"
                  aria-label={tMessages('filters.searchLabel')}
                  value={draftSearch}
                  onChange={(event) =>
                    setDraftSearch(event.currentTarget.value)
                  }
                  placeholder={tMessages('filters.searchPlaceholder')}
                  buttonLabel={tMessages('filters.searchSubmit')}
                />

                <select
                  aria-label={tMessages('filters.seenLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={draftSeenFilter}
                  onChange={(event) =>
                    setDraftSeenFilter(event.currentTarget.value)
                  }
                >
                  <option value="">{tMessages('filters.seenPlaceholder')}</option>
                  <option value="unseen">{tMessages('filters.unseenOnly')}</option>
                  <option value="seen">{tMessages('filters.seenOnly')}</option>
                </select>

                <select
                  aria-label={tMessages('filters.importantLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={draftImportantFilter}
                  onChange={(event) =>
                    setDraftImportantFilter(event.currentTarget.value)
                  }
                >
                  <option value="">{tMessages('filters.importantPlaceholder')}</option>
                  <option value="important">{tMessages('filters.importantOnly')}</option>
                  <option value="regular">{tMessages('filters.regularOnly')}</option>
                </select>
              </form>

              <div className="flex items-center gap-2 self-end lg:self-auto">
                {hasAppliedFilters ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    {tMessages('filters.reset')}
                  </Button>
                ) : null}
              </div>
            </TableToolbar>
          }
          onRowClick={handleRowClick}
          onToggleImportant={handleToggleImportant}
          onToggleSeen={handleToggleSeen}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={MESSAGE_PER_PAGE_OPTIONS}
          sort={sortState}
          sortableColumns={MESSAGE_SORTABLE_COLUMNS}
        />
      </PageContent>

      <MessageOverlay
        open={overlayOpen}
        message={selectedMessage}
        onOpenChange={handleOverlayChange}
      />
    </AuthenticatedLayout>
  );
}

Index.i18n = ['messages'];

function buildMessagesIndexQueryParams({
  search,
  seen,
  important,
  perPage,
  sort,
  page,
}: {
  search: string;
  seen: string;
  important: string;
  perPage?: number;
  sort: TableSortState;
  page?: number;
}): Record<string, string> {
  return setTablePageInQueryParams(
    setTableSortInQueryParams(
      serializeTableQueryParams({
        search,
        seen,
        important,
        per_page: perPage,
      }),
      sort,
    ),
    page,
  );
}
