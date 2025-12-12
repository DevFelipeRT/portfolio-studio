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
import { TemplateSectionForm } from '@/Modules/ContentManagement/Components/Editor/TemplateSectionForm';
import { TemplateSelector } from '@/Modules/ContentManagement/Components/Editor/TemplateSelector';
import type {
    SectionData,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import React from 'react';

export interface CreateSectionPayload {
    template_key: string;
    slot: string | null;
    anchor: string | null;
    locale: string | null;
    data: SectionData;
}

interface PageSectionCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templates: TemplateDefinitionDto[];
    defaultLocale?: string | null;
    onSubmit: (payload: CreateSectionPayload) => void;
}

/**
 * Dialog used to create a new section for a page.
 *
 * It exposes a payload containing structural fields (template_key, slot, anchor, locale)
 * and the template-specific data object.
 */
export function PageSectionCreateDialog({
    open,
    onOpenChange,
    templates,
    defaultLocale = null,
    onSubmit,
}: PageSectionCreateDialogProps) {
    const [selectedTemplateKey, setSelectedTemplateKey] =
        React.useState<string>('');
    const [slot, setSlot] = React.useState<string>('');
    const [anchor, setAnchor] = React.useState<string>('');
    const [locale, setLocale] = React.useState<string>(defaultLocale ?? '');
    const [data, setData] = React.useState<SectionData>({});

    const selectedTemplate = React.useMemo(
        () => templates.find((item) => item.key === selectedTemplateKey),
        [templates, selectedTemplateKey],
    );

    const handleTemplateChange = (templateKey: string): void => {
        setSelectedTemplateKey(templateKey);

        const template = templates.find((item) => item.key === templateKey);

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

            if (field.name === 'eyebrow') {
                initial[field.name] = '' as never;
                continue;
            }

            if (field.name === 'title') {
                initial[field.name] = (template.label ?? '') as never;
                continue;
            }

            if (field.name === 'description') {
                initial[field.name] = (template.description ?? '') as never;
                continue;
            }

            switch (field.type) {
                case 'boolean':
                    initial[field.name] = false as never;
                    break;
                case 'integer':
                    initial[field.name] = null as never;
                    break;
                case 'array_integer':
                    initial[field.name] = [] as never;
                    break;
                default:
                    initial[field.name] = '' as never;
                    break;
            }
        }

        setData(initial);

        if (
            Array.isArray(template.allowed_slots) &&
            template.allowed_slots.length > 0
        ) {
            setSlot(template.allowed_slots[0] ?? '');
        }
    };

    const handleClose = (): void => {
        onOpenChange(false);
    };

    const handleConfirm = (): void => {
        if (!selectedTemplateKey) {
            return;
        }

        onSubmit({
            template_key: selectedTemplateKey,
            slot: slot || null,
            anchor: anchor || null,
            locale: locale || null,
            data,
        });

        onOpenChange(false);
    };

    React.useEffect(() => {
        if (!open) {
            setSelectedTemplateKey('');
            setSlot('');
            setAnchor('');
            setLocale(defaultLocale ?? '');
            setData({});
        }
    }, [open, defaultLocale]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add section</DialogTitle>
                    <DialogDescription>
                        Choose a template and configure its content and
                        placement within the page.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="section-template">Template</Label>
                            <TemplateSelector
                                templates={templates}
                                value={selectedTemplateKey}
                                onChange={handleTemplateChange}
                                placeholder="Select a template"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="section-slot">Slot</Label>
                            <Input
                                id="section-slot"
                                value={slot}
                                onChange={(event) =>
                                    setSlot(event.target.value)
                                }
                                placeholder="hero, main, footer"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="section-anchor">Anchor</Label>
                            <Input
                                id="section-anchor"
                                value={anchor}
                                onChange={(event) =>
                                    setAnchor(event.target.value)
                                }
                                placeholder="about, contact"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="section-locale">Locale</Label>
                            <Input
                                id="section-locale"
                                value={locale}
                                onChange={(event) =>
                                    setLocale(event.target.value)
                                }
                                placeholder="pt_BR, en_US"
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

                <DialogFooter>
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
                        disabled={!selectedTemplateKey}
                    >
                        Create section
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
