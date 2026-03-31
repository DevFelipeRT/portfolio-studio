import { FieldError, resolveFieldErrorMessage, type FormErrors } from '@/common/forms';
import type { ProjectFormData } from '@/modules/projects/core/forms';
import { useProjectsTranslation, PROJECTS_NAMESPACES } from '@/modules/projects/i18n';
import type { SkillCatalogItem } from '@/modules/skills/core/types';
import { SkillMultiSelect } from '@/modules/skills/ui/SkillMultiSelect';

interface SkillsSectionProps {
  skills: SkillCatalogItem[];
  selectedIds: number[];
  errors: FormErrors<keyof ProjectFormData>;
  onChangeSkillIds(ids: number[]): void;
}

export function SkillsSection({
  skills,
  selectedIds,
  errors,
  onChangeSkillIds,
}: SkillsSectionProps) {
  const { translate: tSections } = useProjectsTranslation(
    PROJECTS_NAMESPACES.sections,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const skillIdsError = resolveFieldErrorMessage(errors, 'skill_ids');

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">{tSections('skills')}</h2>

      <div className="bg-background rounded-md">
        {skills.length === 0 && (
          <p className="text-muted-foreground text-sm">
            {tForm('fields.skill_ids.empty')}
          </p>
        )}

        {skills.length > 0 && (
          <SkillMultiSelect
            skills={skills}
            selectedIds={selectedIds}
            onChangeSelectedIds={onChangeSkillIds}
            otherLabel={tForm('fields.skill_ids.otherLabel')}
            placeholder={tForm('fields.skill_ids.placeholder')}
            limit={250}
          />
        )}
      </div>

      <FieldError id="skill-ids-error" message={skillIdsError} />
    </section>
  );
}
