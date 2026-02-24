import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { WebsiteSettingsSystemPages } from '@/modules/website-settings/core/types';

interface SystemPagesSectionProps {
  errors: FormErrors;
  pages: WebsiteSettingsSystemPages;
  onChange(pages: WebsiteSettingsSystemPages): void;
}

export function SystemPagesSection({ errors, pages, onChange }: SystemPagesSectionProps) {
  return (
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
              value={pages.not_found ?? ''}
              onChange={(event) =>
                onChange({
                  ...pages,
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
              value={pages.maintenance ?? ''}
              onChange={(event) =>
                onChange({
                  ...pages,
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
              value={pages.policies ?? ''}
              onChange={(event) =>
                onChange({
                  ...pages,
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
  );
}

