<?php

declare(strict_types=1);

/**
 * Contact primary section template definition.
 *
 * @return array<string, mixed>
 */
return [
    'key' => 'contact_primary',
    'label' => 'Primary contact section',
    'description' => 'Displays a contact form with configurable texts.',
    'allowed_slots' => ['main'],

    'fields' => [
        // Section header
        [
            'name' => 'section_label',
            'label' => 'Section aria label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:160'],
        ],
        [
            'name' => 'eyebrow',
            'label' => 'Section eyebrow',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:80'],
        ],
        [
            'name' => 'title',
            'label' => 'Section title',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:160'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'type' => 'text',
            'required' => false,
            'default' => null,
            'validation' => ['max:300'],
        ],

        // Form sub-section
        [
            'name' => 'form_title',
            'label' => 'Form section title',
            'type' => 'string',
            'required' => false,
            'default' => 'Teste',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'form_description',
            'label' => 'Form section description',
            'type' => 'text',
            'required' => false,
            'default' => null,
            'validation' => ['max:300'],
        ],

        // Form: name
        [
            'name' => 'name_label',
            'label' => 'Name field label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:80'],
        ],
        [
            'name' => 'name_placeholder',
            'label' => 'Name field placeholder',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:120'],
        ],

        // Form: email
        [
            'name' => 'email_label',
            'label' => 'Email field label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:80'],
        ],
        [
            'name' => 'email_placeholder',
            'label' => 'Email field placeholder',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:120'],
        ],

        // Form: message
        [
            'name' => 'message_label',
            'label' => 'Message field label',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:80'],
        ],
        [
            'name' => 'message_placeholder',
            'label' => 'Message field placeholder',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:220'],
        ],

        // Form: submit button
        [
            'name' => 'submit_label',
            'label' => 'Submit button label (idle)',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:80'],
        ],
        [
            'name' => 'submit_processing_label',
            'label' => 'Submit button label (processing)',
            'type' => 'string',
            'required' => false,
            'default' => null,
            'validation' => ['max:80'],
        ],
    ],
];
