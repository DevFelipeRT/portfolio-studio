// resources/js/Pages/Initiatives/Index.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { InitiativeHeader } from './Partials/InitiativeHeader';
import { Initiative, InitiativeOverlay } from './Partials/InitiativeOverlay';
import { InitiativesEmptyState } from './Partials/InitiativesEmptyState';
import { InitiativesTable } from './Partials/InitiativesTable';

interface InitiativesIndexProps {
    initiatives: Initiative[];
}

/**
 * Initiatives index page for listing and managing portfolio initiatives.
 */
export default function Index({ initiatives }: InitiativesIndexProps) {
    const [items, setItems] = useState<Initiative[]>(() => [...initiatives]);
    const [selectedInitiative, setSelectedInitiative] =
        useState<Initiative | null>(null);
    const [overlayOpen, setOverlayOpen] = useState(false);

    const hasItems = items.length > 0;

    const orderedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const aStart = new Date(a.start_date).getTime();
            const bStart = new Date(b.start_date).getTime();

            if (Number.isNaN(aStart) || Number.isNaN(bStart)) {
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
                item.id === initiative.id
                    ? { ...item, display: nextDisplay }
                    : item,
            ),
        );

        router.patch(
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

        if (
            !window.confirm('Are you sure you want to delete this initiative?')
        ) {
            return;
        }

        router.delete(route('initiatives.destroy', initiative.id), {
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
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Initiatives
                </h1>
            }
        >
            <Head title="Initiatives" />

            <div className="space-y-4 overflow-hidden">
                <InitiativeHeader
                    total={items.length}
                    visibleCount={visibleCount}
                    createRoute={route('initiatives.create')}
                />

                {!hasItems && (
                    <InitiativesEmptyState
                        createRoute={route('initiatives.create')}
                    />
                )}

                {hasItems && (
                    <InitiativesTable
                        items={orderedItems}
                        onRowClick={handleRowClick}
                        onToggleDisplay={handleToggleDisplay}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            <InitiativeOverlay
                open={overlayOpen}
                initiative={selectedInitiative}
                onOpenChange={handleOverlayChange}
            />
        </AuthenticatedLayout>
    );
}
