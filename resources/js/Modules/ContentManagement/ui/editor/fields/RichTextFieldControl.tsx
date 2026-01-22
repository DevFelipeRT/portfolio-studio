import { RichTextEditor } from '@/Common/RichText/RichTextEditor';
import { Label } from '@/Components/Ui/label';

interface RichTextFieldControlProps {
    name: string;
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
}

export function RichTextFieldControl({
    name,
    label,
    required,
    value,
    onChange,
}: RichTextFieldControlProps) {
    const editorId = `${name}-rich-text`;

    return (
        <div className="space-y-2">
            <Label htmlFor={editorId}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RichTextEditor id={editorId} value={value} onChange={onChange} />
            <p className="text-muted-foreground text-xs">
                Rich text content stored as JSON.
            </p>
        </div>
    );
}
