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
import { router } from '@inertiajs/react';
import { FilterX, Search } from 'lucide-react';
import React from 'react';

interface PageFiltersProps {
    initialStatus?: string | null;
    initialSearch?: string | null;
}

/**
 * Filters row for the page index.
 *
 * Controls are wired to perform Inertia GET requests to the
 * admin.content.pages.index route, preserving state.
 */
export function PageFilters({
    initialStatus,
    initialSearch,
}: PageFiltersProps) {
    /**
     * Internal status state:
     * - 'all'  => no status filter applied
     * - 'draft' | 'published' | 'archived' => filtered
     */
    const [status, setStatus] = React.useState<string>(
        initialStatus && initialStatus !== '' ? initialStatus : 'all',
    );

    const [search, setSearch] = React.useState<string>(initialSearch ?? '');

    const applyFilters = (nextStatus: string, nextSearch: string): void => {
        const params: Record<string, string> = {};
        const trimmedSearch = nextSearch.trim();

        if (nextStatus && nextStatus !== 'all') {
            params.status = nextStatus;
        }

        if (trimmedSearch !== '') {
            params.search = trimmedSearch;
        }

        router.get(route('admin.content.pages.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusChange = (value: string): void => {
        setStatus(value);
        applyFilters(value, search);
    };

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        applyFilters(status, search);
    };

    const handleReset = (): void => {
        setStatus('all');
        setSearch('');
        applyFilters('all', '');
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
                            {/* Nenhum SelectItem usa value="" aqui */}
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
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
