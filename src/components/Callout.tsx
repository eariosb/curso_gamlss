import clsx from 'clsx';
import type { ReactNode } from 'react';

export type CalloutType = 'note' | 'warning' | 'tip' | 'curiosity' | 'success';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const STYLES: Record<CalloutType, { wrap: string; badge: string; icon: string; label: string }> = {
  tip: {
    wrap: 'border-accent-200 bg-accent-50',
    badge: 'text-accent-700',
    icon: '💡',
    label: 'Tip',
  },
  note: {
    wrap: 'border-ink-200 bg-ink-50',
    badge: 'text-ink-700',
    icon: 'ℹ️',
    label: 'Nota',
  },
  warning: {
    wrap: 'border-amber-200 bg-amber-50',
    badge: 'text-amber-800',
    icon: '⚠️',
    label: 'Atención',
  },
  curiosity: {
    wrap: 'border-accent-200 bg-accent-50',
    badge: 'text-accent-800',
    icon: '🔍',
    label: 'Para el curioso',
  },
  success: {
    wrap: 'border-emerald-200 bg-emerald-50',
    badge: 'text-emerald-800',
    icon: '✅',
    label: 'Buena práctica',
  },
};

/**
 * Caja de resalte dentro de la narrativa de un módulo: notas, advertencias,
 * tips, curiosidades teóricas y buenas prácticas. Mismo lenguaje visual que
 * el curso MLM.
 */
export function Callout({ type = 'tip', title, children }: CalloutProps) {
  const s = STYLES[type];
  return (
    <div className={clsx('my-6 rounded border px-4 py-3', s.wrap)}>
      <p className={clsx('mb-1 flex items-center gap-2 text-sm font-semibold', s.badge)}>
        <span aria-hidden>{s.icon}</span>
        {title ?? s.label}
      </p>
      <div className="prose prose-sm max-w-none text-ink-700 prose-p:my-1 prose-code:before:content-none prose-code:after:content-none prose-code:bg-[#1e1e2e] prose-code:text-gray-100">{children}</div>
    </div>
  );
}
