import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { InitiativeForm } from '@/Modules/Initiatives/ui/InitiativeForm';

export default function Create() {
    return (
        <AuthenticatedLayout>
            <Head title="New initiative" />

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
                        mode="create"
                        submitRoute={route('initiatives.store')}
                        backRoute={route('initiatives.index')}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
