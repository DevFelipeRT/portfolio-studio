import React from 'react';
import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import { buildSectionPayload, useSectionState } from '../../core';
import type { CreateSectionPayload } from './CreateSectionDialog';

type DialogStep = 'select' | 'configure';

interface UseCreateSectionDialogStateArgs {
  open: boolean;
  templates: TemplateDefinitionDto[];
  defaultLocale: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateSectionPayload) => void;
}

export function useCreateSectionDialogState({
  open,
  templates,
  defaultLocale,
  onOpenChange,
  onSubmit,
}: UseCreateSectionDialogStateArgs) {
  /**
   * Centralized state for the "create section" dialog.
   *
   * Keeps the component (CreateSectionDialog) presentation-oriented by
   * encapsulating step transitions, template filtering, and payload assembly.
   */
  const dialogContentRef = React.useRef<HTMLDivElement | null>(null);
  const [step, setStep] = React.useState<DialogStep>('select');

  const sectionState = useSectionState({ templates });
  const { resetState } = sectionState;

  const handleTemplateChange = (templateKey: string): void => {
    sectionState.handleTemplateChange(templateKey);
  };

  const handleContinue = (): void => {
    if (!sectionState.selectedTemplateKey) {
      return;
    }

    setStep('configure');
  };

  const handleClose = (): void => {
    onOpenChange(false);
  };

  const handleConfirm = (): void => {
    if (!sectionState.selectedTemplateKey) {
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
        locale: defaultLocale ?? null,
      }),
    );

    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) {
      resetState();
      setStep('select');
    }
  }, [open, defaultLocale, resetState]);

  return {
    dialogContentRef,
    step,
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
    setStep,
    handleClose,
    handleContinue,
    handleConfirm,
    handleTemplateChange,
  };
}
