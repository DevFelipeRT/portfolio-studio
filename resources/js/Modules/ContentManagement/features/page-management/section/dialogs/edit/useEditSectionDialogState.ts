import React from 'react';
import type {
  PageSectionDto,
  SectionData,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { buildInitialSectionData } from '@/Modules/ContentManagement/features/page-rendering';
import type { EditSectionPayload } from './EditSectionDialog';

interface UseEditSectionDialogStateArgs {
  open: boolean;
  section: PageSectionDto | null;
  templates: TemplateDefinitionDto[];
  navigationGroups: string[];
  allowTemplateChange: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: EditSectionPayload) => void;
}

export function useEditSectionDialogState({
  open,
  section,
  templates,
  navigationGroups,
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
  const [selectedTemplateKey, setSelectedTemplateKey] = React.useState<string>('');
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
  const locale = section?.locale ?? null;

  React.useEffect(() => {
    if (!open || !section) {
      return;
    }

    setSelectedTemplateKey(section.template_key);
    setSlot(section.slot ?? '');
    setAnchor(section.anchor ?? '');
    setNavigationLabel(section.navigation_label ?? '');
    setIsActive(section.is_active);
    setData(section.data ?? {});
  }, [open, section]);

  const handleTemplateChange = (nextTemplateKey: string): void => {
    if (!allowTemplateChange) {
      return;
    }

    setSelectedTemplateKey(nextTemplateKey);

    const template = templates.find((item) => item.key === nextTemplateKey);

    if (!template) {
      setData({});
      return;
    }

    setData(buildInitialSectionData(template, { previousData: data }));
  };

  const handleClose = (): void => {
    onOpenChange(false);
  };

  const handleConfirm = (): void => {
    if (!section || !selectedTemplateKey) {
      return;
    }

    onSubmit({
      template_key: selectedTemplateKey,
      slot: slot || null,
      anchor: anchor || null,
      navigation_label: navigationLabel || null,
      is_active: isActive,
      locale,
      data,
    });

    onOpenChange(false);
  };

  return {
    dialogContentRef,
    navigationGroups,
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
    setIsActive,
    setData,
    handleClose,
    handleConfirm,
    handleTemplateChange,
  };
}
