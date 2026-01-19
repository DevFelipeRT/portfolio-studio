import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import { Link } from '@inertiajs/react';
import type { ProjectImage, Skill } from '../../types';

interface ProjectFormProps {
    skills: Skill[];
    existingImages: ProjectImage[];
    data: ProjectFormData;
    errors: Record<string, string | string[]>;
    processing: boolean;
    submitLabel: string;
    projectId?: number;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onChangeField: <K extends keyof ProjectFormData>(
        key: K,
        value: ProjectFormData[K],
    ) => void;
    onToggleSkill: (id: number) => void;
    onAddImageRow: () => void;
    onRemoveImageRow: (index: number) => void;
    onUpdateImageAlt: (index: number, value: string) => void;
    onUpdateImageFile: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    normalizeError: (message: string | string[] | undefined) => string | null;
}

/**
 * Reusable project form partial used by both create and edit flows.
 */
export function ProjectForm({
    skills,
    existingImages,
    data,
    errors,
    processing,
    submitLabel,
    projectId,
    onSubmit,
    onChangeField,
    onToggleSkill,
    onAddImageRow,
    onRemoveImageRow,
    onUpdateImageAlt,
    onUpdateImageFile,
    normalizeError,
}: ProjectFormProps) {
    const hasExistingImages = existingImages.length > 0;
    const hasNewImages = data.images.length > 0;

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
        >
            <section className="space-y-4">
                <h2 className="text-lg font-medium">Basic information</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(event) =>
                                onChangeField('name', event.target.value)
                            }
                        />
                        {errors.name && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.name)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="status">Status</Label>
                        <Input
                            id="status"
                            value={data.status}
                            onChange={(event) =>
                                onChangeField('status', event.target.value)
                            }
                            placeholder="Example: draft, published"
                        />
                        {errors.status && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.status)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="short_description">Short description</Label>
                    <Input
                        id="short_description"
                        value={data.short_description}
                        onChange={(event) =>
                            onChangeField(
                                'short_description',
                                event.target.value,
                            )
                        }
                    />
                    {errors.short_description && (
                        <p className="text-destructive text-sm">
                            {normalizeError(errors.short_description)}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="long_description">Long description</Label>
                    <Textarea
                        id="long_description"
                        value={data.long_description}
                        onChange={(event) =>
                            onChangeField(
                                'long_description',
                                event.target.value,
                            )
                        }
                        rows={6}
                    />
                    {errors.long_description && (
                        <p className="text-destructive text-sm">
                            {normalizeError(errors.long_description)}
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="display"
                        checked={data.display}
                        onCheckedChange={(checked) =>
                            onChangeField('display', !!checked)
                        }
                    />
                    <label
                        htmlFor="display"
                        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Display on landing
                    </label>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-medium">Links</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="repository_url">Repository URL</Label>
                        <Input
                            id="repository_url"
                            value={data.repository_url}
                            onChange={(event) =>
                                onChangeField(
                                    'repository_url',
                                    event.target.value,
                                )
                            }
                            placeholder="https://"
                        />
                        {errors.repository_url && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.repository_url)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="live_url">Live URL</Label>
                        <Input
                            id="live_url"
                            value={data.live_url}
                            onChange={(event) =>
                                onChangeField('live_url', event.target.value)
                            }
                            placeholder="https://"
                        />
                        {errors.live_url && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.live_url)}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-medium">Skills</h2>

                <div className="bg-background rounded-md border p-4">
                    {skills.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                            No skills available.
                        </p>
                    )}

                    {skills.length > 0 && (
                        <div className="grid gap-2 md:grid-cols-3">
                            {skills.map((skill: Skill) => {
                                const checked = data.skill_ids.includes(
                                    skill.id,
                                );

                                return (
                                    <label
                                        key={skill.id}
                                        className="bg-card flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            className="border-muted-foreground h-4 w-4 rounded"
                                            checked={checked}
                                            onChange={() =>
                                                onToggleSkill(skill.id)
                                            }
                                        />
                                        <span>{skill.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

                {errors.skill_ids && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.skill_ids)}
                    </p>
                )}
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-medium">Images</h2>

                <div className="space-y-6">
                    {hasExistingImages && (
                        <div className="space-y-2">
                            <div className="grid gap-3 md:grid-cols-3">
                                {existingImages.map((image) => {
                                    const resolvedUrl =
                                        image.url ??
                                        (image.storage_path
                                            ? route('storage.local', {
                                                  path: image.storage_path,
                                              })
                                            : null);

                                    if (!resolvedUrl) {
                                        return null;
                                    }

                                    const imageAlt =
                                        image.alt_text ||
                                        image.image_title ||
                                        image.caption ||
                                        '';
                                    const caption =
                                        image.caption || imageAlt || '';

                                    return (
                                        <figure
                                            key={image.id}
                                            className="bg-background flex flex-col gap-2 rounded-md border p-3"
                                        >
                                            <img
                                                src={resolvedUrl}
                                                alt={imageAlt}
                                                className="h-32 w-full rounded-md object-cover"
                                            />
                                            {caption && (
                                                <figcaption className="text-muted-foreground text-xs">
                                                    {caption}
                                                </figcaption>
                                            )}

                                            {projectId && (
                                                <div className="flex justify-end">
                                                    <Link
                                                        href={route(
                                                            'projects.images.destroy',
                                                            {
                                                                project:
                                                                    projectId,
                                                                image: image.id,
                                                            },
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        className="text-destructive text-xs hover:underline"
                                                    >
                                                        Delete image
                                                    </Link>
                                                </div>
                                            )}
                                        </figure>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {!hasNewImages && !hasExistingImages && (
                            <p className="text-muted-foreground text-sm">
                                No images added yet.
                            </p>
                        )}

                        {!hasNewImages && hasExistingImages && (
                            <p className="text-muted-foreground text-sm">
                                No new images selected.
                            </p>
                        )}

                        {data.images.map((image, index) => (
                            <div
                                key={index}
                                className="bg-background grid gap-3 rounded-md border p-3 md:grid-cols-[2fr,2fr,auto]"
                            >
                                <div className="space-y-1.5">
                                    <Label htmlFor={`image-file-${index}`}>
                                        Image file
                                    </Label>
                                    <Input
                                        id={`image-file-${index}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) =>
                                            onUpdateImageFile(index, event)
                                        }
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor={`image-alt-${index}`}>
                                        Alt text (optional)
                                    </Label>
                                    <Input
                                        id={`image-alt-${index}`}
                                        value={image.alt ?? ''}
                                        onChange={(event) =>
                                            onUpdateImageAlt(
                                                index,
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-end justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onRemoveImageRow(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onAddImageRow}
                        >
                            Add image
                        </Button>

                        {errors.images && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.images)}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-between gap-3">
                <Link
                    href={route('projects.index')}
                    className="text-muted-foreground hover:text-foreground text-sm"
                >
                    Cancel
                </Link>

                <div className="flex items-center gap-3">
                    {projectId && (
                        <Link
                            href={route('projects.destroy', projectId)}
                            method="delete"
                            as="button"
                            className="text-destructive text-sm hover:underline"
                        >
                            Delete
                        </Link>
                    )}

                    <Button type="submit" disabled={processing}>
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
}
