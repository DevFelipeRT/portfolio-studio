import PublicLayout from '@/Layouts/PublicLayout';
import { defaultSocialLinks } from '@/config/socials';
import { useTranslation } from '@/i18n';
import { Head } from '@inertiajs/react';
import type { SkillGroup } from '@/Modules/Skills/core/types';
import { Course, Experience, Initiative, Project } from '../types';
import {
    ContactSection,
    ExperienceSection,
    HeroSection,
    HighlightsSection,
    ProjectSection,
    TechStackSection,
} from './Sections';
import { EducationSection } from './Sections/EducationSection';
import { InitiativeSection } from './Sections/InitiativeSection';

interface HomeProps {
    projects: Project[];
    experiences: Experience[];
    courses: Course[];
    skills: SkillGroup[];
    initiatives: Initiative[];
}

/**
 * Home renders the public landing page composed of the portfolio sections.
 */
export default function Home({
    projects,
    experiences,
    courses,
    skills,
    initiatives,
}: HomeProps) {
    const hasProjects = projects.length > 0;
    const hasExperiences = experiences.length > 0;
    const hasCourses = courses.length > 0;
    const hasSkills = skills.length > 0;
    const hasInitiatives = initiatives.length > 0;

    const { translate } = useTranslation('home');

    const pageTitle = translate('meta.title', 'Home');
    const mainLabel = translate(
        'landmarks.main',
        'Main content of the portfolio landing page',
    );

    return (
        <PublicLayout>
            <Head title={pageTitle} />

            <main className="text-foreground" aria-label={mainLabel}>
                <div className="overflow-hidden">
                    <div className="space-y-16 md:space-y-20">
                        <HeroSection />
                        <HighlightsSection />

                        {hasSkills && (
                            <TechStackSection groups={skills} />
                        )}

                        {hasProjects && <ProjectSection projects={projects} />}

                        {hasInitiatives && (
                            <InitiativeSection initiatives={initiatives} />
                        )}

                        {hasExperiences && (
                            <ExperienceSection experiences={experiences} />
                        )}

                        {hasCourses && <EducationSection courses={courses} />}

                        <ContactSection socialLinks={defaultSocialLinks} />
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
