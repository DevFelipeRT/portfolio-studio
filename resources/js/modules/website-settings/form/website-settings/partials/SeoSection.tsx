import { CheckboxField, TextInputField, type FormErrors } from '@/common/forms';
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

      <TextInputField
        name="canonical_base_url"
        id="canonical_base_url"
        value={data.canonical_base_url}
        errors={errors}
        label="Canonical base URL"
        placeholder="https://meusite.com"
        onChange={(value) => onChange('canonical_base_url', value)}
      />

      <TextInputField
        name="meta_title_template"
        id="meta_title_template"
        value={data.meta_title_template}
        errors={errors}
        label="Template de title"
        hint={
          <>
            Tags suportadas: <code>{'{page_title}'}</code>,{' '}
            <code>{'{owner}'}</code>, <code>{'{site}'}</code>,{' '}
            <code>{'{locale}'}</code>.
          </>
        }
        placeholder="{page_title} | {owner} | {site}"
        onChange={(value) => onChange('meta_title_template', value)}
      />

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
        <TextInputField
          name="default_meta_image_id"
          id="default_meta_image_id"
          value={data.default_meta_image_id}
          errors={errors}
          label="Meta image ID"
          type="number"
          min={1}
          onChange={(value) =>
            onChange('default_meta_image_id', value === '' ? '' : Number(value))
          }
        />

        <TextInputField
          name="default_og_image_id"
          id="default_og_image_id"
          value={data.default_og_image_id}
          errors={errors}
          label="OG image ID"
          type="number"
          min={1}
          onChange={(value) =>
            onChange('default_og_image_id', value === '' ? '' : Number(value))
          }
        />

        <TextInputField
          name="default_twitter_image_id"
          id="default_twitter_image_id"
          value={data.default_twitter_image_id}
          errors={errors}
          label="Twitter image ID"
          type="number"
          min={1}
          onChange={(value) =>
            onChange(
              'default_twitter_image_id',
              value === '' ? '' : Number(value),
            )
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CheckboxField
          name="robots.public"
          errors={errors}
          label="Robots público"
          hint="Configuração global para páginas públicas."
          className="space-y-3 rounded-md border p-4"
          items={[
            {
              id: 'robots-public-index',
              label: 'Index',
              value: data.robots.public.index,
              onChange: (value) =>
                onChange('robots', {
                  ...data.robots,
                  public: {
                    ...data.robots.public,
                    index: value,
                  },
                }),
            },
            {
              id: 'robots-public-follow',
              label: 'Follow',
              value: data.robots.public.follow,
              onChange: (value) =>
                onChange('robots', {
                  ...data.robots,
                  public: {
                    ...data.robots.public,
                    follow: value,
                  },
                }),
            },
          ]}
        />

        <CheckboxField
          name="robots.private"
          errors={errors}
          label="Robots privado"
          hint="Configuração global para páginas privadas."
          className="space-y-3 rounded-md border p-4"
          items={[
            {
              id: 'robots-private-index',
              label: 'Index',
              value: data.robots.private.index,
              onChange: (value) =>
                onChange('robots', {
                  ...data.robots,
                  private: {
                    ...data.robots.private,
                    index: value,
                  },
                }),
            },
            {
              id: 'robots-private-follow',
              label: 'Follow',
              value: data.robots.private.follow,
              onChange: (value) =>
                onChange('robots', {
                  ...data.robots,
                  private: {
                    ...data.robots.private,
                    follow: value,
                  },
                }),
            },
          ]}
        />
      </div>
    </section>
  );
}
