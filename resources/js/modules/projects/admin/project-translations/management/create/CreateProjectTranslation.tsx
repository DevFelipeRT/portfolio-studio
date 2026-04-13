import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FormErrors } from '@/common/forms';
import { createProjectTranslation } from '@/modules/projects/api/translations';
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
import type {
  CreateProjectTranslationDraft,
  ProjectTranslationRecord,
} from '../types';

type CreateProjectTranslationProps = {
  projectId: number;
  availableLocales: readonly string[];
  onCreated: (translation: ProjectTranslationRecord) => void;
  onCancel: () => void;
};

type SubmitError =
  | { kind: 'message'; message: string }
  | { kind: 'translation'; key: string };

function createEmptyFormState(): CreateProjectTranslationDraft {
  return {
    locale: '',
    name: '',
    summary: '',
    description: '',
  };
}

function normalizeText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function toCreatePayload(formState: CreateProjectTranslationDraft) {
  return {
    locale: formState.locale,
    name: normalizeText(formState.name),
    summary: normalizeText(formState.summary),
    description: normalizeText(formState.description),
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
  if (!error || error.kind !== 'translation') {
    return {};
  }

  if (error.key === 'errors.localeRequired') {
    return {
      locale: translate(error.key),
    };
  }

  if (error.key === 'errors.atLeastOne') {
    const message = translate(error.key);

    return {
      name: message,
      summary: message,
      description: message,
    };
  }

  return {};
}

export function CreateProjectTranslation({
  projectId,
  availableLocales,
  onCreated,
  onCancel,
}: CreateProjectTranslationProps) {
  const formId = 'project-translation-add-form';
  const { translate: t } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const [formState, setFormState] =
    React.useState<CreateProjectTranslationDraft>(createEmptyFormState());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<SubmitError | null>(
    null,
  );

  const hasAvailableLocales = availableLocales.length > 0;
  const errorMessage = submitError?.kind === 'message' ? submitError.message : null;
  const fieldErrors = React.useMemo(
    () => getFieldErrors(submitError, t),
    [submitError, t],
  );

  const updateForm = React.useCallback(
    (partial: Partial<CreateProjectTranslationDraft>) => {
      setFormState((current) => ({
        ...current,
        ...partial,
      }));
    },
    [],
  );

  const handleLocaleChange = React.useCallback(
    (locale: string) => {
      updateForm({ locale });
    },
    [updateForm],
  );

  const handleNameChange = React.useCallback(
    (name: string) => {
      updateForm({ name });
    },
    [updateForm],
  );

  const handleSummaryChange = React.useCallback(
    (summary: string) => {
      updateForm({ summary });
    },
    [updateForm],
  );

  const handleDescriptionChange = React.useCallback(
    (description: string) => {
      updateForm({ description });
    },
    [updateForm],
  );

  const handleSubmit = React.useCallback(async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!formState.locale) {
      setSubmitError(createError('errors.localeRequired'));
      return;
    }

    if (
      !hasFormContent({
        name: formState.name,
        summary: formState.summary,
        description: formState.description,
      })
    ) {
      setSubmitError(createError('errors.atLeastOne'));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const createdTranslation = await createProjectTranslation(
        projectId,
        toCreatePayload(formState),
      );

      onCreated(createdTranslation);
    } catch (error) {
      setSubmitError(normalizeError(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, onCreated, projectId]);

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
              title={t('addPanelTitle')}
              editorId="project-translation-add"
              name={formState.name}
              summary={formState.summary}
              description={formState.description}
              errors={fieldErrors}
              disabled={isSubmitting || !hasAvailableLocales}
              onSubmit={handleSubmit}
              onNameChange={handleNameChange}
              onSummaryChange={handleSummaryChange}
              onDescriptionChange={handleDescriptionChange}
              localeField={{
                value: formState.locale,
                availableLocales,
                onChange: handleLocaleChange,
              }}
              footerNote={
                !hasAvailableLocales ? (
                  <p className="text-muted-foreground text-xs leading-5">
                    {t('allCovered')}
                  </p>
                ) : null
              }
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
          <Button
            type="submit"
            form={formId}
            disabled={isSubmitting || !hasAvailableLocales}
          >
            {t('actions.add')}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
