'use client';

import { CanvaBaseTemplate } from './base';
import { BlueFlowerElegantTheme } from './themes/blue-flower-elegant.theme';
import type { TemplateProps } from './TemplateProps';

export default function BlueFlowerElegant(props: TemplateProps) {
  return <CanvaBaseTemplate theme={BlueFlowerElegantTheme} {...props} />;
}
