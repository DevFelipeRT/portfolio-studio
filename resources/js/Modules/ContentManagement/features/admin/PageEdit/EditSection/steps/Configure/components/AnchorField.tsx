import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';

interface AnchorFieldProps {
    anchor: string;
    onAnchorChange: (value: string) => void;
}

export function AnchorField({ anchor, onAnchorChange }: AnchorFieldProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor="edit-section-anchor">Anchor</Label>
            <Input id="edit-section-anchor" value={anchor} onChange={(event) => onAnchorChange(event.target.value)} />
        </div>
    );
}
