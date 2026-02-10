import { Button } from '@/Components/Ui/button';

interface CollectionHeaderProps {
  label: string;
  onAdd: () => void;
}

export function CollectionHeader({ label, onAdd }: CollectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{label}</div>
      <Button type="button" onClick={onAdd} size="sm" variant="outline">
        Add item
      </Button>
    </div>
  );
}
