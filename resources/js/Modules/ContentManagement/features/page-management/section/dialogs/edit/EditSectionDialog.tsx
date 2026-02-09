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
  PageSectionDto,
  SectionData,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { ConfigureSectionStep } from '../configure/ConfigureSectionStep';
import { EditSectionFooter } from './components/EditSectionFooter';
import React from 'react';
import { useEditSectionDialogState } from './useEditSectionDialogState';

export interface EditSectionPayload {
  template_key: string;
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
    navigationGroups: resolvedNavigationGroups,
    isActive,
    data,
    setSlot,
    setAnchor,
    setNavigationLabel,
    setIsActive,
    setData,
    handleClose,
    handleConfirm,
    handleTemplateChange,
  } = useEditSectionDialogState({
    open,
    section,
    templates,
    navigationGroups,
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
              navigationGroups={resolvedNavigationGroups}
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
