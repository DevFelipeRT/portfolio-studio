<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Models\SkillCategoryTranslation;
use App\Modules\Skills\Domain\Models\SkillTranslation;
use Database\Seeders\Concerns\PreventsProductionSeeding;
use Illuminate\Database\Seeder;

class SkillsSeeder extends Seeder
{
    use PreventsProductionSeeding;

    /**
     * Seed skills module base data and translations.
     */
    public function run(): void
    {
        $this->assertNotProduction();

        // Keep this seeder deterministic: remove previous skills data first.
        Skill::query()->delete();
        SkillCategory::query()->delete();

        $categories = [
            [
                'slug' => 'frontend',
                'locale' => 'en',
                'name' => 'Front-end',
                'translations' => [
                    'pt_BR' => 'Front-end',
                ],
                'skills' => [
                    [
                        'locale' => 'en',
                        'name' => 'React',
                        'translations' => [
                            'pt_BR' => 'React',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'TypeScript',
                        'translations' => [
                            'pt_BR' => 'TypeScript',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Tailwind CSS',
                        'translations' => [
                            'pt_BR' => 'Tailwind CSS',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Next.js',
                        'translations' => [
                            'pt_BR' => 'Next.js',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Vue.js',
                        'translations' => [
                            'pt_BR' => 'Vue.js',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'HTML5',
                        'translations' => [
                            'pt_BR' => 'HTML5',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'CSS3',
                        'translations' => [
                            'pt_BR' => 'CSS3',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'backend',
                'locale' => 'en',
                'name' => 'Back-end',
                'translations' => [
                    'pt_BR' => 'Back-end',
                ],
                'skills' => [
                    [
                        'locale' => 'en',
                        'name' => 'PHP',
                        'translations' => [
                            'pt_BR' => 'PHP',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Laravel',
                        'translations' => [
                            'pt_BR' => 'Laravel',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Node.js',
                        'translations' => [
                            'pt_BR' => 'Node.js',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Express',
                        'translations' => [
                            'pt_BR' => 'Express',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'REST APIs',
                        'translations' => [
                            'pt_BR' => 'APIs REST',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'GraphQL',
                        'translations' => [
                            'pt_BR' => 'GraphQL',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Java',
                        'translations' => [
                            'pt_BR' => 'Java',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'database',
                'locale' => 'en',
                'name' => 'Database',
                'translations' => [
                    'pt_BR' => 'Banco de dados',
                ],
                'skills' => [
                    [
                        'locale' => 'en',
                        'name' => 'MySQL',
                        'translations' => [
                            'pt_BR' => 'MySQL',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'PostgreSQL',
                        'translations' => [
                            'pt_BR' => 'PostgreSQL',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Redis',
                        'translations' => [
                            'pt_BR' => 'Redis',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'MongoDB',
                        'translations' => [
                            'pt_BR' => 'MongoDB',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Database Design',
                        'translations' => [
                            'pt_BR' => 'Modelagem de banco',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'devops',
                'locale' => 'en',
                'name' => 'DevOps',
                'translations' => [
                    'pt_BR' => 'DevOps',
                ],
                'skills' => [
                    [
                        'locale' => 'en',
                        'name' => 'Docker',
                        'translations' => [
                            'pt_BR' => 'Docker',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'GitHub Actions',
                        'translations' => [
                            'pt_BR' => 'GitHub Actions',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Nginx',
                        'translations' => [
                            'pt_BR' => 'Nginx',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'CI/CD',
                        'translations' => [
                            'pt_BR' => 'CI/CD',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Linux',
                        'translations' => [
                            'pt_BR' => 'Linux',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Terraform',
                        'translations' => [
                            'pt_BR' => 'Terraform',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'testing',
                'locale' => 'en',
                'name' => 'Testing',
                'translations' => [
                    'pt_BR' => 'Testes',
                ],
                'skills' => [
                    [
                        'locale' => 'en',
                        'name' => 'PHPUnit',
                        'translations' => [
                            'pt_BR' => 'PHPUnit',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Pest',
                        'translations' => [
                            'pt_BR' => 'Pest',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Jest',
                        'translations' => [
                            'pt_BR' => 'Jest',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Cypress',
                        'translations' => [
                            'pt_BR' => 'Cypress',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'tooling',
                'locale' => 'en',
                'name' => 'Tooling',
                'translations' => [
                    'pt_BR' => 'Ferramentas',
                ],
                'skills' => [
                    [
                        'locale' => 'en',
                        'name' => 'Git',
                        'translations' => [
                            'pt_BR' => 'Git',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Composer',
                        'translations' => [
                            'pt_BR' => 'Composer',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'NPM',
                        'translations' => [
                            'pt_BR' => 'NPM',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Vite',
                        'translations' => [
                            'pt_BR' => 'Vite',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'cloud',
                'locale' => 'en',
                'name' => 'Cloud',
                'translations' => [
                    'pt_BR' => 'Nuvem',
                ],
                'skills' => [
                    [
                        'locale' => 'en',
                        'name' => 'AWS',
                        'translations' => [
                            'pt_BR' => 'AWS',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Cloudflare',
                        'translations' => [
                            'pt_BR' => 'Cloudflare',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'DigitalOcean',
                        'translations' => [
                            'pt_BR' => 'DigitalOcean',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'mobile',
                'locale' => 'en',
                'name' => 'Mobile',
                'translations' => [
                    'pt_BR' => 'Mobile',
                ],
                'skills' => [
                    [
                        'locale' => 'en',
                        'name' => 'React Native',
                        'translations' => [
                            'pt_BR' => 'React Native',
                        ],
                    ],
                    [
                        'locale' => 'en',
                        'name' => 'Flutter',
                        'translations' => [
                            'pt_BR' => 'Flutter',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $category = SkillCategory::query()->create(
                [
                    'slug' => $categoryData['slug'],
                    'name' => $categoryData['name'],
                    'locale' => $categoryData['locale'],
                ],
            );

            $this->seedCategoryTranslations($category, $categoryData['translations'] ?? []);
            $this->seedSkills($category, $categoryData['skills'] ?? []);
        }
    }

    /**
     * @param array<string,string> $translations
     */
    private function seedCategoryTranslations(SkillCategory $category, array $translations): void
    {
        foreach ($translations as $locale => $name) {
            if ($locale === $category->locale) {
                continue;
            }

            SkillCategoryTranslation::query()->create(
                [
                    'skill_category_id' => $category->id,
                    'locale' => $locale,
                    'name' => $name,
                ],
            );
        }
    }

    /**
     * @param array<int,array<string,mixed>> $skills
     */
    private function seedSkills(SkillCategory $category, array $skills): void
    {
        foreach ($skills as $skillData) {
            $skill = Skill::query()->create(
                [
                    'name' => $skillData['name'],
                    'locale' => $skillData['locale'],
                    'skill_category_id' => $category->id,
                ],
            );

            $this->seedSkillTranslations($skill, $skillData['translations'] ?? []);
        }
    }

    /**
     * @param array<string,string> $translations
     */
    private function seedSkillTranslations(Skill $skill, array $translations): void
    {
        foreach ($translations as $locale => $name) {
            if ($locale === $skill->locale) {
                continue;
            }

            SkillTranslation::query()->create(
                [
                    'skill_id' => $skill->id,
                    'locale' => $locale,
                    'name' => $name,
                ],
            );
        }
    }
}
