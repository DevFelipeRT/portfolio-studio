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
import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import { ConfigureSectionStep } from '../../steps/configure/ConfigureSectionStep';
import { CreateSectionFooter } from './partials/CreateSectionFooter';
import { SelectStep } from '../../steps/select/SelectStep';
import { useCreateSectionDialogState } from './useCreateSectionDialogState';
import { SectionDialogPayload } from '../../core/types';
export type { TemplateFilterMode } from '../../steps/select/types';
import { useTemplateFiltering } from '../../steps/select/useTemplateFiltering';

export type CreateSectionPayload = SectionDialogPayload;

interface CreateSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: TemplateDefinitionDto[];
  defaultLocale?: string | null;
  navigationGroups?: string[];
  onSubmit: (payload: CreateSectionPayload) => void;
}

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
    setSlot,
    setAnchor,
    setNavigationLabel,
    setNavigationGroup,
    setIsActive,
    setData,
    setStep,
    handleClose,
    handleContinue,
    handleConfirm,
    handleTemplateChange,
  } = useCreateSectionDialogState({
    open,
    templates,
    defaultLocale,
    onOpenChange,
    onSubmit,
  });

  const {
    filterMode,
    originFilter,
    domainOrigins,
    visibleTemplates,
    setOriginFilter: setTemplateOriginFilter,
    handleFilterModeChange: handleTemplateFilterModeChange,
  } = useTemplateFiltering({ open, templates });

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
              onFilterModeChange={handleTemplateFilterModeChange}
              onOriginFilterChange={setTemplateOriginFilter}
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
              onNavigationGroupChange={setNavigationGroup}
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
