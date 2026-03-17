import { Button } from '@/components/ui/button';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

interface CollectionHeaderProps {
  label: string;
  onAdd: () => void;
}

export function CollectionHeader({ label, onAdd }: CollectionHeaderProps) {
  const { translate: tActions } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.actions,
  );

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{label}</div>
      <Button type="button" onClick={onAdd} size="sm" variant="outline">
        {tActions('addItem', 'Add item')}
      </Button>
    </div>
  );
}
