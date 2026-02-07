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
  allowedSlots: string[];
  hasSlotOptions: boolean;
  slot: string;
  onSlotChange: (value: string) => void;
}

export function SlotField({
  allowedSlots,
  hasSlotOptions,
  slot,
  onSlotChange,
}: SlotFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="section-slot">Slot</Label>
      {hasSlotOptions ? (
        <Select value={slot} onValueChange={onSlotChange}>
          <SelectTrigger>
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
          id="section-slot"
          value={slot}
          onChange={(event) => onSlotChange(event.target.value)}
          placeholder="hero, main, footer"
        />
      )}
    </div>
  );
}
