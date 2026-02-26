import { FormField, type FormErrors } from '@/common/forms';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { WebsiteSettingsFormData } from '@/modules/website-settings/forms';

import { LocalizedField } from './LocalizedField';

interface SeoSectionProps {
  data: WebsiteSettingsFormData;
  errors: FormErrors;
  locales: string[];
  onLocaleMapChange(
    field: 'default_meta_title' | 'default_meta_description',
    locale: string,
    value: string,
  ): void;
  onChange(field: keyof WebsiteSettingsFormData, value: unknown): void;
}

export function SeoSection({
  data,
  errors,
  locales,
  onLocaleMapChange,
  onChange,
}: SeoSectionProps) {
  return (
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
              onChange('canonical_base_url', event.target.value)
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
              Tags suportadas: {`{page_title}`}, {`{owner}`}, {`{site}`},{' '}
              {`{locale}`}.
            </p>
            <Input
              id="meta_title_template"
              value={data.meta_title_template}
              onChange={(event) =>
                onChange('meta_title_template', event.target.value)
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
        locales={locales}
        values={data.default_meta_title}
        onChange={(locale, value) =>
          onLocaleMapChange('default_meta_title', locale, value)
        }
        errors={errors}
        placeholder="Título padrão"
      />

      <LocalizedField
        id="default_meta_description"
        label="Meta description padrão"
        locales={locales}
        values={data.default_meta_description}
        onChange={(locale, value) =>
          onLocaleMapChange('default_meta_description', locale, value)
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
                  event.target.value === '' ? '' : Number(event.target.value),
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
                  event.target.value === '' ? '' : Number(event.target.value),
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
                  event.target.value === '' ? '' : Number(event.target.value),
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
                <span className="text-sm leading-none font-medium">Index</span>
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
                <span className="text-sm leading-none font-medium">Follow</span>
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
                <span className="text-sm leading-none font-medium">Index</span>
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
                <span className="text-sm leading-none font-medium">Follow</span>
              </div>
            </div>
          )}
        </FormField>
      </div>
    </section>
  );
}
