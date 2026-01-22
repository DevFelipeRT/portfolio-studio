import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import type { Initiative } from '@/Modules/Initiatives/core/types';
import { InitiativeForm } from '@/Modules/Initiatives/ui/InitiativeForm';

interface EditInitiativeProps {
    initiative: Initiative;
}

export default function Edit({ initiative }: EditInitiativeProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Edit initiative" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('initiatives.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to initiatives
                        </Link>
                    </div>

                    <InitiativeForm
                        mode="edit"
                        submitRoute={route('initiatives.update', initiative.id)}
                        backRoute={route('initiatives.index')}
                        initialValues={{
                            name: initiative.name,
                            short_description: initiative.short_description,
                            long_description: initiative.long_description,
                            display: initiative.display,
                            start_date: initiative.start_date,
                            end_date: initiative.end_date ?? null,
                        }}
                        existingImages={initiative.images ?? []}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
