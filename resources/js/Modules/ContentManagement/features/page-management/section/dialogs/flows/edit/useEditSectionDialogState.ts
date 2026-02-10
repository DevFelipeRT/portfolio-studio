import React from 'react';
import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { buildSectionPayload, useSectionState } from '../../core';
import type { EditSectionPayload } from './EditSectionDialog';

interface UseEditSectionDialogStateArgs {
  open: boolean;
  section: PageSectionDto | null;
  templates: TemplateDefinitionDto[];
  allowTemplateChange: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: EditSectionPayload) => void;
}

export function useEditSectionDialogState({
  open,
  section,
  templates,
  allowTemplateChange,
  onOpenChange,
  onSubmit,
}: UseEditSectionDialogStateArgs) {
  /**
   * Centralized state for the "edit section" dialog.
   *
   * Responsible for hydrating dialog state from the selected section, managing
   * edits, and assembling the submission payload.
   */
  const dialogContentRef = React.useRef<HTMLDivElement | null>(null);
  const sectionState = useSectionState({ templates });
  const { setFromSection } = sectionState;

  const locale = section?.locale ?? null;

  React.useEffect(() => {
    if (!open || !section) {
      return;
    }

    setFromSection(section);
  }, [open, section, setFromSection]);

  const handleTemplateChange = (nextTemplateKey: string): void => {
    sectionState.handleTemplateChange(nextTemplateKey, { allowTemplateChange });
  };

  const handleClose = (): void => {
    onOpenChange(false);
  };

  const handleConfirm = (): void => {
    if (!section || !sectionState.selectedTemplateKey) {
      return;
    }

    onSubmit(
      buildSectionPayload({
        state: {
          templateKey: sectionState.selectedTemplateKey,
          slot: sectionState.slot,
          anchor: sectionState.anchor,
          navigationLabel: sectionState.navigationLabel,
          isActive: sectionState.isActive,
          data: sectionState.data,
        },
        locale,
      }),
    );

    onOpenChange(false);
  };

  return {
    dialogContentRef,
    selectedTemplate: sectionState.selectedTemplate,
    selectedTemplateKey: sectionState.selectedTemplateKey,
    allowedSlots: sectionState.allowedSlots,
    hasSlotOptions: sectionState.hasSlotOptions,
    slot: sectionState.slot,
    anchor: sectionState.anchor,
    navigationLabel: sectionState.navigationLabel,
    navigationGroup: sectionState.navigationGroup,
    isActive: sectionState.isActive,
    data: sectionState.data,
    setSlot: sectionState.setSlot,
    setAnchor: sectionState.setAnchor,
    setNavigationLabel: sectionState.setNavigationLabel,
    setNavigationGroup: sectionState.setNavigationGroup,
    setIsActive: sectionState.setIsActive,
    setData: sectionState.setData,
    handleClose,
    handleConfirm,
    handleTemplateChange,
  };
}
