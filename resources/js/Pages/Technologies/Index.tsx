import { Button } from '@/Components/Ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Technology } from '../types';
import { TechnologiesTable } from './Partials/TechnologiesTable';
import { PageProps } from '@/types';

interface TechnologiesIndexProps {
    technologies: Technology[];
}

type PagePropsWithTechnologyCategories = PageProps<{
    technologyCategories: Record<string, string>;
}>;

export default function Index({ technologies }: TechnologiesIndexProps) {
    const { technologyCategories } =
        usePage<PagePropsWithTechnologyCategories>().props;

    const hasTechnologies = technologies.length > 0;

    const handleEdit = (technology: Technology): void => {
        router.get(route('technologies.edit', technology.id));
    };

    const handleDelete = (
        technology: Technology,
        event?: React.MouseEvent,
    ): void => {
        event?.stopPropagation();

        if (
            !window.confirm('Are you sure you want to delete this technology?')
        ) {
            return;
        }

        router.delete(route('technologies.destroy', technology.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Technology catalog
                </h1>
            }
        >
            <Head title="Technologies" />

            <div className="overflow-hidden">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage the reusable technologies referenced by your
                            portfolio projects.
                        </p>
                    </div>

                    <Link href={route('technologies.create')}>
                        <Button size="sm">New technology</Button>
                    </Link>
                </div>

                {!hasTechnologies && (
                    <p className="text-muted-foreground text-sm">
                        No technologies have been created yet.
                    </p>
                )}

                {hasTechnologies && (
                    <TechnologiesTable
                        items={technologies}
                        categories={technologyCategories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
