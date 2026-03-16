import { Button } from '@/components/ui/button';
import { PageHead, PageLink, pageRouter } from '@/common/page-runtime';
import type { Skill, SkillCategory } from '@/modules/skills/core/types';
import { SkillsTable } from '@/modules/skills/ui/table/SkillsTable';
import { SkillCategoriesSection } from '@/modules/skills/ui/sections/SkillCategoriesSection';
import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';

interface SkillsIndexProps {
  skills: Skill[];
  categories: SkillCategory[];
}

export default function Index({ skills, categories }: SkillsIndexProps) {
  const hasSkills = skills.length > 0;

  const handleEdit = (skill: Skill): void => {
    pageRouter.get(route('skills.edit', skill.id));
  };

  const handleDelete = (skill: Skill, event?: React.MouseEvent): void => {
    event?.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    pageRouter.delete(route('skills.destroy', skill.id));
  };

  return (
    <AuthenticatedLayout>
      <PageHead title="Skills" />

      <PageContent
        className="space-y-10 overflow-hidden py-8"
        pageWidth="container"
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-xl leading-tight font-semibold">
              Skill catalog
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage the reusable skills referenced by your portfolio
                projects.
              </p>
            </div>

            <PageLink href={route('skills.create')}>
              <Button size="sm">New skill</Button>
            </PageLink>
          </div>
        </div>

        {!hasSkills && (
          <p className="text-muted-foreground text-sm">
            No skills have been created yet.
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
