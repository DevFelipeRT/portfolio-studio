import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FormErrors } from '@/common/forms';
import { updateProjectTranslation } from '@/modules/projects/api/translations';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import React from 'react';
import {
  hasFormContent,
  ProjectTranslationForm,
  type ProjectTranslationFormFieldName,
} from '../_form';
import { toEditProjectTranslationDraft } from './draft';
import type {
  EditProjectTranslationDraft,
  ProjectTranslationRecord,
} from '../types';

type EditProjectTranslationProps = {
  projectId: number;
  translation: ProjectTranslationRecord;
  onSaved: (translation: ProjectTranslationRecord) => void;
  onCancel: () => void;
};

type SubmitError =
  | { kind: 'message'; message: string }
  | { kind: 'translation'; key: string };

function normalizeText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function toUpdatePayload(draft: EditProjectTranslationDraft) {
  return {
    name: normalizeText(draft.name),
    summary: normalizeText(draft.summary),
    description: normalizeText(draft.description),
  };
}

function createError(key: string): SubmitError {
  return { kind: 'translation', key };
}

function normalizeError(
  error: unknown,
  fallbackKey = 'errors.unexpected',
): SubmitError {
  if (typeof error === 'string' && error.trim() !== '') {
    return { kind: 'message', message: error };
  }

  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;

  if (typeof message === 'string' && message.trim() !== '') {
    return { kind: 'message', message };
  }

  return createError(fallbackKey);
}

function getFieldErrors(
  error: SubmitError | null,
  translate: (key: string) => string,
): FormErrors<ProjectTranslationFormFieldName> {
  if (!error || error.kind !== 'translation' || error.key !== 'errors.atLeastOne') {
    return {};
  }

  const message = translate(error.key);

  return {
    name: message,
    summary: message,
    description: message,
  };
}

export function EditProjectTranslation({
  projectId,
  translation,
  onSaved,
  onCancel,
}: EditProjectTranslationProps) {
  const formId = `project-translation-${translation.locale}-form`;
  const { translate: t } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const [draft, setDraft] = React.useState<EditProjectTranslationDraft>(() =>
    toEditProjectTranslationDraft(translation),
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<SubmitError | null>(
    null,
  );
  const errorMessage = submitError?.kind === 'message' ? submitError.message : null;
  const fieldErrors = React.useMemo(
    () => getFieldErrors(submitError, t),
    [submitError, t],
  );

  React.useEffect(() => {
    setDraft(toEditProjectTranslationDraft(translation));
    setSubmitError(null);
  }, [translation]);

  const handleNameChange = React.useCallback((name: string) => {
    setDraft((current) => ({ ...current, name }));
  }, []);

  const handleSummaryChange = React.useCallback((summary: string) => {
    setDraft((current) => ({ ...current, summary }));
  }, []);

  const handleDescriptionChange = React.useCallback((description: string) => {
    setDraft((current) => ({ ...current, description }));
  }, []);

  const handleSubmit = React.useCallback(async (event?: React.FormEvent) => {
    event?.preventDefault();

    const { name, summary, description } = draft;

    if (!hasFormContent({ name, summary, description })) {
      setSubmitError(createError('errors.atLeastOne'));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updatedTranslation = await updateProjectTranslation(
        projectId,
        translation.locale,
        toUpdatePayload(draft),
      );

      onSaved(updatedTranslation);
    } catch (error) {
      setSubmitError(normalizeError(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, onSaved, projectId, translation.locale]);

  return (
    <>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 px-6 py-4">
          {errorMessage ? (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border px-3 py-2 text-sm">
              {errorMessage}
            </div>
          ) : null}

          <div className="px-1 pb-1">
            <ProjectTranslationForm
              formId={formId}
              title={t('editPanelTitle', { locale: translation.locale })}
              editorId={`project-translation-${translation.locale}`}
              name={draft.name}
              summary={draft.summary}
              description={draft.description}
              errors={fieldErrors}
              disabled={isSubmitting}
              onSubmit={handleSubmit}
              onNameChange={handleNameChange}
              onSummaryChange={handleSummaryChange}
              onDescriptionChange={handleDescriptionChange}
            />
          </div>
        </div>
      </ScrollArea>

      <DialogFooter className="space-y-2 border-t px-6 py-4">
        <div className="xs:flex-row xs:items-center xs:justify-end flex flex-col gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('actions.cancel')}
          </Button>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {t('actions.save')}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
