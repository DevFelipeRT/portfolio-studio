import { Button } from '@/Components/Ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Technology } from '../types';

interface TechnologiesIndexProps {
    technologies: Technology[];
}

export default function Index({ technologies }: TechnologiesIndexProps) {
    const hasTechnologies = technologies.length > 0;

    const handleDelete = (id: number): void => {
        if (
            !window.confirm('Are you sure you want to delete this technology?')
        ) {
            return;
        }

        router.delete(route('technologies.destroy', id));
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
                    <div className="bg-card overflow-hidden rounded-lg border">
                        <table className="min-w-full divide-y text-sm">
                            <thead className="bg-muted/60">
                                <tr>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Updated at
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {technologies.map((technology) => (
                                    <tr key={technology.id}>
                                        <td className="px-4 py-3 align-top">
                                            <div className="font-medium">
                                                {technology.name}
                                            </div>
                                        </td>

                                        <td className="text-muted-foreground px-4 py-3 align-top text-xs whitespace-nowrap">
                                            {technology.updated_at ?? '—'}
                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <div className="flex justify-end gap-3 text-xs">
                                                <Link
                                                    href={route(
                                                        'technologies.edit',
                                                        technology.id,
                                                    )}
                                                    className="text-primary font-medium hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            technology.id,
                                                        )
                                                    }
                                                    className="text-destructive font-medium hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
