import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

interface ActiveToggleProps {
  idPrefix: string;
  isActive: boolean;
  onIsActiveChange: (value: boolean) => void;
}

export function ActiveToggle({
  idPrefix,
  isActive,
  onIsActiveChange,
}: ActiveToggleProps) {
  const { translate: tSections } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.sections,
  );
  const id = `${idPrefix}-is-active`;

  return (
    <div className="bg-muted/40 flex items-start gap-2 rounded-md border px-3 py-2">
      <Checkbox
        id={id}
        checked={isActive}
        onCheckedChange={(checked) => onIsActiveChange(Boolean(checked))}
      />
      <div className="space-y-0.5">
        <Label htmlFor={id}>{tSections('fields.active', 'Active')}</Label>
        <p className="text-muted-foreground text-xs">
          {tSections(
            'fields.activeHelp',
            'When disabled, the section stays hidden.',
          )}
        </p>
      </div>
    </div>
  );
}
