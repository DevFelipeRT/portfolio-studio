import type { TemplateFieldPrimitiveType } from '@/Modules/ContentManagement/shared/types/templates';
import type { ComponentType } from 'react';
import {
  ArrayIntegerFieldControl,
  BooleanFieldControl,
  CollectionFieldControl,
  ImageFieldControl,
  ImageGalleryFieldControl,
  IntegerFieldControl,
  RichTextFieldControl,
  TextareaFieldControl,
  TextFieldControl,
} from './controls';
import type { TemplateFieldControlProps } from './types';

type FieldRenderer = ComponentType<TemplateFieldControlProps>;

const fallbackRenderer: FieldRenderer = TextFieldControl;

export const fieldRenderers: Record<TemplateFieldPrimitiveType, FieldRenderer> =
  {
    string: TextFieldControl,
    text: TextareaFieldControl,
    rich_text: RichTextFieldControl,
    boolean: BooleanFieldControl,
    integer: IntegerFieldControl,
    array_integer: ArrayIntegerFieldControl,
    collection: CollectionFieldControl,
    image: ImageFieldControl,
    image_gallery: ImageGalleryFieldControl,
  };

export function getFieldRenderer(
  fieldType: TemplateFieldPrimitiveType | string,
): FieldRenderer {
  return (
    fieldRenderers[fieldType as TemplateFieldPrimitiveType] ?? fallbackRenderer
  );
}
