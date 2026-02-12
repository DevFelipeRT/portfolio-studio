import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';

export function getAllowedSlots(
  template: TemplateDefinitionDto | undefined,
): string[] {
  return template?.allowed_slots ?? [];
}

export function getDefaultSlot(
  template: TemplateDefinitionDto | undefined,
): string {
  if (!template || !Array.isArray(template.allowed_slots)) {
    return '';
  }

  return template.allowed_slots[0] ?? '';
}

export function resolveSlotOnTemplateChange(
  previousSlot: string,
  template: TemplateDefinitionDto | undefined,
): string {
  const allowedSlots = template?.allowed_slots;

  // Template without slot restrictions: keep the current value.
  if (!Array.isArray(allowedSlots) || allowedSlots.length === 0) {
    return previousSlot;
  }

  // Preserve if still valid for the new template.
  if (previousSlot && allowedSlots.includes(previousSlot)) {
    return previousSlot;
  }

  // Fall back to the first allowed slot.
  return allowedSlots[0] ?? '';
}
