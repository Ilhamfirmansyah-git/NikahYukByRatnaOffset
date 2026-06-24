import type { CanvaTemplateTheme } from '../base/types';
import { BlueFlowerBouquets, BlueFlowerSectionBg, BlueFlowerSectionHeader } from '../BlueFlowerElegantDecorators';

export const BlueFlowerElegantTheme: CanvaTemplateTheme = {
  slug: 'blue-flower-elegant',
  assets: {
    coverBg: '/assets/templates/blue-flower-elegant/flower-frame.jpg',
  },
  colors: {
    primary: '#c9a84c',
    primaryLight: '#e8d5a3',
    primaryDark: '#9a7a2e',
    bgLight: '#f8f9ff',
    bgDark: '#1a2a4a',
    text: '#1a2a4a',
    textMuted: '#4a7ab5',
    coverOverlay: 'transparent',
  },
  fonts: {
    heading: "'Great Vibes', cursive",
    subheading: "'Cormorant Garamond', serif",
    body: "'Inter', sans-serif",
  },
  cover: {
    bgPosition: 'center center',
    titleColor: '#1a2a4a',
    subtitleColor: '#c9a84c',
  },
  decorators: {
    CoverBottomDecor: BlueFlowerBouquets,
    SectionBgDecor: BlueFlowerSectionBg,
  },
  inner: {
    openAcaraCards: true,
    continuousBg: true,
    SectionHeaderDecor: BlueFlowerSectionHeader,
  },
};
