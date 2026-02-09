import React from 'react';
import type {
  SectionData,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { buildInitialSectionData } from '@/Modules/ContentManagement/features/page-rendering';
import type {
  CreateSectionPayload,
  TemplateFilterMode,
} from './CreateSectionDialog';

type DialogStep = 'select' | 'configure';

interface UseCreateSectionDialogStateArgs {
  open: boolean;
  templates: TemplateDefinitionDto[];
  defaultLocale: string | null;
  navigationGroups: string[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateSectionPayload) => void;
}

export function useCreateSectionDialogState({
  open,
  templates,
  defaultLocale,
  navigationGroups,
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
  const [selectedTemplateKey, setSelectedTemplateKey] = React.useState<string>('');
  const [step, setStep] = React.useState<DialogStep>('select');
  const [filterMode, setFilterMode] = React.useState<TemplateFilterMode>('all');
  const [originFilter, setOriginFilter] = React.useState<string>('');
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

  const origins = React.useMemo(() => {
    const unique = new Set<string>();

    templates.forEach((template) => {
      if (template.origin) {
        unique.add(template.origin);
      }
    });

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [templates]);

  const domainOrigins = React.useMemo(
    () => origins.filter((origin) => origin !== 'content-management'),
    [origins],
  );

  const visibleTemplates = React.useMemo(() => {
    if (filterMode === 'generic') {
      return templates.filter(
        (template) => template.origin === 'content-management',
      );
    }

    if (filterMode === 'domain') {
      const candidates = templates.filter(
        (template) => template.origin !== 'content-management',
      );

      if (!originFilter) {
        return candidates;
      }

      return candidates.filter((template) => template.origin === originFilter);
    }

    if (originFilter) {
      return templates.filter((template) => template.origin === originFilter);
    }

    return templates;
  }, [filterMode, originFilter, templates]);

  const handleTemplateChange = (templateKey: string): void => {
    setSelectedTemplateKey(templateKey);

    const template = templates.find((item) => item.key === templateKey);

    if (!template) {
      setData({});
      return;
    }

    setData(buildInitialSectionData(template, { previousData: data }));

    if (
      Array.isArray(template.allowed_slots) &&
      template.allowed_slots.length > 0
    ) {
      setSlot(template.allowed_slots[0] ?? '');
    }
  };

  const handleFilterModeChange = (mode: TemplateFilterMode): void => {
    setFilterMode(mode);

    if (mode === 'generic') {
      setOriginFilter('');
    }
  };

  const handleContinue = (): void => {
    if (!selectedTemplateKey) {
      return;
    }

    setStep('configure');
  };

  const handleClose = (): void => {
    onOpenChange(false);
  };

  const handleConfirm = (): void => {
    if (!selectedTemplateKey) {
      return;
    }

    onSubmit({
      template_key: selectedTemplateKey,
      slot: slot || null,
      anchor: anchor || null,
      navigation_label: navigationLabel || null,
      is_active: isActive,
      locale: defaultLocale ?? null,
      data,
    });

    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedTemplateKey('');
      setStep('select');
      setFilterMode('all');
      setOriginFilter('');
      setSlot('');
      setAnchor('');
      setNavigationLabel('');
      setIsActive(true);
      setData({});
    }
  }, [open, defaultLocale]);

  return {
    dialogContentRef,
    navigationGroups,
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
  };
}
