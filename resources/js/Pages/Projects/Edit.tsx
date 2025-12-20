import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import type { Project, ProjectImage, Technology } from '../types';
import { ProjectForm } from './Partials/ProjectForm';

interface EditProjectProps {
    project: Project;
    technologies: Technology[];
}

/**
 * Edit project page that wires Inertia form state to the reusable ProjectForm.
 */
export default function Edit({ project, technologies }: EditProjectProps) {
    const existingImages: ProjectImage[] = project.images ?? [];

    const initialTechnologyIds: number[] = project.technologies.map(
        (tech: Technology) => tech.id,
    );

    const { data, setData, post, processing, errors, transform } =
        useForm<ProjectFormData>({
            name: project.name,
            short_description: project.short_description,
            long_description: project.long_description,
            status: project.status,
            repository_url: project.repository_url ?? '',
            live_url: project.live_url ?? '',
            display: project.display,
            technology_ids: initialTechnologyIds,
            images: [],
        });

    function changeField<K extends keyof ProjectFormData>(
        key: K,
        value: ProjectFormData[K],
    ): void {
        setData((current: ProjectFormData) => ({
            ...current,
            [key]: value,
        }));
    }

    function toggleTechnology(id: number): void {
        setData((current: ProjectFormData) => {
            const exists = current.technology_ids.includes(id);

            return {
                ...current,
                technology_ids: exists
                    ? current.technology_ids.filter(
                          (item: number) => item !== id,
                      )
                    : [...current.technology_ids, id],
            };
        });
    }

    function addImageRow(): void {
        setData((current: ProjectFormData) => ({
            ...current,
            images: [
                ...current.images,
                {
                    file: null,
                    alt: '',
                } as ImageInput,
            ],
        }));
    }

    function removeImageRow(index: number): void {
        setData((current: ProjectFormData) => ({
            ...current,
            images: current.images.filter((_image, i) => i !== index),
        }));
    }

    function updateImageAlt(index: number, value: string): void {
        setData((current: ProjectFormData) => ({
            ...current,
            images: current.images.map((image, i) =>
                i === index ? { ...image, alt: value } : image,
            ),
        }));
    }

    function updateImageFile(
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ): void {
        const file = event.target.files?.[0] ?? null;

        setData((current: ProjectFormData) => ({
            ...current,
            images: current.images.map((image, i) =>
                i === index ? { ...image, file } : image,
            ),
        }));
    }

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        transform((formData) => ({
            ...formData,
            _method: 'put',
        }));

        post(route('projects.update', project.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    function normalizeError(
        message: string | string[] | undefined,
    ): string | null {
        if (!message) {
            return null;
        }

        if (Array.isArray(message)) {
            return message.join(' ');
        }

        return message;
    }

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Edit project
                </h1>
            }
        >
            <Head title={`Edit project: ${project.name}`} />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                    <div className="mb-4">
                        <Link
                            href={route('projects.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to projects
                        </Link>
                    </div>

                    <ProjectForm
                        technologies={technologies}
                        existingImages={existingImages}
                        projectId={project.id}
                        data={data}
                        errors={errors}
                        processing={processing}
                        submitLabel="Save changes"
                        onSubmit={submit}
                        onChangeField={changeField}
                        onToggleTechnology={toggleTechnology}
                        onAddImageRow={addImageRow}
                        onRemoveImageRow={removeImageRow}
                        onUpdateImageAlt={updateImageAlt}
                        onUpdateImageFile={updateImageFile}
                        normalizeError={normalizeError}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
