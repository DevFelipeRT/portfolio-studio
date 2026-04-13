import {
  CheckboxField,
  Form,
  FormLocaleField,
  RichTextField,
  SelectField,
  TextareaField,
  TextInputField,
  type FormErrors,
} from '@/common/forms';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectFormData } from '@/modules/projects/admin/management/types';
import type { ProjectImage } from '@/modules/projects/types';
import type { SkillCatalogItem } from '@/modules/skills/core/types';
import React, { type ReactNode } from 'react';

import { getErrorSummaryFields } from './errorSummaryFields';
import { ImagesSection } from './_partials/ImagesSection';
import { SkillsSection } from './_partials/SkillsSection';

export interface ProjectFormProps {
  formId?: string;
  skills: SkillCatalogItem[];
  statusValues: readonly string[];
  existingImages: ProjectImage[];
  data: ProjectFormData;
  errors: FormErrors<keyof ProjectFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  localeDisabled?: boolean;
  localeNote?: string | null;
  projectId?: number;
  children?: ReactNode;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  onChangeField<K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ): void;
  onChangeLocale?(locale: string): void;
  onChangeSkillIds(ids: number[]): void;
  onAddImageRow(): void;
  onRemoveImageRow(index: number): void;
  onUpdateImageAlt(index: number, value: string): void;
  onUpdateImageFile(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void;
}

type ProjectFormSlotProps = {
  children: ReactNode;
};

function ProjectFormHeaderSlot({ children }: ProjectFormSlotProps) {
  return <>{children}</>;
}

function ProjectFormFooterSlot({ children }: ProjectFormSlotProps) {
  return <>{children}</>;
}

type ProjectFormComponent = ((
  props: ProjectFormProps,
) => React.JSX.Element) & {
  Header: typeof ProjectFormHeaderSlot;
  Footer: typeof ProjectFormFooterSlot;
};

/**
 * Reusable project form partial used by both create and edit flows.
 */
const ProjectFormRoot = ({
  formId,
  skills,
  statusValues,
  existingImages,
  data,
  errors,
  processing,
  supportedLocales,
  localeDisabled = false,
  localeNote = null,
  projectId,
  children = null,
  onSubmit,
  onChangeField,
  onChangeLocale,
  onChangeSkillIds,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
}: ProjectFormProps) => {
  const { translate: tSections } = useProjectsTranslation(
    PROJECTS_NAMESPACES.sections,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const statusOptions = statusValues.map((value) => ({
    value,
    label: tForm(`status.${value}`, value),
  }));
  const summaryFields = getErrorSummaryFields(errors, tForm);
  let headerSlot: ReactNode = null;
  let footerSlot: ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === ProjectFormHeaderSlot) {
      headerSlot = child.props.children;
      return;
    }

    if (child.type === ProjectFormFooterSlot) {
      footerSlot = child.props.children;
    }
  });

  return (
    <Form
      id={formId}
      onSubmit={onSubmit}
      errors={errors}
      variant="spacious"
      errorSummaryFields={summaryFields}
    >
      {headerSlot ? (
        <header className="space-y-6">
          <div>{headerSlot}</div>
          <div aria-hidden className="bg-border h-px w-full" />
        </header>
      ) : null}

      <section className="relative space-y-4">
        <div className="space-y-1.5 pr-24 sm:pr-40">
          <h2 className="text-lg font-medium">
            {tSections('basicInformation')}
          </h2>

          {localeNote && (
            <p className="text-muted-foreground text-xs">{localeNote}</p>
          )}
        </div>

        <div className="absolute top-0 right-0 max-w-fit">
          <FormLocaleField
            value={data.locale}
            locales={supportedLocales}
            disabled={processing || localeDisabled}
            errorId="project-locale-error"
            errors={errors as FormErrors<string>}
            onChange={(value) => {
              if (onChangeLocale) {
                onChangeLocale(value);
                return;
              }

              onChangeField('locale', value);
            }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <TextInputField
            name="name"
            id="name"
            value={data.name}
            errors={errors}
            label={tForm('fields.name.label')}
            placeholder={tForm('fields.name.placeholder')}
            required
            className="md:col-span-2"
            onChange={(value) => onChangeField('name', value)}
          />

          <SelectField
            name="status"
            id="status"
            value={data.status}
            errors={errors}
            label={tForm('fields.status.label')}
            required
            className="md:col-span-1"
            placeholder={tForm('fields.status.placeholder')}
            options={statusOptions}
            onChange={(value) => onChangeField('status', value)}
          />
        </div>

        <TextareaField
          name="summary"
          id="summary"
          value={data.summary}
          errors={errors}
          label={tForm('fields.summary.label')}
          placeholder={tForm('fields.summary.placeholder')}
          required
          rows={3}
          onChange={(value) => onChangeField('summary', value)}
        />

        <RichTextField
          name="description"
          id="description"
          value={data.description}
          errors={errors}
          label={tForm('fields.description.label')}
          placeholder={tForm('fields.description.placeholder')}
          required
          onChange={(value) => onChangeField('description', value)}
        />

        <CheckboxField
          name="display"
          id="display"
          value={data.display}
          errors={errors}
          label={tForm('fields.display.label')}
          onChange={(value) => onChangeField('display', value)}
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:items-start">
        <SkillsSection
          skills={skills}
          selectedIds={data.skill_ids}
          errors={errors}
          onChangeSkillIds={onChangeSkillIds}
        />

        <div aria-hidden className="bg-border hidden self-stretch lg:block" />

        <section className="space-y-4">
          <h2 className="text-lg font-medium">{tSections('links')}</h2>

          <div className="grid gap-4">
            <TextInputField
              name="repository_url"
              id="repository_url"
              value={data.repository_url}
              errors={errors}
              label={tForm('fields.repository_url.label')}
              placeholder={tForm('fields.repository_url.placeholder')}
              onChange={(value) => onChangeField('repository_url', value)}
            />

            <TextInputField
              name="live_url"
              id="live_url"
              value={data.live_url}
              errors={errors}
              label={tForm('fields.live_url.label')}
              placeholder={tForm('fields.live_url.placeholder')}
              onChange={(value) => onChangeField('live_url', value)}
            />
          </div>
        </section>
      </div>

      <ImagesSection
        projectId={projectId}
        existingImages={existingImages}
        images={data.images}
        errors={errors}
        onAddImageRow={onAddImageRow}
        onRemoveImageRow={onRemoveImageRow}
        onUpdateImageAlt={onUpdateImageAlt}
        onUpdateImageFile={onUpdateImageFile}
      />
      {footerSlot}
    </Form>
  );
};

export const ProjectForm = Object.assign(ProjectFormRoot, {
  Header: ProjectFormHeaderSlot,
  Footer: ProjectFormFooterSlot,
}) as ProjectFormComponent;
