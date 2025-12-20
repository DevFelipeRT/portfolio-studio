import { Button } from '@/Components/Ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/Ui/dialog';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
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

export interface EditSectionPayload {
    templateKey: string;
    slot: string | null;
    anchor: string | null;
    locale: string | null;
    data: SectionData;
}

interface PageSectionEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    section: PageSectionDto | null;
    templates: TemplateDefinitionDto[];
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
    allowTemplateChange = true,
    onSubmit,
}: PageSectionEditDialogProps) {
    const [templateKey, setTemplateKey] = React.useState<string>('');
    const [slot, setSlot] = React.useState<string>('');
    const [anchor, setAnchor] = React.useState<string>('');
    const [locale, setLocale] = React.useState<string>('');
    const [data, setData] = React.useState<SectionData>({});

    const selectedTemplate = React.useMemo(
        () => templates.find((item) => item.key === templateKey) ?? null,
        [templates, templateKey],
    );

    React.useEffect(() => {
        if (!open || !section) {
            return;
        }

        setTemplateKey(section.template_key);
        setSlot(section.slot ?? '');
        setAnchor(section.anchor ?? '');
        setLocale(section.locale ?? '');
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
            locale: locale || null,
            data,
        });

        onOpenChange(false);
    };

    const templateSelectDisabled = !allowTemplateChange;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
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
                            <div className="grid gap-4 md:grid-cols-2">
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
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-section-slot">
                                        Slot
                                    </Label>
                                    <Input
                                        id="edit-section-slot"
                                        value={slot}
                                        onChange={(event) =>
                                            setSlot(event.target.value)
                                        }
                                    />
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

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-section-locale">
                                        Locale
                                    </Label>
                                    <Input
                                        id="edit-section-locale"
                                        value={locale}
                                        onChange={(event) =>
                                            setLocale(event.target.value)
                                        }
                                    />
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
