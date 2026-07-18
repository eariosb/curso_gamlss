'use client';

import { useState } from 'react';
import clsx from 'clsx';

export interface ParamTabContent {
  /** Fórmula del predictor en notación LaTeX (ej. "\\mu_i = \\beta_0 + \\beta_1 x_i"). */
  formula: string;
  /** Función de enlace (ej. "log", "identity", "logit"). */
  link: string;
  /** Ruta a un gráfico precomputado de term.plot() (opcional). */
  plot?: string;
  /** Texto alternativo del gráfico. */
  plotAlt?: string;
}

export interface ParamTabsProps {
  mu: ParamTabContent;
  sigma?: ParamTabContent;
  nu?: ParamTabContent;
  tau?: ParamTabContent;
}

const TAB_DEFS = [
  { key: 'mu' as const, label: 'μ', desc: 'Localización' },
  { key: 'sigma' as const, label: 'σ', desc: 'Escala' },
  { key: 'nu' as const, label: 'ν', desc: 'Asimetría' },
  { key: 'tau' as const, label: 'τ', desc: 'Curtosis/Pesos' },
];

/**
 * Pestañas para explorar los cuatro predictores de un modelo GAMLSS
 * (μ, σ, ν, τ). Cada pestaña muestra la fórmula del predictor, la función
 * de enlace y, opcionalmente, el gráfico de term.plot() precomputado.
 */
export function ParamTabs({ mu, sigma, nu, tau }: ParamTabsProps) {
  const tabs = TAB_DEFS.filter((t) => {
    const content = { mu, sigma, nu, tau }[t.key];
    return content !== undefined;
  });

  const [active, setActive] = useState(tabs[0]?.key ?? 'mu');
  const current = { mu, sigma, nu, tau }[active] ?? mu;

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-200 bg-white shadow-sm">
      <div role="tablist" aria-label="Parámetros del modelo GAMLSS" className="flex border-b border-ink-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={active === tab.key}
            aria-controls={`panel-${tab.key}`}
            id={`tab-${tab.key}`}
            onClick={() => setActive(tab.key)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
              active === tab.key
                ? 'border-b-2 border-accent-600 text-accent-700'
                : 'text-ink-500 hover:text-ink-800'
            )}
          >
            <span className="text-base">{tab.label}</span>
            <span className="hidden text-xs text-ink-400 sm:inline">{tab.desc}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="px-5 py-4"
      >
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700">
            Enlace: <code className="font-mono">{current.link}</code>
          </span>
        </div>
        <div className="mb-3 rounded bg-ink-50 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
            Predictor
          </p>
          <div className="overflow-x-auto font-mono text-sm text-ink-800">
            {current.formula}
          </div>
        </div>
        {current.plot && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.plot}
            alt={current.plotAlt ?? `Gráfico de efectos para ${active}`}
            className="w-full rounded border border-ink-200"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
