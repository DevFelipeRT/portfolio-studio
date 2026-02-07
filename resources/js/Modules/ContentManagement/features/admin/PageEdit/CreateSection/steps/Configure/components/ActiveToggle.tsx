import { Checkbox } from '@/Components/Ui/checkbox';
import { Label } from '@/Components/Ui/label';

interface ActiveToggleProps {
  isActive: boolean;
  onIsActiveChange: (value: boolean) => void;
}

export function ActiveToggle({
  isActive,
  onIsActiveChange,
}: ActiveToggleProps) {
  return (
    <div className="bg-muted/40 flex items-start gap-2 rounded-md border px-3 py-2">
      <Checkbox
        id="section-is-active"
        checked={isActive}
        onCheckedChange={(checked) => onIsActiveChange(Boolean(checked))}
      />
      <div className="space-y-0.5">
        <Label htmlFor="section-is-active">Active</Label>
        <p className="text-muted-foreground text-xs">
          When disabled, the section stays hidden.
        </p>
      </div>
    </div>
  );
}
