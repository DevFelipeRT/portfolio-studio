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
import { ConfigureSectionStep } from '../configure/ConfigureSectionStep';
import { CreateSectionFooter } from './components/CreateSectionFooter';
import { SelectStep } from './steps/SelectStep';
import React from 'react';
import { useCreateSectionDialogState } from './useCreateSectionDialogState';

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
  const {
    dialogContentRef,
    step,
    filterMode,
    originFilter,
    domainOrigins,
    visibleTemplates,
    selectedTemplate,
    selectedTemplateKey,
    allowedSlots,
    hasSlotOptions,
    slot,
    anchor,
    navigationLabel,
    navigationGroup,
    isActive,
    data,
    setOriginFilter,
    setSlot,
    setAnchor,
    setNavigationLabel,
    setIsActive,
    setData,
    setStep,
    handleClose,
    handleContinue,
    handleConfirm,
    handleFilterModeChange,
    handleTemplateChange,
  } = useCreateSectionDialogState({
    open,
    templates,
    defaultLocale,
    navigationGroups,
    onOpenChange,
    onSubmit,
  });

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
