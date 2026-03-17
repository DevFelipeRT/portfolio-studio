// resources/js/Pages/Initiatives/Index.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, pageRouter } from '@/common/page-runtime';
import { useMemo, useState } from 'react';

import type { Initiative } from '@/modules/initiatives/core/types';
import { InitiativeHeader } from '@/modules/initiatives/ui/InitiativeHeader';
import {
  INITIATIVES_NAMESPACES,
  useInitiativesTranslation,
} from '@/modules/initiatives/i18n';
import { InitiativeOverlay } from '@/modules/initiatives/ui/overlay/InitiativeOverlay';
import { InitiativesEmptyState } from '@/modules/initiatives/ui/InitiativesEmptyState';
import { InitiativesTable } from '@/modules/initiatives/ui/table/InitiativesTable';

interface InitiativesIndexProps {
  initiatives: Initiative[];
}

/**
 * Initiatives index page for listing and managing portfolio initiatives.
 */
export default function Index({ initiatives }: InitiativesIndexProps) {
  const { translate: tSections } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.sections,
  );
  const [items, setItems] = useState<Initiative[]>(() => [...initiatives]);
  const [selectedInitiative, setSelectedInitiative] =
    useState<Initiative | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const hasItems = items.length > 0;

  const getStartTimestamp = (value: string | null): number | null => {
    if (!value) {
      return null;
    }

    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
  };

  const orderedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aStart = getStartTimestamp(a.start_date);
      const bStart = getStartTimestamp(b.start_date);

      if (aStart === null || bStart === null) {
        return b.id - a.id;
      }

      if (aStart !== bStart) {
        return bStart - aStart;
      }

      return b.id - a.id;
    });
  }, [items]);

  const visibleCount = useMemo(
    () => items.filter((item) => item.display).length,
    [items],
  );

  function handleRowClick(initiative: Initiative): void {
    setSelectedInitiative(initiative);
    setOverlayOpen(true);
  }

  function handleOverlayChange(open: boolean): void {
    if (!open) {
      setOverlayOpen(false);
      setSelectedInitiative(null);
      return;
    }

    setOverlayOpen(true);
  }

  function handleToggleDisplay(
    initiative: Initiative,
    event?: React.MouseEvent,
  ): void {
    event?.stopPropagation();

    const nextDisplay = !initiative.display;

    setItems((current) =>
      current.map((item) =>
        item.id === initiative.id ? { ...item, display: nextDisplay } : item,
      ),
    );

    pageRouter.patch(
      route('initiatives.toggle-display', initiative.id),
      {},
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  }

  function handleDelete(
    initiative: Initiative,
    event?: React.MouseEvent,
  ): void {
    event?.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this initiative?')) {
      return;
    }

    pageRouter.delete(route('initiatives.destroy', initiative.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setItems((current) =>
          current.filter((item) => item.id !== initiative.id),
        );

        if (selectedInitiative?.id === initiative.id) {
          setSelectedInitiative(null);
          setOverlayOpen(false);
        }
      },
    });
  }

  return (
    <AuthenticatedLayout>
      <PageHead title={tSections('managementTitle')} />

      <PageContent
        className="space-y-4 overflow-hidden py-8"
        pageWidth="container"
      >
        <InitiativeHeader
          total={items.length}
          visibleCount={visibleCount}
          createRoute={route('initiatives.create')}
        />

        {!hasItems && (
          <InitiativesEmptyState createRoute={route('initiatives.create')} />
        )}

        {hasItems && (
          <InitiativesTable
            items={orderedItems}
            onRowClick={handleRowClick}
            onToggleDisplay={handleToggleDisplay}
            onDelete={handleDelete}
          />
        )}
      </PageContent>

      <InitiativeOverlay
        open={overlayOpen}
        initiative={selectedInitiative}
        onOpenChange={handleOverlayChange}
      />
    </AuthenticatedLayout>
  );
}

Index.i18n = ['initiatives'];
