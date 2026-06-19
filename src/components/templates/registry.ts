import { ComponentType } from 'react';
import { TemplateProps } from './TemplateProps';

// Dynamic imports to avoid SSR issues with client components
import EleganGold from './EleganGold';
import MinimalisPutih from './MinimalisPutih';
import Islami from './Islami';
import GelapRomantis from './GelapRomantis';
import RomantisPink from './RomantisPink';

export const TEMPLATE_REGISTRY: Record<string, ComponentType<TemplateProps>> = {
  'elegan-gold': EleganGold,
  'minimalis-putih': MinimalisPutih,
  'islami': Islami,
  'gelap-romantis': GelapRomantis,
  'romantis-pink': RomantisPink,
};
