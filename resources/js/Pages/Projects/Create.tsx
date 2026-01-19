import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import type { Skill } from '../types';
import { ProjectForm } from './Partials/ProjectForm';

interface CreateProjectProps {
    skills: Skill[];
}

export default function Create({ skills }: CreateProjectProps) {
    const { data, setData, post, processing, errors } =
        useForm<ProjectFormData>({
            name: '',
            short_description: '',
            long_description: '',
            status: '',
            repository_url: '',
            live_url: '',
            display: false,
            skill_ids: [],
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

    function toggleSkill(id: number): void {
        setData((current: ProjectFormData) => {
            const exists = current.skill_ids.includes(id);

            return {
                ...current,
                skill_ids: exists
                    ? current.skill_ids.filter(
                          (item: number) => item !== id,
                      )
                    : [...current.skill_ids, id],
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

        post(route('projects.store'), {
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
                    New project
                </h1>
            }
        >
            <Head title="New project" />

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
                        skills={skills}
                        existingImages={[]}
                        projectId={undefined}
                        data={data}
                        errors={errors}
                        processing={processing}
                        submitLabel="Save project"
                        onSubmit={submit}
                        onChangeField={changeField}
                        onToggleSkill={toggleSkill}
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
