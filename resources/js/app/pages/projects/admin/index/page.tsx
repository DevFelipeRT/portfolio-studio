import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import type { Project } from '@/Modules/Projects/core/types';
import type { Skill } from '@/Modules/Skills/core/types';
import { Head, Link } from '@inertiajs/react';

interface ProjectsIndexProps {
  projects: Project[];
}

export default function Index({ projects }: ProjectsIndexProps) {
  const hasProjects = projects.length > 0;

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
          Project management
        </h1>
      }
    >
      <Head title="Projects" />

      <div className="overflow-hidden">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage the projects displayed on your portfolio landing page.
            </p>
          </div>

          <Link
            href={route('projects.create')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            New project
          </Link>
        </div>

        {!hasProjects && (
          <p className="text-muted-foreground text-sm">
            No projects have been created yet.
          </p>
        )}

        {hasProjects && (
          <div className="bg-card overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    Name
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    Status
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    Display on landing
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    Skills
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    Updated at
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                    Actions
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
                      {project.display ? 'Yes' : 'No'}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs">
                      {skills(project).length === 0 && (
                        <span className="text-muted-foreground/70">
                          No skills
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
                          Edit
                        </Link>

                        <Link
                          href={route('projects.destroy', project.id)}
                          method="delete"
                          as="button"
                          className="text-destructive font-medium hover:underline"
                        >
                          Delete
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
