import React from 'react';
import type { PageSectionDto, SectionData, TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import { buildInitialSectionData } from '@/Modules/ContentManagement/features/page-rendering';
import {
  getAllowedSlots,
  getNavigationGroup,
  resolveSlotOnTemplateChange,
} from './rules';

interface UseSectionStateArgs {
  templates: TemplateDefinitionDto[];
}

interface TemplateChangeOptions {
  allowTemplateChange?: boolean;
}

function useSectionStateBase() {
  const [selectedTemplateKey, setSelectedTemplateKey] = React.useState<string>('');
  const [slot, setSlot] = React.useState<string>('');
  const [anchor, setAnchor] = React.useState<string>('');
  const [navigationLabel, setNavigationLabel] = React.useState<string>('');
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [data, setData] = React.useState<SectionData>({});

  const setNavigationGroup = React.useCallback((value: string) => {
    setData((previous) => ({
      ...previous,
      navigation_group: value,
    }));
  }, []);

  const resetState = React.useCallback(() => {
    setSelectedTemplateKey('');
    setSlot('');
    setAnchor('');
    setNavigationLabel('');
    setIsActive(true);
    setData({});
  }, []);

  const setFromSection = React.useCallback((section: PageSectionDto) => {
    setSelectedTemplateKey(section.template_key);
    setSlot(section.slot ?? '');
    setAnchor(section.anchor ?? '');
    setNavigationLabel(section.navigation_label ?? '');
    setIsActive(section.is_active);
    setData(section.data ?? {});
  }, []);

  return {
    selectedTemplateKey,
    slot,
    anchor,
    navigationLabel,
    isActive,
    data,
    setSelectedTemplateKey,
    setSlot,
    setAnchor,
    setNavigationLabel,
    setNavigationGroup,
    setIsActive,
    setData,
    resetState,
    setFromSection,
  };
}

export function useSectionState({ templates }: UseSectionStateArgs) {
  const base = useSectionStateBase();
  const { setSelectedTemplateKey, setData, setSlot, data, slot } = base;

  const selectedTemplate = React.useMemo(
    () => templates.find((item) => item.key === base.selectedTemplateKey),
    [templates, base.selectedTemplateKey],
  );
  const allowedSlots = React.useMemo(
    () => getAllowedSlots(selectedTemplate),
    [selectedTemplate],
  );
  const hasSlotOptions = allowedSlots.length > 0;
  const navigationGroup = React.useMemo(
    () => getNavigationGroup(base.data),
    [base.data],
  );

  const handleTemplateChange = React.useCallback(
    (nextTemplateKey: string, options: TemplateChangeOptions = {}) => {
      const { allowTemplateChange = true } = options;

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
      setSlot(resolveSlotOnTemplateChange(slot, template));
    },
    [data, setData, setSelectedTemplateKey, setSlot, slot, templates],
  );

  return {
    selectedTemplate,
    selectedTemplateKey: base.selectedTemplateKey,
    allowedSlots,
    hasSlotOptions,
    slot: base.slot,
    anchor: base.anchor,
    navigationLabel: base.navigationLabel,
    navigationGroup,
    isActive: base.isActive,
    data: base.data,
    setSelectedTemplateKey: base.setSelectedTemplateKey,
    setSlot: base.setSlot,
    setAnchor: base.setAnchor,
    setNavigationLabel: base.setNavigationLabel,
    setNavigationGroup: base.setNavigationGroup,
    setIsActive: base.setIsActive,
    setData: base.setData,
    resetState: base.resetState,
    setFromSection: base.setFromSection,
    handleTemplateChange,
  };
}
