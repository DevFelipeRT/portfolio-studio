import HomeLayout from '@/Layouts/HomeLayout';
import { Head } from '@inertiajs/react';
import { Course, Experience, Project } from '../types';
import {
    ContactSection,
    ExperienceSection,
    HeroSection,
    HighlightsSection,
    ProjectSection,
    TechStackSection,
} from './Sections';
import { EducationSection } from './Sections/EducationSection';

interface HomeProps {
    projects: Project[];
    experiences: Experience[];
    courses: Course[];
}

/**
 * Home renders the public landing page composed of the portfolio sections.
 */
export default function Home({ projects, experiences, courses }: HomeProps) {
    const hasProjects = projects.length > 0;
    const hasExperiences = experiences.length > 0;
    const hasCourses = courses.length > 0;

    return (
        <HomeLayout>
            <Head title="Home" />

            <main className="text-foreground">
                <div className="overflow-hidden">
                    <div className="space-y-16 md:space-y-20">
                        <HeroSection />
                        <HighlightsSection />
                        <TechStackSection />

                        {hasProjects && <ProjectSection projects={projects} />}

                        {hasExperiences && (
                            <ExperienceSection experiences={experiences} />
                        )}

                        {hasCourses && <EducationSection courses={courses} />}

                        <ContactSection />
                    </div>
                </div>
            </main>
        </HomeLayout>
    );
}
