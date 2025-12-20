<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Validation settings
    |--------------------------------------------------------------------------
    |
    | Controls how capability parameter validation behaves.
    |
    | - strict_types: when true, primitive types are strictly enforced.
    | - allow_unknown_parameters: when true, parameters not declared
    |   in the schema are accepted and passed through as-is.
    |
    */

    'validation' => [
        'strict_types' => true,
        'allow_unknown_parameters' => true,
    ],

];
