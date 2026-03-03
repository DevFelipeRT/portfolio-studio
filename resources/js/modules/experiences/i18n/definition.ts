import { createI18nRegistry } from '@/common/i18n';

createI18nRegistry().define('experiences', () => import('./environment'));

