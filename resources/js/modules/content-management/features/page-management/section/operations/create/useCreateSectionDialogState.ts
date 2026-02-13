import type { TemplateDefinitionDto } from '@/modules/content-management/types';
import React from 'react';
import { useSectionDialogState } from '../../dialog/state';
import type { CreateSectionPayload } from '../../types';
import { buildSectionPayload } from '../payload';

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

  const sectionDialogState = useSectionDialogState({ templates });
  const { resetState } = sectionDialogState;

  const handleTemplateChange = (templateKey: string): void => {
    sectionDialogState.changeTemplate(templateKey);
  };

  const handleContinue = (): void => {
    if (!sectionDialogState.selectedTemplateKey) {
      return;
    }

    setStep('configure');
  };

  const handleClose = (): void => {
    onOpenChange(false);
  };

  const handleConfirm = (): void => {
    if (!sectionDialogState.selectedTemplateKey) {
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
        locale: defaultLocale ?? null,
        template: sectionDialogState.selectedTemplate ?? null,
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
    setStep,
    handleClose,
    handleContinue,
    handleConfirm,
    handleTemplateChange,
  };
}
