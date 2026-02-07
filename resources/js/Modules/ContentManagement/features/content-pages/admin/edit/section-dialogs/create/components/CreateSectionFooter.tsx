import { Button } from '@/Components/Ui/button';

type DialogStep = 'select' | 'configure';

interface CreateSectionFooterProps {
    step: DialogStep;
    canContinue: boolean;
    onClose: () => void;
    onContinue: () => void;
    onChangeTemplate: () => void;
    onConfirm: () => void;
}

export function CreateSectionFooter({
    step,
    canContinue,
    onClose,
    onContinue,
    onChangeTemplate,
    onConfirm,
}: CreateSectionFooterProps) {
    if (step === 'select') {
        return (
            <>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="button" onClick={onContinue} disabled={!canContinue}>
                    Continue
                </Button>
            </>
        );
    }

    return (
        <>
            <Button type="button" variant="outline" onClick={onChangeTemplate}>
                Change template
            </Button>
            <Button type="button" onClick={onConfirm} disabled={!canContinue}>
                Create section
            </Button>
        </>
    );
}
