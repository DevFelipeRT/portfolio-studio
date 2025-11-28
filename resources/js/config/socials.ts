// resources/js/config/socials.ts
import type { SocialLinkItem } from '@/Components/SocialLinksBar';
import { Github, Linkedin, Mail, MessageCircle, PhoneCall } from 'lucide-react';

export const defaultSocialLinks: SocialLinkItem[] = [
    {
        label: 'Email',
        translationKey: 'contact.socials.email.label',
        href: '',
        icon: Mail,
    },
    {
        label: 'GitHub',
        translationKey: 'contact.socials.github.label',
        href: '',
        icon: Github,
    },
    {
        label: 'LinkedIn',
        translationKey: 'contact.socials.linkedin.label',
        href: '',
        icon: Linkedin,
    },
    {
        label: 'WhatsApp',
        translationKey: 'contact.socials.whatsapp.label',
        href: '',
        icon: MessageCircle,
    },
    {
        label: 'Phone',
        translationKey: 'contact.socials.phone.label',
        href: '',
        icon: PhoneCall,
    },
];
