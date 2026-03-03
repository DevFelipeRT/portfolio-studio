import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { Project } from '@/modules/projects/core/types';
import type { Skill } from '@/modules/skills/core/types';
import { Head, Link } from '@inertiajs/react';

interface ProjectsIndexProps {
  projects: Project[];
}

export default function Index({ projects }: ProjectsIndexProps) {
  return <ProjectsIndexI18nContent projects={projects} />;
}

function ProjectsIndexI18nContent({ projects }: ProjectsIndexProps) {
  const hasProjects = projects.length > 0;
  const { translate: tSections } = useProjectsTranslation(
    PROJECTS_NAMESPACES.sections,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );

  const skills = (project: Project): Skill[] => {
    return project.skills ?? [];
  };

  const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength - 1)}…`;
  };

  return (
    <AuthenticatedLayout
      header={
        <h1 className="text-xl leading-tight font-semibold">
          {tSections('managementTitle')}
        </h1>
      }
    >
        <Head title="Projects" />

        <div className="overflow-hidden">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-muted-foreground mt-1 text-sm">
                {tForm('help.managementSubtitle')}
              </p>
            </div>

            <Link
              href={route('projects.create')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {tActions('newProject')}
            </Link>
          </div>

          {!hasProjects && (
            <p className="text-muted-foreground text-sm">
              {tForm('emptyState.index')}
            </p>
          )}

          {hasProjects && (
            <div className="bg-card overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                      {tForm('fields.name.label')}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                      {tForm('fields.status.label')}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                      {tForm('fields.display.label')}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                      {tForm('fields.skill_ids.label')}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                      {tForm('fields.updated_at.label')}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                      {tForm('fields.actions.label')}
                    </th>
                  </tr>
                </thead>

              <tbody className="divide-y">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        {truncate(project.summary, 80)}
                      </div>
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs tracking-wide uppercase">
                      {project.status}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs">
                      {project.display ? tActions('yes') : tActions('no')}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs">
                      {skills(project).length === 0 && (
                        <span className="text-muted-foreground/70">
                          {tForm('fields.skill_ids.emptyInline')}
                        </span>
                      )}

                      {skills(project).length > 0 && (
                        <ul className="flex flex-wrap gap-1">
                          {skills(project).map((skill) => (
                            <li
                              key={skill.id}
                              className="bg-muted rounded-full px-2 py-0.5 text-[0.7rem]"
                            >
                              {skill.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs whitespace-nowrap">
                      {project.updated_at ?? '—'}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-3 text-xs">
                        <Link
                          href={route('projects.edit', project.id)}
                          className="text-primary font-medium hover:underline"
                        >
                          {tActions('edit')}
                        </Link>

                        <Link
                          href={route('projects.destroy', project.id)}
                          method="delete"
                          as="button"
                          className="text-destructive font-medium hover:underline"
                        >
                          {tActions('delete')}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}

Index.i18n = ['projects'];
