import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    collectErroredFieldLabels,
    FormErrorSummary,
    FormField,
    type FormErrors,
} from '@/common/forms';
import type { WebsiteSettingsFormData } from '@/modules/website-settings/core/forms';
import React from 'react';
import { Link } from '@inertiajs/react';

type LocalizedFieldType = 'input' | 'textarea';

interface LocalizedFieldProps {
    id: string;
    label: string;
    locales: string[];
    values: Record<string, string>;
    onChange(locale: string, value: string): void;
    errors: FormErrors;
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
    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <div className="text-sm leading-none font-medium">{label}</div>
                {description && (
                    <p className="text-muted-foreground text-xs">{description}</p>
                )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                {locales.map((locale) => {
                    const fieldId = `${id}-${locale}`;

                    return (
                        <FormField
                            key={fieldId}
                            name={`${id}.${locale}`}
                            errors={errors}
                            htmlFor={fieldId}
                            label={<span className="text-xs uppercase">{locale}</span>}
                            errorId={`${fieldId}-error`}
                        >
                            {({ a11yAttributes, getInputClassName }) =>
                                type === 'textarea' ? (
                                    <Textarea
                                        id={fieldId}
                                        value={values[locale] ?? ''}
                                        onChange={(event) =>
                                            onChange(locale, event.target.value)
                                        }
                                        placeholder={placeholder}
                                        rows={3}
                                        className={getInputClassName()}
                                        {...a11yAttributes}
                                    />
                                ) : (
                                    <Input
                                        id={fieldId}
                                        value={values[locale] ?? ''}
                                        onChange={(event) =>
                                            onChange(locale, event.target.value)
                                        }
                                        placeholder={placeholder}
                                        className={getInputClassName()}
                                        {...a11yAttributes}
                                    />
                                )
                            }
                        </FormField>
                    );
                })}
            </div>
        </div>
    );
}

interface WebsiteSettingsFormProps {
    data: WebsiteSettingsFormData;
    errors: FormErrors;
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
    const summaryFields = collectErroredFieldLabels(errors, [
        { name: 'site_name', label: 'Nome do site' },
        { name: 'site_description', label: 'Descrição do site' },
        { name: 'owner_name', label: 'Responsável / Owner' },
        { name: 'default_locale', label: 'Locale padrão' },
        { name: 'fallback_locale', label: 'Locale fallback' },
        { name: 'canonical_base_url', label: 'Canonical base URL' },
        { name: 'meta_title_template', label: 'Template de meta title' },
        { name: 'default_meta_title', label: 'Meta title padrão' },
        { name: 'default_meta_description', label: 'Meta description padrão' },
        { name: 'default_meta_image_id', label: 'Meta image ID' },
        { name: 'default_og_image_id', label: 'OG image ID' },
        { name: 'default_twitter_image_id', label: 'Twitter image ID' },
        { name: 'robots', label: 'Robots' },
        { name: 'system_pages', label: 'Páginas do sistema' },
        { name: 'institutional_links', label: 'Links institucionais' },
        { name: 'public_scope_enabled', label: 'Escopo público' },
        { name: 'private_scope_enabled', label: 'Escopo privado' },
    ] as const);

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

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card space-y-10 rounded-lg border p-6 shadow-sm"
        >
            <FormErrorSummary fields={summaryFields} />
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

                <FormField
                    name="owner_name"
                    errors={errors}
                    htmlFor="owner_name"
                    label="Responsável / Owner"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <Input
                            id="owner_name"
                            value={data.owner_name}
                            onChange={(event) =>
                                onChange('owner_name', event.target.value)
                            }
                            placeholder="Nome do responsável"
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>
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
                    <FormField
                        name="default_locale"
                        errors={errors}
                        htmlFor="default_locale"
                        label="Locale padrão"
                    >
                        {({ a11yAttributes, getSelectClassName }) => (
                            <Select
                                value={data.default_locale}
                                onValueChange={(value) =>
                                    onChange('default_locale', value)
                                }
                            >
                                <SelectTrigger
                                    id="default_locale"
                                    className={getSelectClassName()}
                                    {...a11yAttributes}
                                >
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
                        )}
                    </FormField>

                    <FormField
                        name="fallback_locale"
                        errors={errors}
                        htmlFor="fallback_locale"
                        label="Locale fallback"
                    >
                        {({ a11yAttributes, getSelectClassName }) => (
                            <Select
                                value={data.fallback_locale}
                                onValueChange={(value) =>
                                    onChange('fallback_locale', value)
                                }
                            >
                                <SelectTrigger
                                    id="fallback_locale"
                                    className={getSelectClassName()}
                                    {...a11yAttributes}
                                >
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
                        )}
                    </FormField>
                </div>
            </section>

            <section className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">SEO global</h2>
                    <p className="text-muted-foreground text-sm">
                        Templates e fallbacks globais para metadados.
                    </p>
                </div>

                <FormField
                    name="canonical_base_url"
                    errors={errors}
                    htmlFor="canonical_base_url"
                    label="Canonical base URL"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <Input
                            id="canonical_base_url"
                            value={data.canonical_base_url}
                            onChange={(event) =>
                                onChange(
                                    'canonical_base_url',
                                    event.target.value,
                                )
                            }
                            placeholder="https://meusite.com"
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>

                <FormField
                    name="meta_title_template"
                    errors={errors}
                    htmlFor="meta_title_template"
                    label="Template de title"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <div className="space-y-1.5">
                            <p className="text-muted-foreground text-xs">
                                Tags suportadas: {`{page_title}`}, {`{owner}`},{' '}
                                {`{site}`}, {`{locale}`}.
                            </p>
                            <Input
                                id="meta_title_template"
                                value={data.meta_title_template}
                                onChange={(event) =>
                                    onChange(
                                        'meta_title_template',
                                        event.target.value,
                                    )
                                }
                                placeholder="{page_title} | {owner} | {site}"
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        </div>
                    )}
                </FormField>

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
                    <FormField
                        name="default_meta_image_id"
                        errors={errors}
                        htmlFor="default_meta_image_id"
                        label="Meta image ID"
                    >
                        {({ a11yAttributes, getInputClassName }) => (
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
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        )}
                    </FormField>

                    <FormField
                        name="default_og_image_id"
                        errors={errors}
                        htmlFor="default_og_image_id"
                        label="OG image ID"
                    >
                        {({ a11yAttributes, getInputClassName }) => (
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
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        )}
                    </FormField>

                    <FormField
                        name="default_twitter_image_id"
                        errors={errors}
                        htmlFor="default_twitter_image_id"
                        label="Twitter image ID"
                    >
                        {({ a11yAttributes, getInputClassName }) => (
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
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        )}
                    </FormField>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        name="robots.public.index"
                        errors={errors}
                        htmlFor="robots-public-index"
                        label="Robots público"
                        errorId="robots-public-index-error"
                        className="space-y-3 rounded-md border p-4"
                    >
                        {({ a11yAttributes }) => (
                            <div {...a11yAttributes}>
                                <p className="text-muted-foreground text-xs">
                                    Configuração global para páginas públicas.
                                </p>
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
                                    <span className="text-sm leading-none font-medium">
                                        Index
                                    </span>
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
                                    <span className="text-sm leading-none font-medium">
                                        Follow
                                    </span>
                                </div>
                            </div>
                        )}
                    </FormField>

                    <FormField
                        name="robots.private.index"
                        errors={errors}
                        htmlFor="robots-private-index"
                        label="Robots privado"
                        errorId="robots-private-index-error"
                        className="space-y-3 rounded-md border p-4"
                    >
                        {({ a11yAttributes }) => (
                            <div {...a11yAttributes}>
                                <p className="text-muted-foreground text-xs">
                                    Configuração global para páginas privadas.
                                </p>
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
                                    <span className="text-sm leading-none font-medium">
                                        Index
                                    </span>
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
                                    <span className="text-sm leading-none font-medium">
                                        Follow
                                    </span>
                                </div>
                            </div>
                        )}
                    </FormField>
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
                    <FormField
                        name="public_scope_enabled"
                        errors={errors}
                        htmlFor="public_scope_enabled"
                        label="Escopo público"
                        variant="inline"
                        className="flex items-center gap-3 rounded-md border p-4"
                    >
                        <Checkbox
                            id="public_scope_enabled"
                            checked={data.public_scope_enabled}
                            onCheckedChange={(value) =>
                                onChange('public_scope_enabled', Boolean(value))
                            }
                        />
                    </FormField>
                    <FormField
                        name="private_scope_enabled"
                        errors={errors}
                        htmlFor="private_scope_enabled"
                        label="Escopo privado"
                        variant="inline"
                        className="flex items-center gap-3 rounded-md border p-4"
                    >
                        <Checkbox
                            id="private_scope_enabled"
                            checked={data.private_scope_enabled}
                            onCheckedChange={(value) =>
                                onChange('private_scope_enabled', Boolean(value))
                            }
                        />
                    </FormField>
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
                    <FormField
                        name="system_pages.not_found"
                        errors={errors}
                        htmlFor="system_pages_not_found"
                        label="404"
                    >
                        {({ a11yAttributes, getInputClassName }) => (
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
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        )}
                    </FormField>
                    <FormField
                        name="system_pages.maintenance"
                        errors={errors}
                        htmlFor="system_pages_maintenance"
                        label="Manutenção"
                    >
                        {({ a11yAttributes, getInputClassName }) => (
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
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        )}
                    </FormField>
                    <FormField
                        name="system_pages.policies"
                        errors={errors}
                        htmlFor="system_pages_policies"
                        label="Políticas"
                    >
                        {({ a11yAttributes, getInputClassName }) => (
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
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        )}
                    </FormField>
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
                            <FormField
                                name={`institutional_links.${index}.label`}
                                errors={errors}
                                htmlFor={`link-label-${index}`}
                                label="Label"
                            >
                                {({ a11yAttributes, getInputClassName }) => (
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
                                        className={getInputClassName()}
                                        {...a11yAttributes}
                                    />
                                )}
                            </FormField>
                            <FormField
                                name={`institutional_links.${index}.url`}
                                errors={errors}
                                htmlFor={`link-url-${index}`}
                                label="URL"
                            >
                                {({ a11yAttributes, getInputClassName }) => (
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
                                        className={getInputClassName()}
                                        {...a11yAttributes}
                                    />
                                )}
                            </FormField>
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
