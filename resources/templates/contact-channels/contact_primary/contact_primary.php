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
    'label_key' => 'label',
    'description' => 'Contact section with configurable copy for the form and supporting links.',
    'description_key' => 'description',
    'allowed_slots' => ['main'],

    'fields' => [
        // Section header
        [
            'name' => 'section_label',
            'label' => 'Section aria label',
            'label_key' => 'fields.section_label.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Contact',
            'default_key' => 'fields.section_label.default',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'eyebrow',
            'label' => 'Section eyebrow',
            'label_key' => 'fields.eyebrow.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Contact',
            'default_key' => 'fields.eyebrow.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'title',
            'label' => 'Section title',
            'label_key' => 'fields.title.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Let\'s talk about opportunities, projects, or collaboration.',
            'default_key' => 'fields.title.default',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'description',
            'label' => 'Section description',
            'label_key' => 'fields.description.label',
            'type' => 'text',
            'required' => false,
            'default' => 'Need a developer to strengthen your team or kick off a project? Use the form or the channels below to get in touch.',
            'default_key' => 'fields.description.default',
            'validation' => ['max:300'],
        ],

        // Form sub-section
        [
            'name' => 'form_title',
            'label' => 'Form section title',
            'label_key' => 'fields.form_title.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Send a message',
            'default_key' => 'fields.form_title.default',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'form_description',
            'label' => 'Form section description',
            'label_key' => 'fields.form_description.label',
            'type' => 'text',
            'required' => false,
            'default' => 'Share what you need and how I can help.',
            'default_key' => 'fields.form_description.default',
            'validation' => ['max:300'],
        ],

        // Form: name
        [
            'name' => 'name_label',
            'label' => 'Name field label',
            'label_key' => 'fields.name_label.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Name',
            'default_key' => 'fields.name_label.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'name_placeholder',
            'label' => 'Name field placeholder',
            'label_key' => 'fields.name_placeholder.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Your full name',
            'default_key' => 'fields.name_placeholder.default',
            'validation' => ['max:120'],
        ],

        // Form: email
        [
            'name' => 'email_label',
            'label' => 'Email field label',
            'label_key' => 'fields.email_label.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Email',
            'default_key' => 'fields.email_label.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'email_placeholder',
            'label' => 'Email field placeholder',
            'label_key' => 'fields.email_placeholder.label',
            'type' => 'string',
            'required' => false,
            'default' => 'you@company.com',
            'default_key' => 'fields.email_placeholder.default',
            'validation' => ['max:120'],
        ],

        // Form: message
        [
            'name' => 'message_label',
            'label' => 'Message field label',
            'label_key' => 'fields.message_label.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Message',
            'default_key' => 'fields.message_label.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'message_placeholder',
            'label' => 'Message field placeholder',
            'label_key' => 'fields.message_placeholder.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Tell me about your project or role.',
            'default_key' => 'fields.message_placeholder.default',
            'validation' => ['max:220'],
        ],

        // Form: submit button
        [
            'name' => 'submit_label',
            'label' => 'Submit button label (idle)',
            'label_key' => 'fields.submit_label.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Send message',
            'default_key' => 'fields.submit_label.default',
            'validation' => ['max:80'],
        ],
        [
            'name' => 'submit_processing_label',
            'label' => 'Submit button label (processing)',
            'label_key' => 'fields.submit_processing_label.label',
            'type' => 'string',
            'required' => false,
            'default' => 'Sending...',
            'default_key' => 'fields.submit_processing_label.default',
            'validation' => ['max:80'],
        ],

        // Socials sidebar
        [
            'name' => 'sidebar_heading',
            'label' => 'Socials sidebar heading',
            'label_key' => 'fields.sidebar_heading.label',
            'type' => 'string',
            'required' => false,
            'default' => 'More ways to reach me',
            'default_key' => 'fields.sidebar_heading.default',
            'validation' => ['max:160'],
        ],
        [
            'name' => 'sidebar_description',
            'label' => 'Socials sidebar description',
            'label_key' => 'fields.sidebar_description.label',
            'type' => 'text',
            'required' => false,
            'default' => 'Prefer a different channel? Use the links below to reach my profiles and learn more about my work.',
            'default_key' => 'fields.sidebar_description.default',
            'validation' => ['max:300'],
        ],
    ],

    'data_source' => [
        'type' => 'capability',
        'capability_key' => 'contact-channels.visible.v1',
        'parameter_mapping' => [],
        'target_field' => 'contact_channels',
    ],
];
