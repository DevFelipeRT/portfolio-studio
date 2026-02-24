import { FormField, type FormErrors } from '@/common/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        <FormField
          name="default_locale"
          errors={errors}
          htmlFor="default_locale"
          label="Locale padrão"
        >
          {({ a11yAttributes, getSelectClassName }) => (
            <Select value={defaultLocale} onValueChange={onDefaultLocaleChange}>
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
            <Select value={fallbackLocale} onValueChange={onFallbackLocaleChange}>
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
  );
}

