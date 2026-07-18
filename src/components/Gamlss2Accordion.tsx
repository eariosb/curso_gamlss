'use client';

import { useState } from 'react';
import clsx from 'clsx';

export interface Gamlss2AccordionProps {
  /** Código equivalente en sintaxis clásica gamlss(). */
  gamlssCode: string;
  /** Código equivalente en sintaxis nueva gamlss2(). */
  gamlss2Code: string;
  /** Nota opcional sobre las diferencias. */
  note?: string;
}

/**
 * Panel colapsable que muestra la equivalencia entre la sintaxis clásica
 * de gamlss() y la nueva de gamlss2(). Útil en el Módulo 18 para enseñar
 * la migración al nuevo ecosistema.
 */
export function Gamlss2Accordion({ gamlssCode, gamlss2Code, note }: Gamlss2AccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 bg-accent-50 px-4 py-3 text-left text-sm font-semibold text-accent-800 transition-colors hover:bg-accent-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
      >
        <span aria-hidden className={clsx('transition-transform', open && 'rotate-90')}>
          ▸
        </span>
        Equivalencia: gamlss() ↔ gamlss2()
      </button>

      {open && (
        <div className="animate-fade-in grid gap-4 p-4 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
              <span className="rounded bg-ink-100 px-2 py-0.5 font-mono">gamlss()</span>
              Clásico
            </p>
            <pre className="overflow-x-auto rounded bg-ink-900 px-4 py-3 font-mono text-xs leading-relaxed text-ink-100">
              {gamlssCode}
            </pre>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
              <span className="rounded bg-accent-100 px-2 py-0.5 font-mono text-accent-700">gamlss2()</span>
              Nuevo
            </p>
            <pre className="overflow-x-auto rounded bg-ink-900 px-4 py-3 font-mono text-xs leading-relaxed text-ink-100">
              {gamlss2Code}
            </pre>
          </div>
          {note && (
            <div className="md:col-span-2">
              <p className="rounded bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <span className="font-semibold">Nota: </span>
                {note}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
