import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const { translate: tSections } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.sections,
  );
  const id = `${idPrefix}-slot`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{tSections('fields.slot', 'Slot')}</Label>
      {hasSlotOptions ? (
        <Select value={slot} onValueChange={onSlotChange}>
          <SelectTrigger id={id}>
            <SelectValue
              placeholder={tSections(
                'fields.slotPlaceholder',
                'Select a slot',
              )}
            />
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
          placeholder={tSections(
            'fields.slotInputPlaceholder',
            'hero, main, footer',
          )}
        />
      )}
    </div>
  );
}
