import { Button } from '@/Components/Ui/button';
import type { Skill, SkillCategory } from '@/Modules/Skills/core/types';
import { SkillsTable } from '@/Modules/Skills/ui/SkillsTable';
import { SkillCategoriesSection } from '@/Modules/Skills/ui/sections/SkillCategoriesSection';
import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

interface SkillsIndexProps {
  skills: Skill[];
  categories: SkillCategory[];
}

export default function Index({ skills, categories }: SkillsIndexProps) {
  const hasSkills = skills.length > 0;

  const handleEdit = (skill: Skill): void => {
    router.get(route('skills.edit', skill.id));
  };

  const handleDelete = (skill: Skill, event?: React.MouseEvent): void => {
    event?.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    router.delete(route('skills.destroy', skill.id));
  };

  return (
    <AuthenticatedLayout
      header={
        <h1 className="text-xl leading-tight font-semibold">Skill catalog</h1>
      }
    >
      <Head title="Skills" />

      <div className="space-y-10 overflow-hidden">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage the reusable skills referenced by your portfolio projects.
            </p>
          </div>

          <Link href={route('skills.create')}>
            <Button size="sm">New skill</Button>
          </Link>
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
      </div>
    </AuthenticatedLayout>
  );
}
