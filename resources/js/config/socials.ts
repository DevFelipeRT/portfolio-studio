// resources/js/config/socials.ts
import type { SocialLinkItem } from '@/Components/SocialLinksBar';
import { Github, Linkedin, Mail, MessageCircle, PhoneCall } from 'lucide-react';

export const defaultSocialLinks: SocialLinkItem[] = [
    {
        label: 'Email',
        translationKey: 'contact.socials.email.label',
        href: 'mailto:feliperterrazas@gmail.com',
        icon: Mail,
    },
    {
        label: 'GitHub',
        translationKey: 'contact.socials.github.label',
        href: 'https://github.com/DevFelipeRT',
        icon: Github,
    },
    {
        label: 'LinkedIn',
        translationKey: 'contact.socials.linkedin.label',
        href: 'https://linkedin.com/in/felipe-ruiz-terrazas',
        icon: Linkedin,
    },
    {
        label: 'WhatsApp',
        translationKey: 'contact.socials.whatsapp.label',
        href: 'https://wa.me/551973613744',
        icon: MessageCircle,
    },
    {
        label: 'Phone',
        translationKey: 'contact.socials.phone.label',
        href: 'tel:+5511973613744',
        icon: PhoneCall,
    },
];
