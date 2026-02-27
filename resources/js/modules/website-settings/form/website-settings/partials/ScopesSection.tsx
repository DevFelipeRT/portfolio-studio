import { CheckboxField, type FormErrors } from '@/common/forms';

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
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Escopos</h2>
        <p className="text-muted-foreground text-sm">
          Habilite ou desabilite escopos globais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CheckboxField
          name="public_scope_enabled"
          id="public_scope_enabled"
          value={publicEnabled}
          errors={errors}
          label="Escopo público"
          className="flex items-center gap-3 rounded-md border p-4"
          onChange={onPublicEnabledChange}
        />
        <CheckboxField
          name="private_scope_enabled"
          id="private_scope_enabled"
          value={privateEnabled}
          errors={errors}
          label="Escopo privado"
          className="flex items-center gap-3 rounded-md border p-4"
          onChange={onPrivateEnabledChange}
        />
      </div>
    </section>
  );
}
