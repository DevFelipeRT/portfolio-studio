import * as React from 'react';

import { useCurrentPage } from '@/common/page-runtime';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IMAGES_NAMESPACES, useImagesTranslation } from '@/modules/images/i18n';

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
    const currentPage = useCurrentPage();
    const { translate: tActions } = useImagesTranslation(IMAGES_NAMESPACES.actions);
    const { translate: tImages } = useImagesTranslation(IMAGES_NAMESPACES.images);
    const [search, setSearch] = React.useState(initialValues.search ?? '');
    const [usage, setUsage] = React.useState(initialValues.usage ?? '');
    const [mimeType, setMimeType] = React.useState(
        initialValues.mime_type ?? '',
    );
    const [storageDisk, setStorageDisk] = React.useState(
        initialValues.storage_disk ?? '',
    );
    const [perPage, setPerPage] = React.useState(initialValues.per_page ?? '');

    React.useEffect(() => {
        setSearch(initialValues.search ?? '');
        setUsage(initialValues.usage ?? '');
        setMimeType(initialValues.mime_type ?? '');
        setStorageDisk(initialValues.storage_disk ?? '');
        setPerPage(initialValues.per_page ?? '');
    }, [
        currentPage.url,
        initialValues.mime_type,
        initialValues.per_page,
        initialValues.search,
        initialValues.storage_disk,
        initialValues.usage,
    ]);

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
                    <Label htmlFor="image-filter-search">
                        {tImages('filters.fields.search.label')}
                    </Label>
                    <Input
                        id="image-filter-search"
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={tImages('filters.fields.search.placeholder')}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image-filter-usage">
                        {tImages('filters.fields.usage.label')}
                    </Label>
                    <select
                        id="image-filter-usage"
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={usage}
                        onChange={(event) => setUsage(event.target.value)}
                    >
                        <option value="">
                            {tImages('filters.fields.usage.placeholder')}
                        </option>
                        <option value="orphans">
                            {tImages('filters.fields.usage.options.orphans')}
                        </option>
                        <option value="projects">
                            {tImages('filters.fields.usage.options.projects')}
                        </option>
                        <option value="initiatives">
                            {tImages('filters.fields.usage.options.initiatives')}
                        </option>
                    </select>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image-filter-mime-type">
                        {tImages('filters.fields.mimeType.label')}
                    </Label>
                    <Input
                        id="image-filter-mime-type"
                        type="text"
                        value={mimeType}
                        onChange={(event) => setMimeType(event.target.value)}
                        placeholder={tImages('filters.fields.mimeType.placeholder')}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image-filter-storage-disk">
                        {tImages('filters.fields.storageDisk.label')}
                    </Label>
                    <Input
                        id="image-filter-storage-disk"
                        type="text"
                        value={storageDisk}
                        onChange={(event) => setStorageDisk(event.target.value)}
                        placeholder={tImages(
                            'filters.fields.storageDisk.placeholder',
                        )}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image-filter-per-page">
                        {tImages('filters.fields.perPage.label')}
                    </Label>
                    <Input
                        id="image-filter-per-page"
                        type="number"
                        min={1}
                        value={perPage}
                        onChange={(event) => setPerPage(event.target.value)}
                        placeholder={tImages('filters.fields.perPage.placeholder')}
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
                    {tActions('resetFilters')}
                </Button>

                <Button type="submit" size="sm">
                    {tActions('applyFilters')}
                </Button>
            </div>
        </form>
    );
}
