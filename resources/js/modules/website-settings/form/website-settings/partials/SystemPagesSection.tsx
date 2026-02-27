import { TextInputField, type FormErrors } from '@/common/forms';
import type { WebsiteSettingsSystemPages } from '@/modules/website-settings/types';

interface SystemPagesSectionProps {
  errors: FormErrors;
  pages: WebsiteSettingsSystemPages;
  onChange(pages: WebsiteSettingsSystemPages): void;
}

export function SystemPagesSection({
  errors,
  pages,
  onChange,
}: SystemPagesSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Páginas do sistema</h2>
        <p className="text-muted-foreground text-sm">
          Slugs ou identificadores de páginas transversais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TextInputField
          name="system_pages.not_found"
          id="system_pages_not_found"
          value={pages.not_found ?? ''}
          errors={errors}
          label="404"
          placeholder="slug-404"
          onChange={(value) =>
            onChange({
              ...pages,
              not_found: value,
            })
          }
        />
        <TextInputField
          name="system_pages.maintenance"
          id="system_pages_maintenance"
          value={pages.maintenance ?? ''}
          errors={errors}
          label="Manutenção"
          placeholder="slug-manutencao"
          onChange={(value) =>
            onChange({
              ...pages,
              maintenance: value,
            })
          }
        />
        <TextInputField
          name="system_pages.policies"
          id="system_pages_policies"
          value={pages.policies ?? ''}
          errors={errors}
          label="Políticas"
          placeholder="slug-politicas"
          onChange={(value) =>
            onChange({
              ...pages,
              policies: value,
            })
          }
        />
      </div>
    </section>
  );
}
