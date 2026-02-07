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
    hasSlotOptions: boolean;
    allowedSlots: string[];
    slot: string;
    onSlotChange: (value: string) => void;
}

export function SlotField({ hasSlotOptions, allowedSlots, slot, onSlotChange }: SlotFieldProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor="edit-section-slot">Slot</Label>
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
                <Input id="edit-section-slot" value={slot} onChange={(event) => onSlotChange(event.target.value)} />
            )}
        </div>
    );
}
