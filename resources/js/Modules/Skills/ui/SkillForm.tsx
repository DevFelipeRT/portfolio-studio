// resources/js/Pages/Skills/Partials/SkillForm.tsx

import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/Ui/select';
import type { SkillCategory } from '@/Modules/Skills/core/types';
import type { SkillFormData } from '@/Modules/Skills/core/forms';
import { Link } from '@inertiajs/react';
import React, { JSX } from 'react';

type SkillFormErrors = Record<string, string | string[] | undefined>;

type SkillFormAlignment = 'right' | 'split';

interface SkillFormProps {
  data: SkillFormData;
  errors: SkillFormErrors;
  categories: SkillCategory[];
  processing: boolean;
  onChange(field: keyof SkillFormData, value: string | number | ''): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  cancelHref: string;
  submitLabel: string;
  deleteHref?: string;
  deleteLabel?: string;
  alignActions?: SkillFormAlignment;
}

/**
 * SkillForm renders the reusable skill form fields and actions.
 */
export function SkillForm({
  data,
  errors,
  categories,
  processing,
  onChange,
  onSubmit,
  cancelHref,
  submitLabel,
  deleteHref,
  deleteLabel = 'Delete',
  alignActions = 'right',
}: SkillFormProps) {
  const normalizeError = (
    message: string | string[] | undefined,
  ): string | null => {
    if (!message) {
      return null;
    }

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    return message;
  };

  const renderActionsRight = (): JSX.Element => (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Cancel
      </Link>

      <Button type="submit" disabled={processing}>
        {submitLabel}
      </Button>
    </div>
  );

  const renderActionsSplit = (): JSX.Element => (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={cancelHref}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Cancel
      </Link>

      <div className="flex items-center gap-3">
        {deleteHref && (
          <Link
            href={deleteHref}
            method="delete"
            as="button"
            className="text-destructive text-sm hover:underline"
          >
            {deleteLabel}
          </Link>
        )}

        <Button type="submit" disabled={processing}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(event) => onChange('name', event.target.value)}
          autoFocus
        />
        {errors.name && (
          <p className="text-destructive text-sm">
            {normalizeError(errors.name as string | string[])}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>

        <Select
          value={
            data.skill_category_id === '' ? '' : String(data.skill_category_id)
          }
          onValueChange={(value) =>
            onChange('skill_category_id', value === '' ? '' : Number(value))
          }
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="">Uncategorized</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.skill_category_id && (
          <p className="text-destructive text-sm">
            {normalizeError(errors.skill_category_id as string | string[])}
          </p>
        )}
      </div>

      {alignActions === 'split' ? renderActionsSplit() : renderActionsRight()}
    </form>
  );
}
