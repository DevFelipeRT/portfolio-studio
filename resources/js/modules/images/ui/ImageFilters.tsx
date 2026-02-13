import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ImageUsageFilter = 'orphans' | 'projects' | 'initiatives';

export interface ImageFiltersValues {
    search: string;
    usage: string;
    mime_type: string;
    storage_disk: string;
    per_page: string;
}

interface ImageFiltersProps {
    initialValues: Partial<ImageFiltersValues>;
    onApply(values: ImageFiltersValues): void;
    onReset?(): void;
}

/**
 * Filter bar for the images index, exposing search and technical filters.
 */
export function ImageFilters({
    initialValues,
    onApply,
    onReset,
}: ImageFiltersProps) {
    const [search, setSearch] = React.useState(initialValues.search ?? '');
    const [usage, setUsage] = React.useState(initialValues.usage ?? '');
    const [mimeType, setMimeType] = React.useState(
        initialValues.mime_type ?? '',
    );
    const [storageDisk, setStorageDisk] = React.useState(
        initialValues.storage_disk ?? '',
    );
    const [perPage, setPerPage] = React.useState(initialValues.per_page ?? '');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const values: ImageFiltersValues = {
            search: search.trim(),
            usage: usage,
            mime_type: mimeType.trim(),
            storage_disk: storageDisk.trim(),
            per_page: perPage.trim(),
        };

        onApply(values);
    };

    const handleResetClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        setSearch('');
        setUsage('');
        setMimeType('');
        setStorageDisk('');
        setPerPage('');

        if (onReset) {
            onReset();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-background border-muted/60 mb-4 rounded-lg border p-4 shadow-xs"
        >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <div className="space-y-1">
                    <Label htmlFor="image-filter-search">Search</Label>
                    <Input
                        id="image-filter-search"
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Filename, title, caption or alt text"
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image-filter-usage">Usage</Label>
                    <select
                        id="image-filter-usage"
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={usage}
                        onChange={(event) => setUsage(event.target.value)}
                    >
                        <option value="">Any usage</option>
                        <option value="orphans">Orphans only</option>
                        <option value="projects">Used by projects</option>
                        <option value="initiatives">Used by initiatives</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image-filter-mime-type">MIME type</Label>
                    <Input
                        id="image-filter-mime-type"
                        type="text"
                        value={mimeType}
                        onChange={(event) => setMimeType(event.target.value)}
                        placeholder="image/jpeg, image/png, ..."
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image-filter-storage-disk">
                        Storage disk
                    </Label>
                    <Input
                        id="image-filter-storage-disk"
                        type="text"
                        value={storageDisk}
                        onChange={(event) => setStorageDisk(event.target.value)}
                        placeholder="public, s3, ..."
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image-filter-per-page">Per page</Label>
                    <Input
                        id="image-filter-per-page"
                        type="number"
                        min={1}
                        value={perPage}
                        onChange={(event) => setPerPage(event.target.value)}
                        placeholder="15"
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetClick}
                >
                    Reset filters
                </Button>

                <Button type="submit" size="sm">
                    Apply filters
                </Button>
            </div>
        </form>
    );
}
