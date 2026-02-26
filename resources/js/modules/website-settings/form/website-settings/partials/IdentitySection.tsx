import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { WebsiteSettingsFormData } from '@/modules/website-settings/forms';

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
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Identidade do site</h2>
        <p className="text-muted-foreground text-sm">
          Informações públicas e responsáveis pelo branding global.
        </p>
      </div>

      {locales.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Nenhum locale encontrado no CMS. Crie uma página pública para
          habilitar campos localizados.
        </p>
      )}

      <LocalizedField
        id="site_name"
        label="Nome do site"
        locales={locales}
        values={data.site_name}
        onChange={(locale, value) =>
          onLocaleMapChange('site_name', locale, value)
        }
        errors={errors}
        placeholder="Nome do site"
      />

      <LocalizedField
        id="site_description"
        label="Descrição do site"
        locales={locales}
        values={data.site_description}
        onChange={(locale, value) =>
          onLocaleMapChange('site_description', locale, value)
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
            onChange={(event) => onOwnerNameChange(event.target.value)}
            placeholder="Nome do responsável"
            className={getInputClassName()}
            {...a11yAttributes}
          />
        )}
      </FormField>
    </section>
  );
}
