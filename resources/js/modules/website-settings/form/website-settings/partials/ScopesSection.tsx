import { CheckboxField, type FormErrors } from '@/common/forms';
import {
  WEBSITE_SETTINGS_NAMESPACES,
  useWebsiteSettingsTranslation,
} from '@/modules/website-settings/i18n';

interface ScopesSectionProps {
  errors: FormErrors;
  publicEnabled: boolean;
  privateEnabled: boolean;
  onPublicEnabledChange(value: boolean): void;
  onPrivateEnabledChange(value: boolean): void;
}

export function ScopesSection({
  errors,
  publicEnabled,
  privateEnabled,
  onPublicEnabledChange,
  onPrivateEnabledChange,
}: ScopesSectionProps) {
  const { translate: tForm } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.form,
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{tForm('sections.scopes.title')}</h2>
        <p className="text-muted-foreground text-sm">
          {tForm('sections.scopes.description')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CheckboxField
          name="public_scope_enabled"
          id="public_scope_enabled"
          value={publicEnabled}
          errors={errors}
          label={tForm('fields.public_scope_enabled.label')}
          className="flex items-center gap-3 rounded-md border p-4"
          onChange={onPublicEnabledChange}
        />
        <CheckboxField
          name="private_scope_enabled"
          id="private_scope_enabled"
          value={privateEnabled}
          errors={errors}
          label={tForm('fields.private_scope_enabled.label')}
          className="flex items-center gap-3 rounded-md border p-4"
          onChange={onPrivateEnabledChange}
        />
      </div>
    </section>
  );
}
