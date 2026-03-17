import { Button } from '@/components/ui/button';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

type DialogStep = 'select' | 'configure';

interface CreateSectionFooterProps {
  step: DialogStep;
  canContinue: boolean;
  onClose: () => void;
  onContinue: () => void;
  onChangeTemplate: () => void;
  onConfirm: () => void;
}

export function CreateSectionFooter({
  step,
  canContinue,
  onClose,
  onContinue,
  onChangeTemplate,
  onConfirm,
}: CreateSectionFooterProps) {
  const { translate: tActions } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.actions,
  );
  if (step === 'select') {
    return (
      <>
        <Button type="button" variant="outline" onClick={onClose}>
          {tActions('cancel', 'Cancel')}
        </Button>
        <Button type="button" onClick={onContinue} disabled={!canContinue}>
          {tActions('continue', 'Continue')}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={onChangeTemplate}>
        {tActions('changeTemplate', 'Change template')}
      </Button>
      <Button type="button" onClick={onConfirm} disabled={!canContinue}>
        {tActions('createSection', 'Create section')}
      </Button>
    </>
  );
}
