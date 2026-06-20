'use client';

import { CanvaBaseTemplate } from './base';
import { FloraFaunaTheme } from './themes/flora-fauna.theme';
import { TemplateProps } from './TemplateProps';

export default function FloraFauna(props: TemplateProps) {
  return <CanvaBaseTemplate theme={FloraFaunaTheme} {...props} />;
}
