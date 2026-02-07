import type {
  SectionData,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/core/types';
import { ActiveToggle } from '@/Modules/ContentManagement/ui/admin/PageEdit/CreateSection/steps/Configure/components/ActiveToggle';
import { AnchorField } from '@/Modules/ContentManagement/ui/admin/PageEdit/CreateSection/steps/Configure/components/AnchorField';
import { NavigationFields } from '@/Modules/ContentManagement/ui/admin/PageEdit/CreateSection/steps/Configure/components/NavigationFields';
import { SlotField } from '@/Modules/ContentManagement/ui/admin/PageEdit/CreateSection/steps/Configure/components/SlotField';
import { TemplateDataForm } from '@/Modules/ContentManagement/ui/admin/PageEdit/CreateSection/steps/Configure/components/TemplateDataForm';
import { TemplatePicker } from '@/Modules/ContentManagement/ui/admin/PageEdit/CreateSection/steps/Configure/components/TemplatePicker';
import React from 'react';

interface ConfigureStepProps {
  templates: TemplateDefinitionDto[];
  selectedTemplate: TemplateDefinitionDto | undefined;
  selectedTemplateKey: string;
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

export function ConfigureStep({
  templates,
  selectedTemplate,
  selectedTemplateKey,
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
}: ConfigureStepProps) {
  return (
    <div className="mx-1 my-4 space-y-6">
      <TemplatePicker
        templates={templates}
        selectedTemplateKey={selectedTemplateKey}
        onTemplateChange={onTemplateChange}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SlotField
          allowedSlots={allowedSlots}
          hasSlotOptions={hasSlotOptions}
          slot={slot}
          onSlotChange={onSlotChange}
        />
        <AnchorField anchor={anchor} onAnchorChange={onAnchorChange} />
      </div>

      <NavigationFields
        navigationLabel={navigationLabel}
        navigationGroup={navigationGroup}
        navigationGroups={navigationGroups}
        dialogContentRef={dialogContentRef}
        onNavigationLabelChange={onNavigationLabelChange}
        onNavigationGroupChange={onNavigationGroupChange}
      />

      <ActiveToggle isActive={isActive} onIsActiveChange={onIsActiveChange} />

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
