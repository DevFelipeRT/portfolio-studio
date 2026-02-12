import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';

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
  const id = `${idPrefix}-anchor`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Anchor</Label>
      <Input
        id={id}
        value={anchor}
        onChange={(event) => onAnchorChange(event.target.value)}
        placeholder="about, contact"
      />
    </div>
  );
}
