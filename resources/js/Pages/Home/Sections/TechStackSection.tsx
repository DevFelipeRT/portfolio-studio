import { SectionHeader } from '../Partials/SectionHeader';
import { TechnologyBadge } from '../Partials/TechnologyBadge';

/**
 * TechStackSection shows the main technologies used in projects.
 */
export function TechStackSection() {
    const backend = [
        'PHP',
        'Laravel',
        '.NET',
        'C#',
        'SQL Server',
        'PostgreSQL',
    ];
    const frontend = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'];
    const tooling = ['Docker', 'Git', 'GitHub', 'Linux', 'VS Code'];

    return (
        <section
            id="tech-stack"
            className="flex flex-col gap-8 border-t pt-12 md:pt-16"
        >
            <SectionHeader
                eyebrow="Tech stack"
                title="Technologies I work with on a daily basis."
                description="A selection of tools and frameworks that I use to design, build and operate web applications."
                align="left"
            />

            <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold tracking-tight">
                        Back-end
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {backend.map((tech) => (
                            <TechnologyBadge key={tech} label={tech} />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold tracking-tight">
                        Front-end
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {frontend.map((tech) => (
                            <TechnologyBadge key={tech} label={tech} />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold tracking-tight">
                        Tooling
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {tooling.map((tech) => (
                            <TechnologyBadge key={tech} label={tech} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
