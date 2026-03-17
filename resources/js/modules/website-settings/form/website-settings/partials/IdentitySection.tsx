import { TextInputField, type FormErrors } from '@/common/forms';
import type { WebsiteSettingsFormData } from '@/modules/website-settings/forms';
import {
  WEBSITE_SETTINGS_NAMESPACES,
  useWebsiteSettingsTranslation,
} from '@/modules/website-settings/i18n';

import { LocalizedField } from './LocalizedField';

interface IdentitySectionProps {
  data: WebsiteSettingsFormData;
  errors: FormErrors;
  locales: string[];
  onLocaleMapChange(
    field: 'site_name' | 'site_description',
    locale: string,
    value: string,
  ): void;
  onOwnerNameChange(value: string): void;
}

export function IdentitySection({
  data,
  errors,
  locales,
  onLocaleMapChange,
  onOwnerNameChange,
}: IdentitySectionProps) {
  const { translate: tForm } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.form,
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{tForm('sections.identity.title')}</h2>
        <p className="text-muted-foreground text-sm">
          {tForm('sections.identity.description')}
        </p>
      </div>

      {locales.length === 0 && (
        <p className="text-muted-foreground text-sm">
          {tForm('sections.identity.emptyLocales')}
        </p>
      )}

      <LocalizedField
        id="site_name"
        label={tForm('fields.site_name.label')}
        locales={locales}
        values={data.site_name}
        onChange={(locale, value) =>
          onLocaleMapChange('site_name', locale, value)
        }
        errors={errors}
        placeholder={tForm('fields.site_name.placeholder')}
      />

      <LocalizedField
        id="site_description"
        label={tForm('fields.site_description.label')}
        locales={locales}
        values={data.site_description}
        onChange={(locale, value) =>
          onLocaleMapChange('site_description', locale, value)
        }
        errors={errors}
        placeholder={tForm('fields.site_description.placeholder')}
        type="textarea"
      />

      <TextInputField
        name="owner_name"
        id="owner_name"
        value={data.owner_name}
        errors={errors}
        label={tForm('fields.owner_name.label')}
        placeholder={tForm('fields.owner_name.placeholder')}
        onChange={onOwnerNameChange}
      />
    </section>
  );
}
