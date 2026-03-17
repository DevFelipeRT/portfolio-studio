import { CheckboxField, TextInputField, type FormErrors } from '@/common/forms';
import type { WebsiteSettingsFormData } from '@/modules/website-settings/forms';
import {
  WEBSITE_SETTINGS_NAMESPACES,
  useWebsiteSettingsTranslation,
} from '@/modules/website-settings/i18n';

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
  const { translate: tForm } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.form,
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{tForm('sections.seo.title')}</h2>
        <p className="text-muted-foreground text-sm">
          {tForm('sections.seo.description')}
        </p>
      </div>

      <TextInputField
        name="canonical_base_url"
        id="canonical_base_url"
        value={data.canonical_base_url}
        errors={errors}
        label={tForm('fields.canonical_base_url.label')}
        placeholder={tForm('fields.canonical_base_url.placeholder')}
        onChange={(value) => onChange('canonical_base_url', value)}
      />

      <TextInputField
        name="meta_title_template"
        id="meta_title_template"
        value={data.meta_title_template}
        errors={errors}
        label={tForm('fields.meta_title_template.label')}
        hint={
          tForm('sections.seo.metaTitleHint', {
            pageTitleTag: '{page_title}',
            ownerTag: '{owner}',
            siteTag: '{site}',
            localeTag: '{locale}',
          })
        }
        placeholder={tForm('fields.meta_title_template.placeholder')}
        onChange={(value) => onChange('meta_title_template', value)}
      />

      <LocalizedField
        id="default_meta_title"
        label={tForm('fields.default_meta_title.label')}
        locales={locales}
        values={data.default_meta_title}
        onChange={(locale, value) =>
          onLocaleMapChange('default_meta_title', locale, value)
        }
        errors={errors}
        placeholder={tForm('fields.default_meta_title.placeholder')}
      />

      <LocalizedField
        id="default_meta_description"
        label={tForm('fields.default_meta_description.label')}
        locales={locales}
        values={data.default_meta_description}
        onChange={(locale, value) =>
          onLocaleMapChange('default_meta_description', locale, value)
        }
        errors={errors}
        placeholder={tForm('fields.default_meta_description.placeholder')}
        type="textarea"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <TextInputField
          name="default_meta_image_id"
          id="default_meta_image_id"
          value={data.default_meta_image_id}
          errors={errors}
          label={tForm('fields.default_meta_image_id.label')}
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
          label={tForm('fields.default_og_image_id.label')}
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
          label={tForm('fields.default_twitter_image_id.label')}
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
          label={tForm('fields.robots_public.label')}
          hint={tForm('fields.robots_public.hint')}
          className="space-y-3 rounded-md border p-4"
          items={[
            {
              id: 'robots-public-index',
              label: tForm('fields.robots_index.label'),
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
              label: tForm('fields.robots_follow.label'),
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
          label={tForm('fields.robots_private.label')}
          hint={tForm('fields.robots_private.hint')}
          className="space-y-3 rounded-md border p-4"
          items={[
            {
              id: 'robots-private-index',
              label: tForm('fields.robots_index.label'),
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
              label: tForm('fields.robots_follow.label'),
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
