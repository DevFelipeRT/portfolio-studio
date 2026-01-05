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
            'default' => 'Contact',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'eyebrow',
            'label' => 'Section eyebrow',
            'type' => 'string',
            'required' => false,
            'default' => 'Contact',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'title',
            'label' => 'Section title',
            'type' => 'string',
            'required' => false,
            'default' => 'Let us talk about opportunities, projects, or collaboration.',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'type' => 'text',
            'required' => false,
            'default' => 'If you are looking for a developer to strengthen your team, support a specific project, or start a technical collaboration, use the form or the channels below to get in touch.',
            'validation' => ['max:300'],
        ],

        // Form sub-section
        [
            'name' => 'form_title',
            'label' => 'Form section title',
            'type' => 'string',
            'required' => false,
            'default' => 'Send a message',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'form_description',
            'label' => 'Form section description',
            'type' => 'text',
            'required' => false,
            'default' => 'Share what you have in mind and how I can help.',
            'validation' => ['max:300'],
        ],

        // Form: name
        [
            'name' => 'name_label',
            'label' => 'Name field label',
            'type' => 'string',
            'required' => false,
            'default' => 'Name',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'name_placeholder',
            'label' => 'Name field placeholder',
            'type' => 'string',
            'required' => false,
            'default' => 'Your name',
            'validation' => ['max:120'],
        ],

        // Form: email
        [
            'name' => 'email_label',
            'label' => 'Email field label',
            'type' => 'string',
            'required' => false,
            'default' => 'Email',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'email_placeholder',
            'label' => 'Email field placeholder',
            'type' => 'string',
            'required' => false,
            'default' => 'you@example.com',
            'validation' => ['max:120'],
        ],

        // Form: message
        [
            'name' => 'message_label',
            'label' => 'Message field label',
            'type' => 'string',
            'required' => false,
            'default' => 'Message',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'message_placeholder',
            'label' => 'Message field placeholder',
            'type' => 'string',
            'required' => false,
            'default' => 'Write your message here.',
            'validation' => ['max:220'],
        ],

        // Form: submit button
        [
            'name' => 'submit_label',
            'label' => 'Submit button label (idle)',
            'type' => 'string',
            'required' => false,
            'default' => 'Send message',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'submit_processing_label',
            'label' => 'Submit button label (processing)',
            'type' => 'string',
            'required' => false,
            'default' => 'Sending…',
            'validation' => ['max:80'],
        ],

        // Socials sidebar
        [
            'name' => 'sidebar_heading',
            'label' => 'Socials sidebar heading',
            'type' => 'string',
            'required' => false,
            'default' => 'Other contact channels',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'sidebar_description',
            'label' => 'Socials sidebar description',
            'type' => 'text',
            'required' => false,
            'default' => 'You can also contact me through your preferred channel using the links below to access my profiles and learn more about my work.',
            'validation' => ['max:300'],
        ],
    ],
];
