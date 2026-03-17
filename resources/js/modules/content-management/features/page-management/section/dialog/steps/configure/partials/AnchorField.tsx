import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

interface AnchorFieldProps {
  idPrefix: string;
  anchor: string;
  onAnchorChange: (value: string) => void;
}

export function AnchorField({
  idPrefix,
  anchor,
  onAnchorChange,
}: AnchorFieldProps) {
  const { translate: tSections } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.sections,
  );
  const id = `${idPrefix}-anchor`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{tSections('fields.anchor', 'Anchor')}</Label>
      <Input
        id={id}
        value={anchor}
        onChange={(event) => onAnchorChange(event.target.value)}
        placeholder={tSections(
          'fields.anchorPlaceholder',
          'about, contact',
        )}
      />
    </div>
  );
}
