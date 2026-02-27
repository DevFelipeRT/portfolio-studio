import { FieldError, resolveFieldErrorMessage, type FormErrors } from '@/common/forms';
import type { ProjectFormData } from '@/modules/projects/core/forms';
import type { Skill } from '@/modules/skills/core/types';
import { SkillMultiSelect } from '@/modules/skills/ui/SkillMultiSelect';

interface SkillsSectionProps {
  skills: Skill[];
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
  const skillIdsError = resolveFieldErrorMessage(errors, 'skill_ids');

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Skills</h2>

      <div className="bg-background rounded-md">
        {skills.length === 0 && (
          <p className="text-muted-foreground text-sm">No skills available.</p>
        )}

        {skills.length > 0 && (
          <SkillMultiSelect
            skills={skills}
            selectedIds={selectedIds}
            onChangeSelectedIds={onChangeSkillIds}
            otherLabel="Other"
            placeholder="Search and select skills…"
            limit={250}
          />
        )}
      </div>

      <FieldError id="skill-ids-error" message={skillIdsError} />
    </section>
  );
}
