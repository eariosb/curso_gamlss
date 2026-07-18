'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';

export interface GaicModel {
  name: string;
  family: string;
  df: number;
  gaic: number;
}

export interface GaicTableProps {
  models: GaicModel[];
}

type SortKey = 'name' | 'family' | 'df' | 'gaic';
type SortDir = 'asc' | 'desc';

/**
 * Tabla comparativa de modelos GAMLSS ordenable por columnas.
 * Resalta automáticamente la fila con menor GAIC y muestra ΔGAIC
 * (diferencia respecto al mejor modelo).
 */
export function GaicTable({ models }: GaicTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('gaic');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const minGaic = useMemo(() => Math.min(...models.map((m) => m.gaic)), [models]);

  const sorted = useMemo(() => {
    const arr = [...models];
    arr.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name' || sortKey === 'family') {
        return a[sortKey].localeCompare(b[sortKey]) * dir;
      }
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return arr;
  }, [models, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const columns: { key: SortKey; label: string; align: string }[] = [
    { key: 'name', label: 'Modelo', align: 'text-left' },
    { key: 'family', label: 'Familia', align: 'text-left' },
    { key: 'df', label: 'gl', align: 'text-right' },
    { key: 'gaic', label: 'GAIC', align: 'text-right' },
  ];

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-200 bg-white shadow-sm">
      <div className="border-b border-ink-200 bg-accent-50 px-4 py-2.5">
        <p className="flex items-center gap-2 text-sm font-semibold text-accent-800">
          <span aria-hidden>📊</span>
          Comparación de modelos (GAIC)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink-200 text-sm">
          <thead className="bg-ink-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={clsx(
                    'cursor-pointer px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-600 transition-colors hover:text-accent-700 select-none',
                    col.align
                  )}
                  aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span aria-hidden className="ml-1">
                      {sortDir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
              <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-ink-600">
                ΔGAIC
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => {
              const isBest = m.gaic === minGaic;
              const delta = m.gaic - minGaic;
              return (
                <tr
                  key={m.name}
                  className={clsx(
                    'border-t border-ink-100 transition-colors hover:bg-ink-50',
                    isBest && 'bg-positive-50'
                  )}
                >
                  <td className="px-4 py-2 font-medium text-ink-900">
                    {isBest && <span aria-hidden className="mr-1 text-positive-700">★</span>}
                    {m.name}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-accent-700">{m.family}</td>
                  <td className="px-4 py-2 text-right text-ink-600">{m.df}</td>
                  <td className="px-4 py-2 text-right font-mono text-ink-800">
                    {m.gaic.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {isBest ? (
                      <span className="text-positive-700">—</span>
                    ) : (
                      <span className={delta < 10 ? 'text-amber-600' : 'text-ink-500'}>
                        +{delta.toFixed(1)}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-ink-200 bg-ink-50 px-4 py-2 text-xs text-ink-500">
        ★ Modelo con menor GAIC. ΔGAIC &lt; 10: evidencia débil; 10–100: moderada; &gt; 100: fuerte.
      </div>
    </div>
  );
}
