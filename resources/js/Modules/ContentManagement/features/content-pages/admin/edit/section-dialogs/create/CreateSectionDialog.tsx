import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/Ui/dialog';
import { ScrollArea } from '@/Components/Ui/scroll-area';
import { cn } from '@/lib/utils';
import type {
  SectionData,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { buildInitialSectionData } from '@/Modules/ContentManagement/features/sections';
import { ConfigureSectionStep } from '../shared/ConfigureSectionStep';
import { CreateSectionFooter } from './components/CreateSectionFooter';
import { SelectStep } from './steps/SelectStep';
import React from 'react';

export interface CreateSectionPayload {
  template_key: string;
  slot: string | null;
  anchor: string | null;
  navigation_label: string | null;
  is_active: boolean;
  locale: string | null;
  data: SectionData;
}

interface CreateSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: TemplateDefinitionDto[];
  defaultLocale?: string | null;
  navigationGroups?: string[];
  onSubmit: (payload: CreateSectionPayload) => void;
}

export type TemplateFilterMode = 'all' | 'generic' | 'domain';

type DialogStep = 'select' | 'configure';

/**
 * Dialog used to create a new section for a page.
 *
 * It exposes a payload containing structural fields (template_key, slot, anchor, locale)
 * and the template-specific data object.
 */
export function CreateSectionDialog({
  open,
  onOpenChange,
  templates,
  defaultLocale = null,
  navigationGroups = [],
  onSubmit,
}: CreateSectionDialogProps) {
  const dialogContentRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedTemplateKey, setSelectedTemplateKey] =
    React.useState<string>('');
  const [step, setStep] = React.useState<DialogStep>('select');
  const [filterMode, setFilterMode] = React.useState<TemplateFilterMode>('all');
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

      return candidates.filter((template) => template.origin === originFilter);
    }

    if (originFilter) {
      return templates.filter((template) => template.origin === originFilter);
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
    setData(buildInitialSectionData(template, { previousData: data }));

    if (
      Array.isArray(template.allowed_slots) &&
      template.allowed_slots.length > 0
    ) {
      setSlot(template.allowed_slots[0] ?? '');
    }
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
        ref={dialogContentRef}
        className={cn(
          'flex h-[90vh] max-h-[90vh] min-h-0 max-w-2xl flex-col gap-y-0 p-0',
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

        <ScrollArea className="min-h-0 flex-1 px-5">
          {step === 'select' ? (
            <SelectStep
              filterMode={filterMode}
              originFilter={originFilter}
              domainOrigins={domainOrigins}
              visibleTemplates={visibleTemplates}
              selectedTemplateKey={selectedTemplateKey}
              onFilterModeChange={handleFilterModeChange}
              onOriginFilterChange={setOriginFilter}
              onSelectTemplate={handleTemplateChange}
            />
          ) : (
            <ConfigureSectionStep
              idPrefix="section"
              templates={templates}
              selectedTemplate={selectedTemplate}
              selectedTemplateKey={selectedTemplateKey}
              templatePickerDisabled
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
          <CreateSectionFooter
            step={step}
            canContinue={Boolean(selectedTemplateKey)}
            onClose={handleClose}
            onContinue={handleContinue}
            onChangeTemplate={() => setStep('select')}
            onConfirm={handleConfirm}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
