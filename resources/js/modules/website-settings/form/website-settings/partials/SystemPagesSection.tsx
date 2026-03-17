import { TextInputField, type FormErrors } from '@/common/forms';
import {
  WEBSITE_SETTINGS_NAMESPACES,
  useWebsiteSettingsTranslation,
} from '@/modules/website-settings/i18n';
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
  const { translate: tForm } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.form,
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {tForm('sections.systemPages.title')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {tForm('sections.systemPages.description')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TextInputField
          name="system_pages.not_found"
          id="system_pages_not_found"
          value={pages.not_found ?? ''}
          errors={errors}
          label={tForm('fields.system_pages_not_found.label')}
          placeholder={tForm('fields.system_pages_not_found.placeholder')}
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
          label={tForm('fields.system_pages_maintenance.label')}
          placeholder={tForm('fields.system_pages_maintenance.placeholder')}
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
          label={tForm('fields.system_pages_policies.label')}
          placeholder={tForm('fields.system_pages_policies.placeholder')}
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
