import type { TemplateFieldPrimitiveType } from '@/Modules/ContentManagement/types/templates';
import type { ComponentType } from 'react';
import type { TemplateFieldControlProps } from '../types';
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
} from './fields';

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
