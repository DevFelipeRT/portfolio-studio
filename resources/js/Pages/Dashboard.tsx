import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl font-semibold leading-tight">
                    Dashboard
                </h1>
            }
        >
            <Head title="Dashboard" />

            <div className="overflow-hidden">
                <div className="">You're logged in!</div>
            </div>
        </AuthenticatedLayout>
    );
}
