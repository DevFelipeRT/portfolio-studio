import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/Ui/dialog';
import { ScrollArea } from '@/Components/Ui/scroll-area';
import { cn } from '@/lib/utils';
import type {
    PageSectionDto,
    SectionData,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/core/types';
import { EditSectionFooter } from '@/Modules/ContentManagement/ui/admin/PageEdit/EditSection/components/EditSectionFooter';
import { ConfigureStep } from '@/Modules/ContentManagement/ui/admin/PageEdit/EditSection/steps/ConfigureStep';
import React from 'react';

export interface EditSectionPayload {
    templateKey: string;
    slot: string | null;
    anchor: string | null;
    navigation_label: string | null;
    is_active: boolean;
    locale: string | null;
    data: SectionData;
}

interface EditSectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    section: PageSectionDto | null;
    templates: TemplateDefinitionDto[];
    navigationGroups?: string[];
    allowTemplateChange?: boolean;
    onSubmit: (payload: EditSectionPayload) => void;
}

/**
 * Dialog used to edit an existing section.
 */
export function EditSectionDialog({
    open,
    onOpenChange,
    section,
    templates,
    navigationGroups = [],
    allowTemplateChange = true,
    onSubmit,
}: EditSectionDialogProps) {
    const dialogContentRef = React.useRef<HTMLDivElement | null>(null);
    const [selectedTemplateKey, setSelectedTemplateKey] = React.useState<string>('');
    const [slot, setSlot] = React.useState<string>('');
    const [anchor, setAnchor] = React.useState<string>('');
    const [navigationLabel, setNavigationLabel] = React.useState<string>('');
    const [isActive, setIsActive] = React.useState<boolean>(true);
    const [data, setData] = React.useState<SectionData>({});

    const selectedTemplate = React.useMemo(
        () => templates.find((item) => item.key === selectedTemplateKey),
        [templates, selectedTemplateKey],
    );
    const allowedSlots = selectedTemplate?.allowed_slots ?? [];
    const hasSlotOptions = allowedSlots.length > 0;
    const navigationGroup = typeof data.navigation_group === 'string' ? data.navigation_group : '';
    const locale = section?.locale ?? null;

    React.useEffect(() => {
        if (!open || !section) {
            return;
        }

        setSelectedTemplateKey(section.template_key);
        setSlot(section.slot ?? '');
        setAnchor(section.anchor ?? '');
        setNavigationLabel(section.navigation_label ?? '');
        setIsActive(section.is_active);
        setData(section.data ?? {});
    }, [open, section]);

    const handleTemplateChange = (nextTemplateKey: string): void => {
        if (!allowTemplateChange) {
            return;
        }

        setSelectedTemplateKey(nextTemplateKey);

        const template = templates.find((item) => item.key === nextTemplateKey);

        if (!template) {
            setData({});
            return;
        }

        const initial: SectionData = {};
        const previousNavigationGroup = typeof data.navigation_group === 'string' ? data.navigation_group : '';

        for (const field of template.fields) {
            if (field.default_value !== null && field.default_value !== undefined) {
                initial[field.name] = field.default_value as never;
                continue;
            }

            switch (field.type) {
                case 'boolean':
                    initial[field.name] = false;
                    break;
                case 'integer':
                    initial[field.name] = null;
                    break;
                case 'array_integer':
                    initial[field.name] = [];
                    break;
                default:
                    initial[field.name] = '';
                    break;
            }
        }

        if (previousNavigationGroup.trim()) {
            initial.navigation_group = previousNavigationGroup;
        }

        setData(initial);
    };

    const handleClose = (): void => {
        onOpenChange(false);
    };

    const handleConfirm = (): void => {
        if (!section || !selectedTemplateKey) {
            return;
        }

        onSubmit({
            templateKey: selectedTemplateKey,
            slot: slot || null,
            anchor: anchor || null,
            navigation_label: navigationLabel || null,
            is_active: isActive,
            locale,
            data,
        });

        onOpenChange(false);
    };

    const templatePickerDisabled = !allowTemplateChange;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                ref={dialogContentRef}
                className={cn('max-h-10/12 min-h-0 max-w-2xl gap-y-0 p-0', section ? 'h-10/12' : 'h-auto')}
            >
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Edit section</DialogTitle>
                    <DialogDescription>Update this section metadata and template content.</DialogDescription>
                </DialogHeader>

                {!section && <p className="text-muted-foreground py-4 text-sm">No section selected.</p>}

                <ScrollArea className="px-5">
                    {section && (
                        <ConfigureStep
                            templates={templates}
                            selectedTemplate={selectedTemplate}
                            selectedTemplateKey={selectedTemplateKey}
                            templatePickerDisabled={templatePickerDisabled}
                            allowedSlots={allowedSlots}
                            hasSlotOptions={hasSlotOptions}
                            slot={slot}
                            anchor={anchor}
                            navigationLabel={navigationLabel}
                            navigationGroup={navigationGroup}
                            navigationGroups={navigationGroups}
                            isActive={isActive}
                            data={data}
                            dialogContentRef={dialogContentRef}
                            onTemplateChange={handleTemplateChange}
                            onSlotChange={setSlot}
                            onAnchorChange={setAnchor}
                            onNavigationLabelChange={setNavigationLabel}
                            onNavigationGroupChange={(value) =>
                                setData((previous) => ({
                                    ...previous,
                                    navigation_group: value,
                                }))
                            }
                            onIsActiveChange={setIsActive}
                            onDataChange={setData}
                        />
                    )}
                </ScrollArea>

                <DialogFooter className="border-t p-6">
                    <EditSectionFooter
                        canSave={Boolean(section && selectedTemplateKey)}
                        onClose={handleClose}
                        onConfirm={handleConfirm}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
