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
import { ScrollArea } from '@/Components/Ui/scroll-area';
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
    SectionData,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import React from 'react';
import { SelectableInput } from '@/Components/Ui/selectable-input';

export interface CreateSectionPayload {
    template_key: string;
    slot: string | null;
    anchor: string | null;
    navigation_label: string | null;
    is_active: boolean;
    locale: string | null;
    data: SectionData;
}

interface PageSectionCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templates: TemplateDefinitionDto[];
    defaultLocale?: string | null;
    navigationGroups?: string[];
    onSubmit: (payload: CreateSectionPayload) => void;
}

type TemplateFilterMode = 'all' | 'generic' | 'domain';

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
    navigationGroups = [],
    onSubmit,
}: PageSectionCreateDialogProps) {
    const [selectedTemplateKey, setSelectedTemplateKey] =
        React.useState<string>('');
    const [step, setStep] = React.useState<'select' | 'configure'>('select');
    const [filterMode, setFilterMode] =
        React.useState<TemplateFilterMode>('all');
    const [originFilter, setOriginFilter] = React.useState<string>('');
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
    const navigationGroup =
        typeof data.navigation_group === 'string' ? data.navigation_group : '';

    const origins = React.useMemo(() => {
        const unique = new Set<string>();

        templates.forEach((template) => {
            if (template.origin) {
                unique.add(template.origin);
            }
        });

        return Array.from(unique).sort((a, b) => a.localeCompare(b));
    }, [templates]);

    const domainOrigins = React.useMemo(
        () => origins.filter((origin) => origin !== 'content-management'),
        [origins],
    );

    const visibleTemplates = React.useMemo(() => {
        if (filterMode === 'generic') {
            return templates.filter(
                (template) => template.origin === 'content-management',
            );
        }

        if (filterMode === 'domain') {
            const candidates = templates.filter(
                (template) => template.origin !== 'content-management',
            );

            if (!originFilter) {
                return candidates;
            }

            return candidates.filter(
                (template) => template.origin === originFilter,
            );
        }

        if (originFilter) {
            return templates.filter(
                (template) => template.origin === originFilter,
            );
        }

        return templates;
    }, [filterMode, originFilter, templates]);

    const handleTemplateChange = (templateKey: string): void => {
        setSelectedTemplateKey(templateKey);

        const template = templates.find((item) => item.key === templateKey);

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

        if (previousNavigationGroup.trim()) {
            initial.navigation_group = previousNavigationGroup;
        }

        setData(initial);

        if (
            Array.isArray(template.allowed_slots) &&
            template.allowed_slots.length > 0
        ) {
            setSlot(template.allowed_slots[0] ?? '');
        }
    };

    const handleSelectTemplate = (templateKey: string): void => {
        handleTemplateChange(templateKey);
    };

    const handleFilterModeChange = (mode: TemplateFilterMode): void => {
        setFilterMode(mode);

        if (mode === 'generic') {
            setOriginFilter('');
        }
    };

    const handleContinue = (): void => {
        if (!selectedTemplateKey) {
            return;
        }

        setStep('configure');
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
            navigation_label: navigationLabel || null,
            is_active: isActive,
            locale: defaultLocale ?? null,
            data,
        });

        onOpenChange(false);
    };

    React.useEffect(() => {
        if (!open) {
            setSelectedTemplateKey('');
            setStep('select');
            setFilterMode('all');
            setOriginFilter('');
            setSlot('');
            setAnchor('');
            setNavigationLabel('');
            setIsActive(true);
            setData({});
        }
    }, [open, defaultLocale]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'h-[90vh] max-h-[90vh] min-h-0 max-w-2xl gap-y-0 p-0 flex flex-col',
                )}
            >
                <DialogHeader className="border-b p-6">
                    <DialogTitle>Add section</DialogTitle>
                    <DialogDescription>
                        {step === 'select'
                            ? 'Choose a template to preview.'
                            : 'Configure the selected template and place it on the page.'}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 min-h-0 px-5">
                    {step === 'select' && (
                        <div className="mx-1 my-4 space-y-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Filters
                                </Label>
                                <Button
                                    type="button"
                                    variant={
                                        filterMode === 'all'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        handleFilterModeChange('all')
                                    }
                                >
                                    All
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        filterMode === 'generic'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        handleFilterModeChange('generic')
                                    }
                                >
                                    Generic
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        filterMode === 'domain'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        handleFilterModeChange('domain')
                                    }
                                >
                                    Domain
                                </Button>

                                <div className="ml-auto flex items-center gap-2">
                                    <Label
                                        htmlFor="template-origin-filter"
                                        className="text-xs uppercase tracking-wide text-muted-foreground"
                                    >
                                        Domain
                                    </Label>
                                    <select
                                        id="template-origin-filter"
                                        className="border-input bg-background text-foreground rounded-md border px-2 py-1 text-sm"
                                        value={originFilter}
                                        onChange={(event) =>
                                            setOriginFilter(
                                                event.target.value,
                                            )
                                        }
                                        disabled={filterMode === 'generic'}
                                    >
                                        <option value="">All</option>
                                        {domainOrigins.map((origin) => (
                                            <option
                                                key={origin}
                                                value={origin}
                                            >
                                                {origin}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {visibleTemplates.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    No templates match the selected filter.
                                </p>
                            ) : (
                                <div className="grid gap-3 md:grid-cols-2">
                                    {visibleTemplates.map((template) => {
                                        const isSelected =
                                            template.key ===
                                            selectedTemplateKey;
                                        const originLabel =
                                            template.origin ===
                                            'content-management'
                                                ? 'Generic'
                                                : template.origin;

                                        return (
                                            <button
                                                key={template.key}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectTemplate(
                                                        template.key,
                                                    )
                                                }
                                                className={cn(
                                                    'text-left rounded-md border p-4 transition hover:border-foreground/40',
                                                    isSelected
                                                        ? 'border-foreground'
                                                        : 'border-border',
                                                )}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="text-sm font-semibold">
                                                        {template.label}
                                                    </div>
                                                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[0.7rem] uppercase tracking-wide">
                                                        {originLabel}
                                                    </span>
                                                </div>
                                                {template.description && (
                                                    <p className="text-muted-foreground mt-2 text-sm">
                                                        {template.description}
                                                    </p>
                                                )}
                                                {Array.isArray(
                                                    template.allowed_slots,
                                                ) &&
                                                    template.allowed_slots
                                                        .length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                            {template.allowed_slots.map(
                                                                (slot) => (
                                                                    <span
                                                                        key={
                                                                            slot
                                                                        }
                                                                        className="border-muted text-muted-foreground rounded-full border px-2 py-0.5 text-[0.7rem]"
                                                                    >
                                                                        {slot}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'configure' && (
                        <div className="mx-1 my-4 space-y-6">
                            <div className="grid gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="section-template">
                                        Template
                                    </Label>
                                    <TemplateSelector
                                        templates={templates}
                                        value={selectedTemplateKey}
                                        onChange={handleTemplateChange}
                                        placeholder="Select a template"
                                        disabled
                                        className="h-14 w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="section-slot">Slot</Label>
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
                                            id="section-slot"
                                            value={slot}
                                            onChange={(event) =>
                                                setSlot(event.target.value)
                                            }
                                            placeholder="hero, main, footer"
                                        />
                                    )}
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
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="section-navigation-label">
                                        Navigation label
                                    </Label>
                                    <Input
                                        id="section-navigation-label"
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
                                    <Label htmlFor="section-navigation-group">
                                        Navigation group
                                    </Label>
                                    <SelectableInput
                                        id="section-navigation-group"
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
                                    />
                                </div>
                            </div>

                            <div className="bg-muted/40 flex items-start gap-2 rounded-md border px-3 py-2">
                                <Checkbox
                                    id="section-is-active"
                                    checked={isActive}
                                    onCheckedChange={(checked) =>
                                        setIsActive(Boolean(checked))
                                    }
                                />
                                <div className="space-y-0.5">
                                    <Label htmlFor="section-is-active">
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
                    {step === 'select' ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleContinue}
                                disabled={!selectedTemplateKey}
                            >
                                Continue
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('select')}
                            >
                                Change template
                            </Button>
                            <Button
                                type="button"
                                onClick={handleConfirm}
                                disabled={!selectedTemplateKey}
                            >
                                Create section
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
