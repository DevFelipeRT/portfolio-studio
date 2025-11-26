import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<TechnologyFormData>({
        name: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        post(route('technologies.store'));
    };

    const normalizeError = (
        message: string | string[] | undefined,
    ): string | null => {
        if (!message) {
            return null;
        }

        if (Array.isArray(message)) {
            return message.join(' ');
        }

        return message;
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    New technology
                </h1>
            }
        >
            <Head title="New technology" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('technologies.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to technologies
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm">
                                    {normalizeError(errors.name)}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={route('technologies.index')}
                                className="text-muted-foreground hover:text-foreground text-sm"
                            >
                                Cancel
                            </Link>

                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
