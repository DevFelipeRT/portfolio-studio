import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Course } from '../types';

interface EditCourseProps {
    course: Course;
}

export default function Edit({ course }: EditCourseProps) {
    const { data, setData, put, processing, errors } = useForm<CourseFormData>({
        name: course.name,
        institution: course.institution,
        short_description: course.short_description,
        long_description: course.long_description,
        start_date: course.start_date,
        end_date: course.end_date ?? '',
        display: course.display,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        put(route('courses.update', course.id));
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
                    Edit course
                </h1>
            }
        >
            <Head title={`Edit course - ${course.name}`} />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('courses.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to courses
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
                    >
                        <section className="space-y-4">
                            <h2 className="text-lg font-medium">
                                Basic information
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.name)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="institution">
                                        Institution
                                    </Label>
                                    <Input
                                        id="institution"
                                        value={data.institution}
                                        onChange={(event) =>
                                            setData(
                                                'institution',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {errors.institution && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.institution)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="short_description">
                                    Short description
                                </Label>
                                <Input
                                    id="short_description"
                                    value={data.short_description}
                                    onChange={(event) =>
                                        setData(
                                            'short_description',
                                            event.target.value,
                                        )
                                    }
                                />
                                {errors.short_description && (
                                    <p className="text-destructive text-sm">
                                        {normalizeError(
                                            errors.short_description,
                                        )}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="long_description">
                                    Long description
                                </Label>
                                <Textarea
                                    id="long_description"
                                    value={data.long_description}
                                    onChange={(event) =>
                                        setData(
                                            'long_description',
                                            event.target.value,
                                        )
                                    }
                                    rows={6}
                                />
                                {errors.long_description && (
                                    <p className="text-destructive text-sm">
                                        {normalizeError(
                                            errors.long_description,
                                        )}
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-medium">Schedule</h2>

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
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-medium">Visibility</h2>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="display"
                                    checked={data.display}
                                    onCheckedChange={(checked) => {
                                        setData('display', !!checked);
                                    }}
                                />
                                <label
                                    htmlFor="display"
                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Display on portfolio
                                </label>
                            </div>
                        </section>

                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={route('courses.index')}
                                className="text-muted-foreground hover:text-foreground text-sm"
                            >
                                Cancel
                            </Link>

                            <Button type="submit" disabled={processing}>
                                Save changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
