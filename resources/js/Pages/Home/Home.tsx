import HomeLayout from '@/Layouts/HomeLayout';
import { useTranslation } from '@/i18n';
import { Head } from '@inertiajs/react';
import {
    Course,
    Experience,
    Initiative,
    Project,
    TechnologyGroup,
} from '../types';
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
import { defaultSocialLinks } from '@/config/socials';

interface HomeProps {
    projects: Project[];
    experiences: Experience[];
    courses: Course[];
    technologies: TechnologyGroup[];
    initiatives: Initiative[];
}

/**
 * Home renders the public landing page composed of the portfolio sections.
 */
export default function Home({
    projects,
    experiences,
    courses,
    technologies,
    initiatives,
}: HomeProps) {
    const hasProjects = projects.length > 0;
    const hasExperiences = experiences.length > 0;
    const hasCourses = courses.length > 0;
    const hasTechnologies = technologies.length > 0;
    const hasInitiatives = initiatives.length > 0;

    const { translate } = useTranslation('home');

    const pageTitle = translate('meta.title', 'Home');
    const mainLabel = translate(
        'landmarks.main',
        'Main content of the portfolio landing page',
    );

    return (
        <HomeLayout>
            <Head title={pageTitle} />

            <main className="text-foreground" aria-label={mainLabel}>
                <div className="overflow-hidden">
                    <div className="space-y-16 md:space-y-20">
                        <HeroSection />
                        <HighlightsSection />

                        {hasTechnologies && (
                            <TechStackSection groups={technologies} />
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
        </HomeLayout>
    );
}
