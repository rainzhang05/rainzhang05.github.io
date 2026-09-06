import type { Copy } from '../types';
import type { Locale } from '../site';
import { en } from './en';
import { ja } from './ja';

export const content: Record<Locale, Copy> = { en, ja };
export { en, ja };
