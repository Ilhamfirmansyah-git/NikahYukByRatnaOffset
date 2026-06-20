import type { CanvaTemplateTheme } from '../base/types';
import {
  GoldArch,
  FallingPetals,
  PeacockSVGPair,
  PeacockDivider,
  FloralWreathFrame,
  FloatingEyes,
  MempelaiPetals,
  FeatherCorner,
} from '../FloraFaunaDecorators';

export const FloraFaunaTheme: CanvaTemplateTheme = {
  slug: 'flora-fauna',
  assets: {
    coverBg: '/assets/templates/flora-fauna/peacock.jpg',
    sectionFrame: '/assets/templates/flora-fauna/floral-wreath.jpg',
  },
  colors: {
    primary:      '#C9A84C',
    primaryLight: '#E8C547',
    primaryDark:  '#8B6914',
    bgLight:      '#FAF7F0',
    bgLight2:     '#F5EDE0',
    bgDark:       '#1e1610',
    text:         '#120D08',
    textMuted:    'rgba(18,13,8,0.55)',
    coverOverlay: 'radial-gradient(ellipse 65% 70% at 50% 45%, rgba(18,13,8,0.68) 0%, rgba(18,13,8,0.25) 70%, transparent 100%)',
  },
  fonts: {
    heading:    "'Great Vibes', cursive",
    subheading: "'Cormorant Garamond', serif",
    body:       "'Inter', sans-serif",
  },
  cover: {
    bgPosition:   'bottom center',
    titleColor:   '#E8C547',
    subtitleColor: '#8B6914',
  },
  decorators: {
    CoverTopOverlay:      GoldArch,
    CoverAnimation:       FallingPetals,
    CoverBottomDecor:     PeacockSVGPair,
    SectionDivider:       PeacockDivider,
    MempelaiFrame:        FloralWreathFrame,
    SectionBgDecor:       FloatingEyes,
    MempelaiSectionDecor: MempelaiPetals,
    AcaraCardDecor:       FeatherCorner,
  },
};
