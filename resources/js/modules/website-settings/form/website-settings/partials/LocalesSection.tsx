import { SelectField, type FormErrors } from '@/common/forms';
import {
  WEBSITE_SETTINGS_NAMESPACES,
  useWebsiteSettingsTranslation,
} from '@/modules/website-settings/i18n';

interface LocalesSectionProps {
  errors: FormErrors;
  defaultLocale: string;
  fallbackLocale: string;
  localeCandidates: string[];
  onDefaultLocaleChange(value: string): void;
  onFallbackLocaleChange(value: string): void;
}

export function LocalesSection({
  errors,
  defaultLocale,
  fallbackLocale,
  localeCandidates,
  onDefaultLocaleChange,
  onFallbackLocaleChange,
}: LocalesSectionProps) {
  const { translate: tForm } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.form,
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{tForm('sections.locales.title')}</h2>
        <p className="text-muted-foreground text-sm">
          {tForm('sections.locales.description')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          name="default_locale"
          id="default_locale"
          value={defaultLocale}
          errors={errors}
          label={tForm('fields.default_locale.label')}
          placeholder={tForm('fields.default_locale.placeholder')}
          options={[
            { value: 'auto', label: tForm('options.auto') },
            ...localeCandidates.map((locale) => ({
              value: locale,
              label: locale,
            })),
          ]}
          onChange={onDefaultLocaleChange}
        />

        <SelectField
          name="fallback_locale"
          id="fallback_locale"
          value={fallbackLocale}
          errors={errors}
          label={tForm('fields.fallback_locale.label')}
          placeholder={tForm('fields.fallback_locale.placeholder')}
          options={localeCandidates.map((locale) => ({
            value: locale,
            label: locale,
          }))}
          onChange={onFallbackLocaleChange}
        />
      </div>
    </section>
  );
}
