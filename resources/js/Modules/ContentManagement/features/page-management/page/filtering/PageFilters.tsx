import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/Ui/select';
import { FilterX, Search } from 'lucide-react';
import React from 'react';
import {
    DEFAULT_PAGE_LIST_FILTERS,
    type PageListFilters,
} from './index';
import { PAGE_STATUS_FILTER_OPTIONS } from './constants';

interface PageFiltersProps {
    /**
     * Initial filter values for the UI.
     *
     * Consumers typically pass a normalized value (see `normalizePageListFilters`)
     * so the component can remain purely controlled by its own local state.
     */
    initialFilters: PageListFilters;
    /**
     * Called when the user applies, changes, or resets filters.
     *
     * This component does not perform navigation; the consumer decides how to
     * persist filters (e.g. update URL, refetch data, Inertia router.get, etc).
     */
    onApply: (filters: PageListFilters) => void;
}

/**
 * Reusable filter row for page listing screens.
 */
export function PageFilters({
    initialFilters,
    onApply,
}: PageFiltersProps) {
    const [status, setStatus] = React.useState<PageListFilters['status']>(
        initialFilters.status,
    );

    const [search, setSearch] = React.useState<PageListFilters['search']>(
        initialFilters.search,
    );

    const applyFilters = (next: PageListFilters): void => {
        onApply(next);
    };

    const handleStatusChange = (value: string): void => {
        const nextStatus = value as PageListFilters['status'];
        setStatus(nextStatus);
        applyFilters({ status: nextStatus, search });
    };

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        applyFilters({ status, search });
    };

    const handleReset = (): void => {
        setStatus(DEFAULT_PAGE_LIST_FILTERS.status);
        setSearch(DEFAULT_PAGE_LIST_FILTERS.search);
        applyFilters(DEFAULT_PAGE_LIST_FILTERS);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-card flex flex-col gap-3 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between"
        >
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <div className="w-full sm:max-w-xs">
                    <Label htmlFor="page-search">Search</Label>
                    <div className="mt-1 flex items-center gap-2">
                        <div className="relative flex-1">
                            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                                <Search className="text-muted-foreground h-4 w-4" />
                            </span>
                            <Input
                                id="page-search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Filter by title or slug"
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full sm:max-w-xs">
                    <Label htmlFor="page-status">Status</Label>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger id="page-status" className="mt-1">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_STATUS_FILTER_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2">
                <Button type="submit" variant="outline" className="gap-2">
                    <Search className="h-4 w-4" />
                    Apply
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    className="gap-2"
                    onClick={handleReset}
                >
                    <FilterX className="h-4 w-4" />
                    Reset
                </Button>
            </div>
        </form>
    );
}
