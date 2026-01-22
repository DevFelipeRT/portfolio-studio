import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import type { ExperienceFormData } from '@/Modules/Experiences/core/forms';
import { RichTextEditor } from '@/Common/RichText/RichTextEditor';

export default function Create() {
    const { data, setData, post, processing, errors } =
        useForm<ExperienceFormData>({
            position: '',
            company: '',
            summary: '',
            description: '',
            start_date: '',
            end_date: '',
            display: false,
        });

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        post(route('experiences.store'));
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
        <AuthenticatedLayout>
            <Head title="New experience" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('experiences.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to experiences
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
                    >
                        <section className="space-y-4">
                            <h2 className="text-lg font-medium">
                                Experience details
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        value={data.position}
                                        onChange={(event) =>
                                            setData(
                                                'position',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {errors.position && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.position)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        value={data.company}
                                        onChange={(event) =>
                                            setData(
                                                'company',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {errors.company && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.company)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="summary">Summary</Label>
                                <Input
                                    id="summary"
                                    value={data.summary}
                                    onChange={(event) =>
                                        setData(
                                            'summary',
                                            event.target.value,
                                        )
                                    }
                                />
                                {errors.summary && (
                                    <p className="text-destructive text-sm">
                                        {normalizeError(errors.summary)}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">
                                    Description
                                </Label>
                                <RichTextEditor
                                    id="description"
                                    value={data.description}
                                    onChange={(value) =>
                                        setData('description', value)
                                    }
                                />
                                {errors.description && (
                                    <p className="text-destructive text-sm">
                                        {normalizeError(errors.description)}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="start_date">
                                        Start date
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(event) =>
                                            setData(
                                                'start_date',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {errors.start_date && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.start_date)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="end_date">End date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(event) =>
                                            setData(
                                                'end_date',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {errors.end_date && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.end_date)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="display"
                                    checked={data.display}
                                    onCheckedChange={(checked) =>
                                        setData('display', !!checked)
                                    }
                                />
                                <label
                                    htmlFor="display"
                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Display on portfolio
                                </label>
                            </div>
                            {errors.display && (
                                <p className="text-destructive text-sm">
                                    {normalizeError(errors.display)}
                                </p>
                            )}
                        </section>

                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={route('experiences.index')}
                                className="text-muted-foreground hover:text-foreground text-sm"
                            >
                                Cancel
                            </Link>

                            <Button type="submit" disabled={processing}>
                                Save experience
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
