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
import {
  ConfigureSectionStep,
  SelectStep,
  useTemplateFiltering,
} from '../../dialog/steps';
import type { CreateSectionPayload } from '../../types';
import { CreateSectionFooter } from './partials/CreateSectionFooter';
import { useCreateSectionDialogState } from './useCreateSectionDialogState';
export type { TemplateFilterMode } from '../../dialog/steps';
export type { CreateSectionPayload };

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
  /**
   * Flow orchestration for the "create section" dialog.
   *
   * Steps and filtering live in dialogs/steps; this flow wires them together.
   */
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
    templateData,
    setSlot,
    setAnchor,
    setNavigationLabel,
    setNavigationGroup,
    setIsActive,
    setTemplateData,
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
              templateData={templateData}
              dialogContentRef={dialogContentRef}
              onTemplateChange={handleTemplateChange}
              onSlotChange={setSlot}
              onAnchorChange={setAnchor}
              onNavigationLabelChange={setNavigationLabel}
              onNavigationGroupChange={setNavigationGroup}
              onIsActiveChange={setIsActive}
              onTemplateDataChange={setTemplateData}
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
