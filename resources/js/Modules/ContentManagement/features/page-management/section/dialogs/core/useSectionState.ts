import React from 'react';
import type { PageSectionDto, SectionData, TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import { getAllowedSlots, resolveSlotOnTemplateChange } from './slots';

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
  const [navigationGroup, setNavigationGroup] = React.useState<string>('');
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [templateData, setTemplateData] = React.useState<SectionData>({});

  const setNavigationGroupValue = React.useCallback((value: string) => {
    setNavigationGroup(value);
  }, []);

  const resetState = React.useCallback(() => {
    setSelectedTemplateKey('');
    setSlot('');
    setAnchor('');
    setNavigationLabel('');
    setNavigationGroup('');
    setIsActive(true);
    setTemplateData({});
  }, []);

  const setFromSection = React.useCallback((section: PageSectionDto) => {
    setSelectedTemplateKey(section.template_key);
    setSlot(section.slot ?? '');
    setAnchor(section.anchor ?? '');
    setNavigationLabel(section.navigation_label ?? '');
    setIsActive(section.is_active);

    const rawData = section.data ?? {};
    const nextNavigationGroup =
      typeof rawData.navigation_group === 'string' ? rawData.navigation_group : '';

    // Remove section-level data from the template form payload.
    const { navigation_group: _ignored, ...nextTemplateData } = rawData;

    setNavigationGroup(nextNavigationGroup);
    setTemplateData(nextTemplateData);
  }, []);

  return {
    selectedTemplateKey,
    slot,
    anchor,
    navigationLabel,
    navigationGroup,
    isActive,
    templateData,
    setSelectedTemplateKey,
    setSlot,
    setAnchor,
    setNavigationLabel,
    setNavigationGroup: setNavigationGroupValue,
    setIsActive,
    setData: setTemplateData,
    resetState,
    setFromSection,
  };
}

export function useSectionState({ templates }: UseSectionStateArgs) {
  const base = useSectionStateBase();
  const {
    setSelectedTemplateKey,
    setData,
    setSlot,
    setNavigationGroup,
    templateData,
    slot,
  } = base;

  const selectedTemplate = React.useMemo(
    () => templates.find((item) => item.key === base.selectedTemplateKey),
    [templates, base.selectedTemplateKey],
  );
  const allowedSlots = React.useMemo(
    () => getAllowedSlots(selectedTemplate),
    [selectedTemplate],
  );
  const hasSlotOptions = allowedSlots.length > 0;

  // Temporary in-dialog persistence to avoid accidental data loss when switching templates.
  // Keeps a full snapshot per template key so switching back restores the previous state.
  const templateDataStashRef = React.useRef<
    Map<string, { templateData: SectionData; navigationGroup: string }>
  >(
    new Map(),
  );

  React.useEffect(() => {
    const key = base.selectedTemplateKey;
    if (!key) {
      return;
    }

    templateDataStashRef.current.set(key, {
      templateData,
      navigationGroup: base.navigationGroup,
    });
  }, [base.navigationGroup, base.selectedTemplateKey, templateData]);

  const buildTemplateChangeWarning = React.useCallback(
    (
      currentTemplate: TemplateDefinitionDto | undefined,
      nextTemplate: TemplateDefinitionDto,
      sourceData: SectionData,
    ): string | null => {
      const nextFieldNames = new Set(nextTemplate.fields.map((f) => f.name));

      const preserved = (key: string): boolean => {
        if (nextFieldNames.has(key)) {
          return true;
        }

        return false;
      };

      const isMeaningfulValue = (value: unknown): boolean => {
        if (value === null || value === undefined) {
          return false;
        }

        if (typeof value === 'string') {
          return value.trim().length > 0;
        }

        if (typeof value === 'number') {
          return Number.isFinite(value);
        }

        if (typeof value === 'boolean') {
          return value === true;
        }

        if (Array.isArray(value)) {
          return value.length > 0;
        }

        if (typeof value === 'object') {
          return Object.keys(value as Record<string, unknown>).length > 0;
        }

        return true;
      };

      const lostKeys = Object.keys(sourceData).filter((key) => {
        if (preserved(key)) {
          return false;
        }

        return isMeaningfulValue((sourceData as Record<string, unknown>)[key]);
      });

      if (lostKeys.length === 0) {
        return null;
      }

      const labelByName = new Map<string, string>();
      currentTemplate?.fields?.forEach((field) => {
        labelByName.set(field.name, field.label);
      });

      const maxShown = 15;
      const shown = lostKeys.slice(0, maxShown);
      const remaining = lostKeys.length - shown.length;

      const lines = [
        'Ao trocar o template, os seguintes campos nao existem no novo template e serao perdidos quando voce salvar:',
        ...shown.map((key) => {
          const label = labelByName.get(key);
          return label ? `- ${label} (${key})` : `- ${key}`;
        }),
      ];

      if (remaining > 0) {
        lines.push(`- ... e mais ${remaining}`);
      }

      lines.push('');
      lines.push('Deseja continuar?');

      return lines.join('\n');
    },
    [],
  );

  const handleTemplateChange = React.useCallback(
    (nextTemplateKey: string, options: TemplateChangeOptions = {}) => {
      const { allowTemplateChange = true } = options;

      if (!allowTemplateChange) {
        return;
      }

      const template = templates.find((item) => item.key === nextTemplateKey);

      if (!template) {
        setData({});
        return;
      }

      if (selectedTemplate && selectedTemplate.key !== template.key) {
        const warning = buildTemplateChangeWarning(
          selectedTemplate,
          template,
          templateData,
        );

        if (warning && !window.confirm(warning)) {
          return;
        }
      }

      setSelectedTemplateKey(nextTemplateKey);
      const stashed = templateDataStashRef.current.get(nextTemplateKey);
      setData(stashed?.templateData ?? templateData);
      setNavigationGroup(stashed?.navigationGroup ?? base.navigationGroup);
      setSlot(resolveSlotOnTemplateChange(slot, template));
    },
    [
      buildTemplateChangeWarning,
      selectedTemplate,
      setData,
      setNavigationGroup,
      setSelectedTemplateKey,
      setSlot,
      slot,
      templateData,
      templates,
    ],
  );

  return {
    selectedTemplate,
    selectedTemplateKey: base.selectedTemplateKey,
    allowedSlots,
    hasSlotOptions,
    slot: base.slot,
    anchor: base.anchor,
    navigationLabel: base.navigationLabel,
    navigationGroup: base.navigationGroup,
    isActive: base.isActive,
    data: base.templateData,
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
