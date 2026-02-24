import { FormField, type FormErrors } from '@/common/forms';
import { Checkbox } from '@/components/ui/checkbox';

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
        <FormField
          name="public_scope_enabled"
          errors={errors}
          htmlFor="public_scope_enabled"
          label="Escopo público"
          variant="inline"
          className="flex items-center gap-3 rounded-md border p-4"
        >
          <Checkbox
            id="public_scope_enabled"
            checked={publicEnabled}
            onCheckedChange={(value) => onPublicEnabledChange(Boolean(value))}
          />
        </FormField>
        <FormField
          name="private_scope_enabled"
          errors={errors}
          htmlFor="private_scope_enabled"
          label="Escopo privado"
          variant="inline"
          className="flex items-center gap-3 rounded-md border p-4"
        >
          <Checkbox
            id="private_scope_enabled"
            checked={privateEnabled}
            onCheckedChange={(value) => onPrivateEnabledChange(Boolean(value))}
          />
        </FormField>
      </div>
    </section>
  );
}

