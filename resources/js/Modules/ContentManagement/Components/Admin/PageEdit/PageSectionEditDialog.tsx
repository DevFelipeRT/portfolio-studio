import { Button } from '@/Components/Ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/Ui/dialog';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/Ui/select';
import { cn } from '@/lib/utils';
import { TemplateSectionForm } from '@/Modules/ContentManagement/Components/Editor/TemplateSectionForm';
import { TemplateSelector } from '@/Modules/ContentManagement/Components/Editor/TemplateSelector';
import type {
    PageSectionDto,
    SectionData,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { ScrollArea } from '@/Components/Ui/scroll-area';
import React from 'react';
import { SelectableInput } from '@/Components/Ui/selectable-input';

export interface EditSectionPayload {
    templateKey: string;
    slot: string | null;
    anchor: string | null;
    navigation_label: string | null;
    is_active: boolean;
    locale: string | null;
    data: SectionData;
}

interface PageSectionEditDialogProps {
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
export function PageSectionEditDialog({
    open,
    onOpenChange,
    section,
    templates,
    navigationGroups = [],
    allowTemplateChange = true,
    onSubmit,
}: PageSectionEditDialogProps) {
    const dialogContentRef = React.useRef<HTMLDivElement | null>(null);
    const [templateKey, setTemplateKey] = React.useState<string>('');
    const [slot, setSlot] = React.useState<string>('');
    const [anchor, setAnchor] = React.useState<string>('');
    const [navigationLabel, setNavigationLabel] = React.useState<string>('');
    const [isActive, setIsActive] = React.useState<boolean>(true);
    const [data, setData] = React.useState<SectionData>({});

    const selectedTemplate = React.useMemo(
        () => templates.find((item) => item.key === templateKey) ?? null,
        [templates, templateKey],
    );
    const allowedSlots = selectedTemplate?.allowed_slots ?? [];
    const hasSlotOptions = allowedSlots.length > 0;
    const navigationGroup =
        typeof data.navigation_group === 'string' ? data.navigation_group : '';
    const locale = section?.locale ?? null;

    React.useEffect(() => {
        if (!open || !section) {
            return;
        }

        setTemplateKey(section.template_key);
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

        setTemplateKey(nextTemplateKey);

        const template = templates.find((item) => item.key === nextTemplateKey);

        if (!template) {
            setData({});
            return;
        }

        const initial: SectionData = {};
        const previousNavigationGroup =
            typeof data.navigation_group === 'string'
                ? data.navigation_group
                : '';

        for (const field of template.fields) {
            if (
                field.default_value !== null &&
                field.default_value !== undefined
            ) {
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
        if (!section || !templateKey) {
            return;
        }

        onSubmit({
            templateKey,
            slot: slot || null,
            anchor: anchor || null,
            navigation_label: navigationLabel || null,
            is_active: isActive,
            locale,
            data,
        });

        onOpenChange(false);
    };

    const templateSelectDisabled = !allowTemplateChange;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                ref={dialogContentRef}
                className={cn(
                    'max-h-10/12 min-h-0 max-w-2xl gap-y-0 p-0',
                    section ? 'h-10/12' : 'h-auto',
                )}
            >
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Edit section</DialogTitle>
                    <DialogDescription>
                        Update this section metadata and template content.
                    </DialogDescription>
                </DialogHeader>

                {!section && (
                    <p className="text-muted-foreground py-4 text-sm">
                        No section selected.
                    </p>
                )}

                <ScrollArea className="px-5">
                    {section && (
                        <div className="mx-1 my-4 space-y-6">
                            <div className="grid gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-section-template">
                                        Template
                                    </Label>
                                    <TemplateSelector
                                        templates={templates}
                                        value={templateKey}
                                        onChange={handleTemplateChange}
                                        placeholder="Select a template"
                                        disabled={templateSelectDisabled}
                                        className="h-14 w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-section-slot">
                                        Slot
                                    </Label>
                                    {hasSlotOptions ? (
                                        <Select
                                            value={slot}
                                            onValueChange={setSlot}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a slot" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allowedSlots.map((slotOption) => (
                                                    <SelectItem
                                                        key={slotOption}
                                                        value={slotOption}
                                                    >
                                                        {slotOption}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            id="edit-section-slot"
                                            value={slot}
                                            onChange={(event) =>
                                                setSlot(event.target.value)
                                            }
                                        />
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-section-anchor">
                                        Anchor
                                    </Label>
                                    <Input
                                        id="edit-section-anchor"
                                        value={anchor}
                                        onChange={(event) =>
                                            setAnchor(event.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-section-navigation-label">
                                        Navigation label
                                    </Label>
                                    <Input
                                        id="edit-section-navigation-label"
                                        value={navigationLabel}
                                        onChange={(event) =>
                                            setNavigationLabel(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Highlights"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-section-navigation-group">
                                        Navigation group
                                    </Label>
                                    <SelectableInput
                                        id="edit-section-navigation-group"
                                        value={navigationGroup}
                                        onChange={(value) =>
                                            setData((previous) => ({
                                                ...previous,
                                                navigation_group: value,
                                            }))
                                        }
                                        placeholder="About"
                                        options={navigationGroups.map(
                                            (group) => ({
                                                value: group,
                                            }),
                                        )}
                                        emptyLabel="No groups yet"
                                        portalContainer={dialogContentRef}
                                    />
                                </div>
                            </div>

                            <div className="bg-muted/40 flex items-start gap-2 rounded-md border px-3 py-2">
                                <Checkbox
                                    id="edit-section-is-active"
                                    checked={isActive}
                                    onCheckedChange={(checked) =>
                                        setIsActive(Boolean(checked))
                                    }
                                />
                                <div className="space-y-0.5">
                                    <Label htmlFor="edit-section-is-active">
                                        Active
                                    </Label>
                                    <p className="text-muted-foreground text-xs">
                                        When disabled, the section stays hidden.
                                    </p>
                                </div>
                            </div>

                            {selectedTemplate && (
                                <div className="bg-muted/40 rounded-md border p-4">
                                    <TemplateSectionForm
                                        template={selectedTemplate}
                                        value={data}
                                        onChange={setData}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="border-t p-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!section || !templateKey}
                    >
                        Save section
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
