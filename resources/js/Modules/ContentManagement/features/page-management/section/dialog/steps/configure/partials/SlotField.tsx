import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/Ui/select';

interface SlotFieldProps {
  idPrefix: string;
  allowedSlots: string[];
  hasSlotOptions: boolean;
  slot: string;
  onSlotChange: (value: string) => void;
}

export function SlotField({
  idPrefix,
  allowedSlots,
  hasSlotOptions,
  slot,
  onSlotChange,
}: SlotFieldProps) {
  const id = `${idPrefix}-slot`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Slot</Label>
      {hasSlotOptions ? (
        <Select value={slot} onValueChange={onSlotChange}>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Select a slot" />
          </SelectTrigger>
          <SelectContent>
            {allowedSlots.map((slotOption) => (
              <SelectItem key={slotOption} value={slotOption}>
                {slotOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          value={slot}
          onChange={(event) => onSlotChange(event.target.value)}
          placeholder="hero, main, footer"
        />
      )}
    </div>
  );
}
