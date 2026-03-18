import type { SectionLayoutOptions } from '../../types';

const defaultSectionLayout: SectionLayoutOptions = {
  contentWidth: 'default',
  spacing: 'lg',
  surface: 'default',
};

const templateSectionLayouts: Record<string, SectionLayoutOptions> = {
  cards_grid_primary: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
  },
  contact_primary: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
  },
  courses_highlight_grid: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
  },
  experience_timeline: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
  },
  hero_primary: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
    bleed: true,
  },
  initiative_highlight_list: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
  },
  project_highlight_list: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
  },
  rich_text: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
  },
  skills_primary: {
    contentWidth: 'default',
    spacing: 'lg',
    surface: 'default',
  },
};

export function resolveSectionLayout(
  templateKey: string,
): SectionLayoutOptions {
  return templateSectionLayouts[templateKey] ?? defaultSectionLayout;
}
