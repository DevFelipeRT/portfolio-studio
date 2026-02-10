import type {
  SectionData,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import React from 'react';
import {
  ActiveToggle,
  AnchorField,
  NavigationFields,
  SlotField,
  TemplateDataForm,
  TemplatePicker,
  TemplateSummary,
} from './partials';

interface ConfigureSectionStepProps {
  idPrefix: string;
  templates: TemplateDefinitionDto[];
  selectedTemplate: TemplateDefinitionDto | undefined;
  selectedTemplateKey: string;
  templatePickerDisabled?: boolean;
  allowedSlots: string[];
  hasSlotOptions: boolean;
  slot: string;
  anchor: string;
  navigationLabel: string;
  navigationGroup: string;
  navigationGroups: string[];
  isActive: boolean;
  data: SectionData;
  dialogContentRef: React.RefObject<HTMLDivElement | null>;
  onTemplateChange: (templateKey: string) => void;
  onSlotChange: (value: string) => void;
  onAnchorChange: (value: string) => void;
  onNavigationLabelChange: (value: string) => void;
  onNavigationGroupChange: (value: string) => void;
  onIsActiveChange: (value: boolean) => void;
  onDataChange: (value: SectionData) => void;
}

export function ConfigureSectionStep({
  idPrefix,
  templates,
  selectedTemplate,
  selectedTemplateKey,
  templatePickerDisabled = false,
  allowedSlots,
  hasSlotOptions,
  slot,
  anchor,
  navigationLabel,
  navigationGroup,
  navigationGroups,
  isActive,
  data,
  dialogContentRef,
  onTemplateChange,
  onSlotChange,
  onAnchorChange,
  onNavigationLabelChange,
  onNavigationGroupChange,
  onIsActiveChange,
  onDataChange,
}: ConfigureSectionStepProps) {
  return (
    <div className="mx-1 my-4 space-y-6">
      {templatePickerDisabled ? (
        selectedTemplate ? (
          <TemplateSummary template={selectedTemplate} />
        ) : (
          <TemplatePicker
            idPrefix={idPrefix}
            templates={templates}
            selectedTemplateKey={selectedTemplateKey}
            disabled
            onTemplateChange={onTemplateChange}
          />
        )
      ) : (
        <TemplatePicker
          idPrefix={idPrefix}
          templates={templates}
          selectedTemplateKey={selectedTemplateKey}
          onTemplateChange={onTemplateChange}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <SlotField
          idPrefix={idPrefix}
          allowedSlots={allowedSlots}
          hasSlotOptions={hasSlotOptions}
          slot={slot}
          onSlotChange={onSlotChange}
        />
        <AnchorField
          idPrefix={idPrefix}
          anchor={anchor}
          onAnchorChange={onAnchorChange}
        />
      </div>

      <NavigationFields
        idPrefix={idPrefix}
        navigationLabel={navigationLabel}
        navigationGroup={navigationGroup}
        navigationGroups={navigationGroups}
        dialogContentRef={dialogContentRef}
        onNavigationLabelChange={onNavigationLabelChange}
        onNavigationGroupChange={onNavigationGroupChange}
      />

      <ActiveToggle
        idPrefix={idPrefix}
        isActive={isActive}
        onIsActiveChange={onIsActiveChange}
      />

      {selectedTemplate && (
        <TemplateDataForm
          template={selectedTemplate}
          data={data}
          onDataChange={onDataChange}
        />
      )}
    </div>
  );
}
