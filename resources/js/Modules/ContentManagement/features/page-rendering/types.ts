import type {
  PageSectionDto,
  SectionDataValue,
  TemplateDefinitionDto,
  TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/types';
import type { ComponentType } from 'react';

export type SectionComponentProps = {
  section: PageSectionDto;
  template?: TemplateDefinitionDto;
  anchorId?: string;
  className?: string;
};

export type SectionComponentRegistry = Record<
  string,
  ComponentType<SectionComponentProps>
>;

export type SectionRegistryProvider = {
  getSectionRegistry(): SectionComponentRegistry;
};

export interface SectionFieldResolver {
  /**
   * Returns the resolved and normalized value for a given field name.
   *
   * Resolution rules:
   * - Non-empty values from section data have highest precedence.
   * - If section data does not provide a usable value, template defaults are used.
   * - Empty or whitespace-only strings are treated as "no value" to allow fallbacks.
   * - Null and undefined are treated as "no value".
   * - When a primitive type is available (or provided), normalization is applied.
   */
  getValue<TValue = SectionDataValue>(
    fieldName: string,
    expectedType?: TemplateFieldPrimitiveType,
  ): TValue | undefined;
}