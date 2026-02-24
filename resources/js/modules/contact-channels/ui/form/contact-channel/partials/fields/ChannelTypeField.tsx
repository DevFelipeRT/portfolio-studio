import { FormField, type FormErrors } from '@/common/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';
import type { ContactChannelTypeOption } from '@/modules/contact-channels/core/types';

interface ChannelTypeFieldProps {
  value: ContactChannelFormData['channel_type'];
  errors: FormErrors<keyof ContactChannelFormData>;
  channelTypes: ContactChannelTypeOption[];
  processing: boolean;
  onChange(value: string): void;
}

export function ChannelTypeField({
  value,
  errors,
  channelTypes,
  processing,
  onChange,
}: ChannelTypeFieldProps) {
  return (
    <FormField
      name="channel_type"
      errors={errors}
      htmlFor="channel-type"
      label="Type"
      required
      errorId="channel-type-error"
    >
      {({ a11yAttributes, getSelectClassName }) => (
        <Select
          value={value}
          onValueChange={onChange}
          disabled={processing}
        >
          <SelectTrigger
            id="channel-type"
            className={getSelectClassName()}
            {...a11yAttributes}
          >
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>

          <SelectContent>
            {channelTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}

