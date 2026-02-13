import { Button } from '@/components/ui/button';

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
  return (
    <>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" onClick={onConfirm} disabled={!canSave}>
        Save section
      </Button>
    </>
  );
}
