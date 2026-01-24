import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/Ui/select';
import { Textarea } from '@/Components/Ui/textarea';
import type { WebsiteSettingsFormData } from '@/Modules/WebsiteSettings/core/forms';
import React, { JSX } from 'react';
import { Link } from '@inertiajs/react';

export type WebsiteSettingsFormErrors = Record<string, string | string[] | undefined>;

type LocalizedFieldType = 'input' | 'textarea';

interface LocalizedFieldProps {
    id: string;
    label: string;
    locales: string[];
    values: Record<string, string>;
    onChange(locale: string, value: string): void;
    errors: WebsiteSettingsFormErrors;
    type?: LocalizedFieldType;
    placeholder?: string;
    description?: string;
}

function LocalizedField({
    id,
    label,
    locales,
    values,
    onChange,
    errors,
    type = 'input',
    placeholder,
    description,
}: LocalizedFieldProps) {
    const normalizeError = (message: string | string[] | undefined): string | null => {
        if (!message) {
            return null;
        }

        if (Array.isArray(message)) {
            return message.join(' ');
        }

        return message;
    };

    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <Label htmlFor={id}>{label}</Label>
                {description && (
                    <p className="text-muted-foreground text-xs">{description}</p>
                )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                {locales.map((locale) => {
                    const fieldId = `${id}-${locale}`;
                    const errorKey = `${id}.${locale}`;
                    const error = normalizeError(errors[errorKey]);

                    return (
                        <div key={fieldId} className="space-y-1.5">
                            <Label htmlFor={fieldId} className="text-xs uppercase">
                                {locale}
                            </Label>
                            {type === 'textarea' ? (
                                <Textarea
                                    id={fieldId}
                                    value={values[locale] ?? ''}
                                    onChange={(event) =>
                                        onChange(locale, event.target.value)
                                    }
                                    placeholder={placeholder}
                                    rows={3}
                                />
                            ) : (
                                <Input
                                    id={fieldId}
                                    value={values[locale] ?? ''}
                                    onChange={(event) =>
                                        onChange(locale, event.target.value)
                                    }
                                    placeholder={placeholder}
                                />
                            )}
                            {error && (
                                <p className="text-destructive text-xs">{error}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface WebsiteSettingsFormProps {
    data: WebsiteSettingsFormData;
    errors: WebsiteSettingsFormErrors;
    processing: boolean;
    onChange(field: keyof WebsiteSettingsFormData, value: unknown): void;
    onSubmit(event: React.FormEvent<HTMLFormElement>): void;
    cancelHref: string;
    locales: string[];
}

export function WebsiteSettingsForm({
    data,
    errors,
    processing,
    onChange,
    onSubmit,
    cancelHref,
    locales,
}: WebsiteSettingsFormProps) {
    const normalizeError = (message: string | string[] | undefined): string | null => {
        if (!message) {
            return null;
        }

        if (Array.isArray(message)) {
            return message.join(' ');
        }

        return message;
    };

    const handleLocaleMapChange = (
        field: 'site_name' | 'site_description' | 'default_meta_title' | 'default_meta_description',
        locale: string,
        value: string,
    ) => {
        onChange(field, {
            ...data[field],
            [locale]: value,
        });
    };

    const localeCandidates = React.useMemo(() => {
        const set = new Set<string>();

        locales.forEach((locale) => {
            if (locale && locale !== 'auto') {
                set.add(locale);
            }
        });

        if (data.default_locale && data.default_locale !== 'auto') {
            set.add(data.default_locale);
        }

        if (data.fallback_locale && data.fallback_locale !== 'auto') {
            set.add(data.fallback_locale);
        }

        Object.keys(data.site_name).forEach((locale) => set.add(locale));
        Object.keys(data.site_description).forEach((locale) => set.add(locale));
        Object.keys(data.default_meta_title).forEach((locale) => set.add(locale));
        Object.keys(data.default_meta_description).forEach((locale) => set.add(locale));

        return Array.from(set).filter(Boolean);
    }, [
        locales,
        data.default_locale,
        data.fallback_locale,
        data.site_name,
        data.site_description,
        data.default_meta_title,
        data.default_meta_description,
    ]);

    const handleLinkChange = (
        index: number,
        field: 'label' | 'url',
        value: string,
    ) => {
        const next = data.institutional_links.map((link, idx) =>
            idx === index ? { ...link, [field]: value } : link,
        );

        onChange('institutional_links', next);
    };

    const handleAddLink = () => {
        onChange('institutional_links', [
            ...data.institutional_links,
            { label: '', url: '' },
        ]);
    };

    const handleRemoveLink = (index: number) => {
        onChange(
            'institutional_links',
            data.institutional_links.filter((_, idx) => idx !== index),
        );
    };

    const localizedFieldLocales =
        localeCandidates.length > 0
            ? localeCandidates
            : data.default_locale && data.default_locale !== 'auto'
              ? [data.default_locale]
              : [];

    const robotsPublicError = normalizeError(errors['robots.public.index']);
    const robotsPrivateError = normalizeError(errors['robots.private.index']);

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card space-y-10 rounded-lg border p-6 shadow-sm"
        >
            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Identidade do site</h2>
                    <p className="text-muted-foreground text-sm">
                        Informações públicas e responsáveis pelo branding global.
                    </p>
                </div>

                {localizedFieldLocales.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        Nenhum locale encontrado no CMS. Crie uma página pública
                        para habilitar campos localizados.
                    </p>
                )}

                <LocalizedField
                    id="site_name"
                    label="Nome do site"
                    locales={localizedFieldLocales}
                    values={data.site_name}
                    onChange={(locale, value) =>
                        handleLocaleMapChange('site_name', locale, value)
                    }
                    errors={errors}
                    placeholder="Nome do site"
                />

                <LocalizedField
                    id="site_description"
                    label="Descrição do site"
                    locales={localizedFieldLocales}
                    values={data.site_description}
                    onChange={(locale, value) =>
                        handleLocaleMapChange('site_description', locale, value)
                    }
                    errors={errors}
                    placeholder="Descrição curta"
                    type="textarea"
                />

                <div className="space-y-1.5">
                    <Label htmlFor="owner_name">Responsável / Owner</Label>
                    <Input
                        id="owner_name"
                        value={data.owner_name}
                        onChange={(event) =>
                            onChange('owner_name', event.target.value)
                        }
                        placeholder="Nome do responsável"
                    />
                    {errors.owner_name && (
                        <p className="text-destructive text-xs">
                            {normalizeError(errors.owner_name)}
                        </p>
                    )}
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Locales</h2>
                    <p className="text-muted-foreground text-sm">
                        Define o locale padrão (fixo ou automático) e o fallback
                        usado quando não há conteúdo.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="default_locale">Locale padrão</Label>
                        <Select
                            value={data.default_locale}
                            onValueChange={(value) =>
                                onChange('default_locale', value)
                            }
                        >
                            <SelectTrigger id="default_locale">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auto">Automático</SelectItem>
                                {localeCandidates.map((locale) => (
                                    <SelectItem key={locale} value={locale}>
                                        {locale}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.default_locale && (
                            <p className="text-destructive text-xs">
                                {normalizeError(errors.default_locale)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="fallback_locale">Locale fallback</Label>
                        <Select
                            value={data.fallback_locale}
                            onValueChange={(value) =>
                                onChange('fallback_locale', value)
                            }
                        >
                            <SelectTrigger id="fallback_locale">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {localeCandidates.map((locale) => (
                                    <SelectItem key={locale} value={locale}>
                                        {locale}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.fallback_locale && (
                            <p className="text-destructive text-xs">
                                {normalizeError(errors.fallback_locale)}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">SEO global</h2>
                    <p className="text-muted-foreground text-sm">
                        Templates e fallbacks globais para metadados.
                    </p>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="canonical_base_url">Canonical base URL</Label>
                    <Input
                        id="canonical_base_url"
                        value={data.canonical_base_url}
                        onChange={(event) =>
                            onChange('canonical_base_url', event.target.value)
                        }
                        placeholder="https://meusite.com"
                    />
                    {errors.canonical_base_url && (
                        <p className="text-destructive text-xs">
                            {normalizeError(errors.canonical_base_url)}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="meta_title_template">Template de title</Label>
                    <p className="text-muted-foreground text-xs">
                        Tags suportadas: {`{page_title}`}, {`{owner}`},{' '}
                        {`{site}`}, {`{locale}`}.
                    </p>
                    <Input
                        id="meta_title_template"
                        value={data.meta_title_template}
                        onChange={(event) =>
                            onChange('meta_title_template', event.target.value)
                        }
                        placeholder="{page_title} | {owner} | {site}"
                    />
                    {errors.meta_title_template && (
                        <p className="text-destructive text-xs">
                            {normalizeError(errors.meta_title_template)}
                        </p>
                    )}
                </div>

                <LocalizedField
                    id="default_meta_title"
                    label="Meta title padrão"
                    locales={localizedFieldLocales}
                    values={data.default_meta_title}
                    onChange={(locale, value) =>
                        handleLocaleMapChange('default_meta_title', locale, value)
                    }
                    errors={errors}
                    placeholder="Título padrão"
                />

                <LocalizedField
                    id="default_meta_description"
                    label="Meta description padrão"
                    locales={localizedFieldLocales}
                    values={data.default_meta_description}
                    onChange={(locale, value) =>
                        handleLocaleMapChange(
                            'default_meta_description',
                            locale,
                            value,
                        )
                    }
                    errors={errors}
                    placeholder="Descrição padrão"
                    type="textarea"
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="default_meta_image_id">Meta image ID</Label>
                        <Input
                            id="default_meta_image_id"
                            type="number"
                            min={1}
                            value={data.default_meta_image_id}
                            onChange={(event) =>
                                onChange(
                                    'default_meta_image_id',
                                    event.target.value === ''
                                        ? ''
                                        : Number(event.target.value),
                                )
                            }
                        />
                        {errors.default_meta_image_id && (
                            <p className="text-destructive text-xs">
                                {normalizeError(errors.default_meta_image_id)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="default_og_image_id">OG image ID</Label>
                        <Input
                            id="default_og_image_id"
                            type="number"
                            min={1}
                            value={data.default_og_image_id}
                            onChange={(event) =>
                                onChange(
                                    'default_og_image_id',
                                    event.target.value === ''
                                        ? ''
                                        : Number(event.target.value),
                                )
                            }
                        />
                        {errors.default_og_image_id && (
                            <p className="text-destructive text-xs">
                                {normalizeError(errors.default_og_image_id)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="default_twitter_image_id">
                            Twitter image ID
                        </Label>
                        <Input
                            id="default_twitter_image_id"
                            type="number"
                            min={1}
                            value={data.default_twitter_image_id}
                            onChange={(event) =>
                                onChange(
                                    'default_twitter_image_id',
                                    event.target.value === ''
                                        ? ''
                                        : Number(event.target.value),
                                )
                            }
                        />
                        {errors.default_twitter_image_id && (
                            <p className="text-destructive text-xs">
                                {normalizeError(errors.default_twitter_image_id)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3 rounded-md border p-4">
                        <div>
                            <h3 className="text-sm font-semibold">Robots público</h3>
                            <p className="text-muted-foreground text-xs">
                                Configuração global para páginas públicas.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="robots-public-index"
                                checked={data.robots.public.index}
                                onCheckedChange={(value) =>
                                    onChange('robots', {
                                        ...data.robots,
                                        public: {
                                            ...data.robots.public,
                                            index: Boolean(value),
                                        },
                                    })
                                }
                            />
                            <Label htmlFor="robots-public-index">Index</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="robots-public-follow"
                                checked={data.robots.public.follow}
                                onCheckedChange={(value) =>
                                    onChange('robots', {
                                        ...data.robots,
                                        public: {
                                            ...data.robots.public,
                                            follow: Boolean(value),
                                        },
                                    })
                                }
                            />
                            <Label htmlFor="robots-public-follow">Follow</Label>
                        </div>
                        {robotsPublicError && (
                            <p className="text-destructive text-xs">
                                {robotsPublicError}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 rounded-md border p-4">
                        <div>
                            <h3 className="text-sm font-semibold">Robots privado</h3>
                            <p className="text-muted-foreground text-xs">
                                Configuração global para páginas privadas.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="robots-private-index"
                                checked={data.robots.private.index}
                                onCheckedChange={(value) =>
                                    onChange('robots', {
                                        ...data.robots,
                                        private: {
                                            ...data.robots.private,
                                            index: Boolean(value),
                                        },
                                    })
                                }
                            />
                            <Label htmlFor="robots-private-index">Index</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="robots-private-follow"
                                checked={data.robots.private.follow}
                                onCheckedChange={(value) =>
                                    onChange('robots', {
                                        ...data.robots,
                                        private: {
                                            ...data.robots.private,
                                            follow: Boolean(value),
                                        },
                                    })
                                }
                            />
                            <Label htmlFor="robots-private-follow">Follow</Label>
                        </div>
                        {robotsPrivateError && (
                            <p className="text-destructive text-xs">
                                {robotsPrivateError}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Escopos</h2>
                    <p className="text-muted-foreground text-sm">
                        Habilite ou desabilite escopos globais.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-md border p-4">
                        <Checkbox
                            id="public_scope_enabled"
                            checked={data.public_scope_enabled}
                            onCheckedChange={(value) =>
                                onChange('public_scope_enabled', Boolean(value))
                            }
                        />
                        <Label htmlFor="public_scope_enabled">Escopo público</Label>
                    </div>
                    <div className="flex items-center gap-3 rounded-md border p-4">
                        <Checkbox
                            id="private_scope_enabled"
                            checked={data.private_scope_enabled}
                            onCheckedChange={(value) =>
                                onChange('private_scope_enabled', Boolean(value))
                            }
                        />
                        <Label htmlFor="private_scope_enabled">Escopo privado</Label>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Páginas do sistema</h2>
                    <p className="text-muted-foreground text-sm">
                        Slugs ou identificadores de páginas transversais.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="system_pages_not_found">404</Label>
                        <Input
                            id="system_pages_not_found"
                            value={data.system_pages.not_found ?? ''}
                            onChange={(event) =>
                                onChange('system_pages', {
                                    ...data.system_pages,
                                    not_found: event.target.value,
                                })
                            }
                            placeholder="slug-404"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="system_pages_maintenance">Manutenção</Label>
                        <Input
                            id="system_pages_maintenance"
                            value={data.system_pages.maintenance ?? ''}
                            onChange={(event) =>
                                onChange('system_pages', {
                                    ...data.system_pages,
                                    maintenance: event.target.value,
                                })
                            }
                            placeholder="slug-manutencao"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="system_pages_policies">Políticas</Label>
                        <Input
                            id="system_pages_policies"
                            value={data.system_pages.policies ?? ''}
                            onChange={(event) =>
                                onChange('system_pages', {
                                    ...data.system_pages,
                                    policies: event.target.value,
                                })
                            }
                            placeholder="slug-politicas"
                        />
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Links institucionais</h2>
                    <p className="text-muted-foreground text-sm">
                        Links globais usados no site inteiro.
                    </p>
                </div>

                <div className="space-y-4">
                    {data.institutional_links.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                            Nenhum link cadastrado.
                        </p>
                    )}
                    {data.institutional_links.map((link, index) => (
                        <div
                            key={`link-${index}`}
                            className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_2fr_auto]"
                        >
                            <div className="space-y-1.5">
                                <Label htmlFor={`link-label-${index}`}>Label</Label>
                                <Input
                                    id={`link-label-${index}`}
                                    value={link.label ?? ''}
                                    onChange={(event) =>
                                        handleLinkChange(
                                            index,
                                            'label',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Suporte"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`link-url-${index}`}>URL</Label>
                                <Input
                                    id={`link-url-${index}`}
                                    value={link.url ?? ''}
                                    onChange={(event) =>
                                        handleLinkChange(
                                            index,
                                            'url',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="https://meusite.com/suporte"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleRemoveLink(index)}
                                >
                                    Remover
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={handleAddLink}>
                        Adicionar link
                    </Button>
                </div>
            </section>

            <div className="flex items-center justify-end gap-3">
                <Link
                    href={cancelHref}
                    className="text-muted-foreground hover:text-foreground text-sm"
                >
                    Cancelar
                </Link>
                <Button type="submit" disabled={processing}>
                    Salvar alterações
                </Button>
            </div>
        </form>
    );
}
