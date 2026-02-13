import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/modules/content-management/types';
import { ConfigureSectionStep } from '../../dialog/steps';
import type { UpdateSectionPayload as EditSectionPayload } from '../../types';
import { EditSectionFooter } from './partials/EditSectionFooter';
import { useEditSectionDialogState } from './useEditSectionDialogState';
export type { EditSectionPayload };

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
  /**
   * Flow orchestration for the "edit section" dialog.
   *
   * Steps live in dialogs/steps; this flow wires them together.
   */
  const {
    dialogContentRef,
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
    handleClose,
    handleConfirm,
    handleTemplateChange,
  } = useEditSectionDialogState({
    open,
    section,
    templates,
    allowTemplateChange,
    onOpenChange,
    onSubmit,
  });

  const templatePickerDisabled = !allowTemplateChange;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogContentRef}
        className={cn(
          'flex h-[90vh] max-h-[90vh] min-h-0 max-w-2xl flex-col gap-y-0 p-0',
        )}
      >
        <DialogHeader className="border-b p-6">
          <DialogTitle>Edit section</DialogTitle>
          <DialogDescription>
            Update this section metadata and template content.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 flex-1 px-5">
          {!section && (
            <p className="text-muted-foreground py-6 text-sm">
              No section selected.
            </p>
          )}

          {section && (
            <ConfigureSectionStep
              idPrefix="edit-section"
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
