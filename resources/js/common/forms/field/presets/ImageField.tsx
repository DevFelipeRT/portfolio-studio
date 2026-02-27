'use client';

import { FileInputField } from '@/common/forms/field/presets/FileInputField';
import { TextInputField } from '@/common/forms/field/presets/TextInputField';
import type { FormErrors } from '@/common/forms/types';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';

type ImageFieldProps = {
  index: number;
  errors: FormErrors<string>;
  file?: File | null;
  fileId: string;
  altId: string;
  fileLabel?: ReactNode;
  altLabel?: ReactNode;
  altValue: string;
  required?: boolean;
  accept?: string;
  onFileChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onAltChange(value: string): void;
};

export function ImageField({
  index,
  errors,
  file,
  fileId,
  altId,
  fileLabel = 'Image file',
  altLabel = 'Alt text',
  altValue,
  required = false,
  accept = 'image/*',
  onFileChange,
  onAltChange,
}: ImageFieldProps) {
  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <>
      <div className="space-y-3">
        {previewUrl && (
          <div className="border-border/60 bg-muted/20 h-28 overflow-hidden rounded-md border">
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <FileInputField
          name={`images.${index}.file`}
          id={fileId}
          errors={errors}
          label={fileLabel}
          placeholder="Select file"
          required={required}
          accept={accept}
          errorId={`${fileId}-error`}
          onChange={onFileChange}
        />
      </div>

      <TextInputField
        name={`images.${index}.alt`}
        id={altId}
        value={altValue}
        errors={errors}
        label={altLabel}
        errorId={`${altId}-error`}
        onChange={onAltChange}
      />
    </>
  );
}
