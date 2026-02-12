import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { SelectableInput } from '@/Components/Ui/selectable-input';
import React from 'react';

interface NavigationFieldsProps {
  idPrefix: string;
  navigationLabel: string;
  navigationGroup: string;
  navigationGroups: string[];
  dialogContentRef: React.RefObject<HTMLDivElement | null>;
  onNavigationLabelChange: (value: string) => void;
  onNavigationGroupChange: (value: string) => void;
}

export function NavigationFields({
  idPrefix,
  navigationLabel,
  navigationGroup,
  navigationGroups,
  dialogContentRef,
  onNavigationLabelChange,
  onNavigationGroupChange,
}: NavigationFieldsProps) {
  const labelId = `${idPrefix}-navigation-label`;
  const groupId = `${idPrefix}-navigation-group`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor={labelId}>Navigation label</Label>
        <Input
          id={labelId}
          value={navigationLabel}
          onChange={(event) => onNavigationLabelChange(event.target.value)}
          placeholder="Highlights"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={groupId}>Navigation group</Label>
        <SelectableInput
          id={groupId}
          value={navigationGroup}
          onChange={onNavigationGroupChange}
          placeholder="About"
          options={navigationGroups.map((group) => ({
            value: group,
          }))}
          emptyLabel="No groups yet"
          portalContainer={dialogContentRef}
        />
      </div>
    </div>
  );
}
