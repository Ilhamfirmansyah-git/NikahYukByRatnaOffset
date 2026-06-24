import type { ComponentType, ReactNode } from 'react';

export interface CanvaTemplateTheme {
  inner?: {
    /** Remove bordered card layout for acara items; use open divider-separated rows instead */
    openAcaraCards?: boolean;
    /** Floral accent rendered at the top of each major inner section */
    SectionHeaderDecor?: ComponentType;
    /** Use a single fixed background image behind all inner sections (Art-Forest style) */
    continuousBg?: boolean;
  };
  slug: string;
  assets: {
    coverBg: string;
    heroBg?: string;
    footerBg?: string;
    topDecoration?: string;
    bottomDecoration?: string;
    leftDecoration?: string;
    rightDecoration?: string;
    sectionFrame?: string;
  };
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    bgLight: string;
    bgLight2?: string;
    bgDark: string;
    text: string;
    textMuted: string;
    coverOverlay: string;
  };
  fonts: {
    heading: string;
    subheading: string;
    body: string;
  };
  cover: {
    bgPosition?: string;
    titleColor: string;
    subtitleColor: string;
    dateColor?: string;
  };
  decorators?: {
    /** Arch, bismillah, or any overlay rendered position:absolute inset:0 on the cover */
    CoverTopOverlay?: ComponentType;
    /** Falling petals, stars, etc. — rendered inside overflow:hidden cover container */
    CoverAnimation?: ComponentType;
    /** Peacock SVG, flower clusters etc. — rendered position:absolute inset:0 on cover */
    CoverBottomDecor?: ComponentType;
    /** Section separator shown between headings and content */
    SectionDivider?: ComponentType;
    /** Wreath/frame wrapping each mempelai card */
    MempelaiFrame?: ComponentType<{ children: ReactNode }>;
    /** Floating decorations in the quote section background */
    SectionBgDecor?: ComponentType;
    /** Soft animated overlay in the mempelai section background */
    MempelaiSectionDecor?: ComponentType;
    /** Corner decoration inside each acara event card */
    AcaraCardDecor?: ComponentType<{ pos: 'tl' | 'tr' | 'bl' | 'br' }>;
  };
}
