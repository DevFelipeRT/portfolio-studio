import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import React from 'react';
import { useSectionDialogState } from '../../dialog/state';
import type { UpdateSectionPayload as EditSectionPayload } from '../../types';
import { buildSectionPayload } from '../payload';

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
  const sectionDialogState = useSectionDialogState({ templates });
  const { hydrateFromSection } = sectionDialogState;

  const locale = section?.locale ?? null;

  React.useEffect(() => {
    if (!open || !section) {
      return;
    }

    hydrateFromSection(section);
  }, [hydrateFromSection, open, section]);

  const handleTemplateChange = (nextTemplateKey: string): void => {
    sectionDialogState.changeTemplate(nextTemplateKey, { allowTemplateChange });
  };

  const handleClose = (): void => {
    onOpenChange(false);
  };

  const handleConfirm = (): void => {
    if (!section || !sectionDialogState.selectedTemplateKey) {
      return;
    }

    onSubmit(
      buildSectionPayload({
        state: {
          templateKey: sectionDialogState.selectedTemplateKey,
          slot: sectionDialogState.slot,
          anchor: sectionDialogState.anchor,
          navigationLabel: sectionDialogState.navigationLabel,
          navigationGroup: sectionDialogState.navigationGroup,
          isActive: sectionDialogState.isActive,
          templateData: sectionDialogState.templateData,
        },
        locale,
        template: sectionDialogState.selectedTemplate ?? null,
      }),
    );

    onOpenChange(false);
  };

  return {
    dialogContentRef,
    selectedTemplate: sectionDialogState.selectedTemplate,
    selectedTemplateKey: sectionDialogState.selectedTemplateKey,
    allowedSlots: sectionDialogState.allowedSlots,
    hasSlotOptions: sectionDialogState.hasSlotOptions,
    slot: sectionDialogState.slot,
    anchor: sectionDialogState.anchor,
    navigationLabel: sectionDialogState.navigationLabel,
    navigationGroup: sectionDialogState.navigationGroup,
    isActive: sectionDialogState.isActive,
    templateData: sectionDialogState.templateData,
    setSlot: sectionDialogState.setSlot,
    setAnchor: sectionDialogState.setAnchor,
    setNavigationLabel: sectionDialogState.setNavigationLabel,
    setNavigationGroup: sectionDialogState.setNavigationGroup,
    setIsActive: sectionDialogState.setIsActive,
    setTemplateData: sectionDialogState.setTemplateData,
    handleClose,
    handleConfirm,
    handleTemplateChange,
  };
}
