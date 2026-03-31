import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, pageRouter } from '@/common/page-runtime';
import {
  NewButton,
  serializeTableQueryParams,
  setTablePageInQueryParams,
  setTablePerPageInQueryParams,
  setTableSortInQueryParams,
  TableSearchField,
  TableToolbar,
  toggleTableSortState,
  type TablePaginated,
  type TableSortState,
} from '@/common/table';
import { Button } from '@/components/ui/button';
import type { ContactChannel } from '@/modules/contact-channels/core/types';
import type { ContactChannelTypeOption } from '@/modules/contact-channels/core/types';
import { useContactChannelsTranslation } from '@/modules/contact-channels/i18n';
import { CONTACT_CHANNELS_NAMESPACES } from '@/modules/contact-channels/i18n';
import { ContactChannelOverlay } from '@/modules/contact-channels/ui/ContactChannelOverlay';
import { ContactChannelsTable } from '@/modules/contact-channels/ui/table/ContactChannelsTable';
import { type FormEvent, useEffect, useState } from 'react';

interface ContactChannelsIndexProps {
  channels: TablePaginated<ContactChannel>;
  channelTypes: ContactChannelTypeOption[];
  filters: {
    per_page?: number | null;
    search?: string | null;
    type?: string | null;
    active?: string | null;
    sort?: string | null;
    direction?: string | null;
  };
}

const CONTACT_CHANNEL_PER_PAGE_OPTIONS = [15, 30, 50] as const;
const CONTACT_CHANNEL_SORTABLE_COLUMNS = {
  channel_type: true,
  label: true,
  value: true,
  is_active: true,
  sort_order: true,
} as const;

export default function Index({
  channels,
  channelTypes,
  filters,
}: ContactChannelsIndexProps) {
  return (
    <ContactChannelsIndexI18nContent
      channels={channels}
      channelTypes={channelTypes}
      filters={filters}
    />
  );
}

function ContactChannelsIndexI18nContent({
  channels,
  channelTypes,
  filters,
}: ContactChannelsIndexProps) {
  const [selectedChannel, setSelectedChannel] =
    useState<ContactChannel | null>(null);
  const { translate: tActions } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.actions,
  );
  const { translate: tForm } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.form,
  );
  const currentSearch =
    typeof filters.search === 'string' ? filters.search : '';
  const currentType =
    typeof filters.type === 'string' ? filters.type : '';
  const currentActive =
    typeof filters.active === 'string' ? filters.active : '';
  const sortState: TableSortState = {
    column: typeof filters.sort === 'string' ? filters.sort : null,
    direction:
      filters.direction === 'asc' || filters.direction === 'desc'
        ? filters.direction
        : null,
  };
  const currentPerPage =
    typeof filters.per_page === 'number' && filters.per_page > 0
      ? filters.per_page
      : channels.per_page;
  const [search, setSearch] = useState(currentSearch);
  const [type, setType] = useState(currentType);
  const [active, setActive] = useState(currentActive);

  useEffect(() => {
    setSearch(currentSearch);
    setType(currentType);
    setActive(currentActive);
  }, [currentActive, currentSearch, currentType]);

  const handlePageChange = (page: number): void => {
    pageRouter.get(
      route('contact-channels.index'),
      setTablePageInQueryParams(
        buildContactChannelsIndexQueryParams({
          search: currentSearch,
          type: currentType,
          active: currentActive,
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
  };

  const handlePerPageChange = (perPage: number): void => {
    pageRouter.get(
      route('contact-channels.index'),
      setTablePerPageInQueryParams(
        buildContactChannelsIndexQueryParams({
          search: currentSearch,
          type: currentType,
          active: currentActive,
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
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    pageRouter.get(
      route('contact-channels.index'),
      buildContactChannelsIndexQueryParams({
        search,
        type,
        active,
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleResetFilters = (): void => {
    setSearch('');
    setType('');
    setActive('');

    pageRouter.get(
      route('contact-channels.index'),
      buildContactChannelsIndexQueryParams({
        search: '',
        type: '',
        active: '',
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleSortChange = (column: string): void => {
    pageRouter.get(
      route('contact-channels.index'),
      setTableSortInQueryParams(
        serializeTableQueryParams({
          per_page: currentPerPage,
          search: currentSearch,
          type: currentType,
          active: currentActive,
        }),
        toggleTableSortState(sortState, column),
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tForm('sections.managementTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <div className="mb-6">
          <div>
            <h1 className="text-xl leading-tight font-semibold">
              {tForm('sections.managementTitle')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {tForm('help.managementSubtitle')}
            </p>
          </div>
        </div>

        <ContactChannelsTable
          channels={channels}
          onRowClick={(channel) => setSelectedChannel(channel)}
          header={
            <TableToolbar className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <form
                className="flex w-full flex-col gap-3 md:flex-row md:items-center"
                onSubmit={handleSearchSubmit}
              >
                <TableSearchField
                  className="w-full md:max-w-md"
                  aria-label={tForm('filters.searchLabel')}
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder={tForm('filters.searchPlaceholder')}
                  buttonLabel={tForm('filters.searchSubmit')}
                />

                <select
                  aria-label={tForm('filters.typeLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={type}
                  onChange={(event) => setType(event.currentTarget.value)}
                >
                  <option value="">{tForm('filters.typePlaceholder')}</option>
                  {channelTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  aria-label={tForm('filters.activeLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={active}
                  onChange={(event) => setActive(event.currentTarget.value)}
                >
                  <option value="">{tForm('filters.activePlaceholder')}</option>
                  <option value="active">{tForm('filters.activeOnly')}</option>
                  <option value="inactive">{tForm('filters.inactiveOnly')}</option>
                </select>
              </form>

              <div className="flex items-center gap-2 self-end lg:self-auto">
                {currentSearch !== '' || currentType !== '' || currentActive !== '' ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    {tForm('filters.reset')}
                  </Button>
                ) : null}

                <NewButton
                  href={route('contact-channels.create')}
                  label={tActions('newChannel')}
                />
              </div>
            </TableToolbar>
          }
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={CONTACT_CHANNEL_PER_PAGE_OPTIONS}
          sort={sortState}
          sortableColumns={CONTACT_CHANNEL_SORTABLE_COLUMNS}
        />

        <ContactChannelOverlay
          open={selectedChannel !== null}
          channel={selectedChannel}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedChannel(null);
            }
          }}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Index.i18n = ['contact-channels'];

function buildContactChannelsIndexQueryParams({
  search,
  type,
  active,
  perPage,
  sort,
}: {
  search: string;
  type: string;
  active: string;
  perPage?: number;
  sort: TableSortState;
}): Record<string, string> {
  return setTableSortInQueryParams(
    serializeTableQueryParams({
      search,
      type,
      active,
      per_page: perPage,
    }),
    sort,
  );
}
