import type {
  PageSectionDto,
  SectionDataValue,
  TemplateDefinitionDto,
  TemplateFieldPrimitiveType,
} from '@/modules/content-management/types';
import type { ComponentRegistryProvider } from '@/modules/content-management/types/provider';
import type { ComponentType } from 'react';

export type SectionRenderModel = Pick<PageSectionDto, 'id' | 'anchor'> & {
  templateKey: string;
};

export type SectionComponentProps = {
  section: SectionRenderModel;
  template?: TemplateDefinitionDto;
  anchorId?: string;
  className?: string;
};

export type SectionComponentRegistry = Record<
  string,
  ComponentType<SectionComponentProps>
>;

export type SectionRegistryProvider =
  ComponentRegistryProvider<SectionComponentRegistry>;

export interface FieldValueResolver {
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
  getFieldValue<TValue = SectionDataValue>(
    fieldName: string,
    expectedType?: TemplateFieldPrimitiveType,
  ): TValue | undefined;
}
