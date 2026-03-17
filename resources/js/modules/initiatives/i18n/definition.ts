import { createI18nRegistry } from '@/common/i18n';

createI18nRegistry().define('initiatives', () => import('./environment'));
