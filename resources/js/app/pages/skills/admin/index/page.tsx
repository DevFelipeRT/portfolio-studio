import { Button } from '@/components/ui/button';
import { PageHead, PageLink, pageRouter } from '@/common/page-runtime';
import type { Skill, SkillCategory } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillsTable } from '@/modules/skills/ui/table/SkillsTable';
import { SkillCategoriesSection } from '@/modules/skills/ui/sections/SkillCategoriesSection';
import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';

interface SkillsIndexProps {
  skills: Skill[];
  categories: SkillCategory[];
}

export default function Index({ skills, categories }: SkillsIndexProps) {
  const { translate: tActions } = useSkillsTranslation(SKILLS_NAMESPACES.actions);
  const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
  const { translate: tSections } = useSkillsTranslation(
    SKILLS_NAMESPACES.sections,
  );
  const hasSkills = skills.length > 0;

  const handleEdit = (skill: Skill): void => {
    pageRouter.get(route('skills.edit', skill.id));
  };

  const handleDelete = (skill: Skill, event?: React.MouseEvent): void => {
    event?.stopPropagation();

    if (!window.confirm(tActions('delete'))) {
      return;
    }

    pageRouter.delete(route('skills.destroy', skill.id));
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tSections('managementTitle')} />

      <PageContent
        className="space-y-10 overflow-hidden py-8"
        pageWidth="container"
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-xl leading-tight font-semibold">
              {tSections('managementTitle')}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-muted-foreground mt-1 text-sm">
                {tForm('help.managementSubtitle')}
              </p>
            </div>

            <PageLink href={route('skills.create')}>
              <Button size="sm">{tActions('newSkill')}</Button>
            </PageLink>
          </div>
        </div>

        {!hasSkills && (
          <p className="text-muted-foreground text-sm">
            {tForm('emptyState.skills')}
          </p>
        )}

        {hasSkills && (
          <SkillsTable
            items={skills}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <SkillCategoriesSection categories={categories} />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Index.i18n = ['skills'];
