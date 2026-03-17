import { Button } from '@/components/ui/button';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

interface EditSectionFooterProps {
  canSave: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function EditSectionFooter({
  canSave,
  onClose,
  onConfirm,
}: EditSectionFooterProps) {
  const { translate: tActions } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.actions,
  );
  return (
    <>
      <Button type="button" variant="outline" onClick={onClose}>
        {tActions('cancel', 'Cancel')}
      </Button>
      <Button type="button" onClick={onConfirm} disabled={!canSave}>
        {tActions('saveSection', 'Save section')}
      </Button>
    </>
  );
}
