import {
  Form,
  RichTextField,
  SelectField,
  TextareaField,
  TextInputField,
  collectErroredFieldLabels,
  type FormErrors,
} from '@/common/forms';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type React from 'react';
import type { ReactNode } from 'react';

export type ProjectTranslationFormFieldName =
  | 'locale'
  | 'name'
  | 'summary'
  | 'description';

type ProjectTranslationFormProps = {
  formId: string;
  title: string;
  editorId: string;
  name: string;
  summary: string;
  description: string;
  errors: FormErrors<ProjectTranslationFormFieldName>;
  disabled?: boolean;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  onNameChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  localeField?: {
    value: string;
    availableLocales: readonly string[];
    onChange: (locale: string) => void;
  };
  footerNote?: ReactNode;
};

export function ProjectTranslationForm({
  formId,
  title,
  editorId,
  name,
  summary,
  description,
  errors,
  disabled = false,
  onSubmit,
  onNameChange,
  onSummaryChange,
  onDescriptionChange,
  localeField,
  footerNote = null,
}: ProjectTranslationFormProps) {
  const { translate: t } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const localeOptions = localeField?.availableLocales.map((locale) => ({
    value: locale,
    label: locale,
  }));
  const errorSummaryFields = collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale') },
    { name: 'name', label: t('fields.name') },
    { name: 'summary', label: t('fields.summary') },
    { name: 'description', label: t('fields.description') },
  ] as const);

  return (
    <Form<ProjectTranslationFormFieldName>
      id={formId}
      onSubmit={onSubmit}
      errors={errors}
      errorSummaryFields={errorSummaryFields}
      className="space-y-5 rounded-none border-0 bg-transparent p-0 shadow-none"
    >
      <div className="space-y-1">
        <h3 className="text-base font-semibold leading-6 tracking-tight">
          {title}
        </h3>
      </div>

      <div
        className={
          localeField && localeOptions
            ? 'grid gap-4 md:grid-cols-[12rem_minmax(0,1fr)]'
            : 'grid gap-4'
        }
      >
        {localeField && localeOptions ? (
          <SelectField
            name="locale"
            id={`${formId}-locale`}
            value={localeField.value}
            errors={errors}
            label={t('fields.locale')}
            required
            placeholder={t('placeholders.locale')}
            disabled={disabled}
            options={localeOptions}
            onChange={localeField.onChange}
          />
        ) : null}

        <TextInputField
          name="name"
          id={`${formId}-name`}
          value={name}
          errors={errors}
          label={t('fields.name')}
          placeholder={t('placeholders.name')}
          disabled={disabled}
          onChange={onNameChange}
        />
      </div>

      <TextareaField
        name="summary"
        id={`${formId}-summary`}
        value={summary}
        errors={errors}
        label={t('fields.summary')}
        placeholder={t('placeholders.summary')}
        disabled={disabled}
        rows={3}
        onChange={onSummaryChange}
      />

      <RichTextField
        name="description"
        id={editorId}
        value={description}
        errors={errors}
        label={t('fields.description')}
        placeholder={t('placeholders.description')}
        disabled={disabled}
        onChange={onDescriptionChange}
      />

      {footerNote}
    </Form>
  );
}
