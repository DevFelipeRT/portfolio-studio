import { ImageField, type FormErrors } from '@/common/forms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ProjectFormData } from '@/modules/projects/admin/management/types';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type React from 'react';

interface SelectImageCardProps {
  index: number;
  image: ProjectFormData['images'][number];
  errors: FormErrors<string>;
  onFileChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onAltChange(value: string): void;
  onRemove(): void;
}

export function SelectImageCard({
  index,
  image,
  errors,
  onFileChange,
  onAltChange,
  onRemove,
}: SelectImageCardProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const hasPreview = Boolean(image.file);

  return (
    <Card
      className={cn(
        'border-border/70 focus-within:ring-ring/50 flex flex-col rounded-lg shadow-sm transition-[min-height,box-shadow] focus-within:ring-1 hover:shadow',
        hasPreview ? 'min-h-[20rem]' : 'min-h-[14rem]',
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-4 p-4">
        <ImageField
          index={index}
          errors={errors}
          file={image.file ?? null}
          fileId={`image-file-${index}`}
          altId={`image-alt-${index}`}
          fileLabel={tForm('fields.images.fileLabel')}
          altLabel={tForm('fields.images.altLabel')}
          filePlaceholder={tForm('fields.images.filePlaceholder')}
          altPlaceholder={tForm('fields.images.altPlaceholder')}
          altValue={image.alt ?? ''}
          required
          onFileChange={onFileChange}
          onAltChange={onAltChange}
        />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            {tActions('remove')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
