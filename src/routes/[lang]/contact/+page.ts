import { locales } from '#lib/i18n/index';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => locales.map((lang) => ({ lang }));
