import { SelectField, type FormErrors } from '@/common/forms';

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
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Locales</h2>
        <p className="text-muted-foreground text-sm">
          Define o locale padrão (fixo ou automático) e o fallback usado quando
          não há conteúdo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          name="default_locale"
          id="default_locale"
          value={defaultLocale}
          errors={errors}
          label="Locale padrão"
          placeholder="Selecione"
          options={[
            { value: 'auto', label: 'Automático' },
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
          label="Locale fallback"
          placeholder="Selecione"
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
