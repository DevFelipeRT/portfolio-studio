<?php

declare(strict_types=1);

use App\Modules\ContentManagement\Domain\Models\PageSection;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Initiatives\Domain\Models\Initiative;

return [

    /*
    |--------------------------------------------------------------------------
    | Image owner morph map
    |--------------------------------------------------------------------------
    |
    | Stable aliases used as morph types for image owners. These aliases are
    | persisted in the database and mapped to their concrete Eloquent models.
    |
    */

    'morph_map' => [
        'project' => Project::class,
        'initiative' => Initiative::class,
        'page_section' => PageSection::class,
    ],

];
