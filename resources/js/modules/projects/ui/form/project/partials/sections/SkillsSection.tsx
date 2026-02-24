import { FieldError, resolveFieldErrorMessage, type FormErrors } from '@/common/forms';
import type { ProjectFormData } from '@/modules/projects/core/forms';
import type { Skill } from '@/modules/skills/core/types';

interface SkillsSectionProps {
  skills: Skill[];
  selectedIds: number[];
  errors: FormErrors<keyof ProjectFormData>;
  onToggleSkill(id: number): void;
}

export function SkillsSection({
  skills,
  selectedIds,
  errors,
  onToggleSkill,
}: SkillsSectionProps) {
  const skillIdsError = resolveFieldErrorMessage(errors, 'skill_ids');

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">Skills</h2>

      <div className="bg-background rounded-md border p-4">
        {skills.length === 0 && (
          <p className="text-muted-foreground text-sm">No skills available.</p>
        )}

        {skills.length > 0 && (
          <div className="grid gap-2 md:grid-cols-3">
            {skills.map((skill) => {
              const checked = selectedIds.includes(skill.id);

              return (
                <label
                  key={skill.id}
                  className="bg-card flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm"
                >
                  <input
                    type="checkbox"
                    className="border-muted-foreground h-4 w-4 rounded"
                    checked={checked}
                    onChange={() => onToggleSkill(skill.id)}
                  />
                  <span>{skill.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <FieldError id="skill-ids-error" message={skillIdsError} />
    </section>
  );
}

