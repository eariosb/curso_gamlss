'use client';

import { useState } from 'react';

export interface WormPlotGuideProps {
  /** Ruta a un worm plot precomputado (opcional). Si se omite, se usa el SVG interactivo. */
  image?: string;
}

interface Pathology {
  id: string;
  name: string;
  description: string;
  correction: string;
  region: { x: number; y: number; w: number; h: number };
}

const PATHOLOGIES: Pathology[] = [
  {
    id: 'level',
    name: 'Nivel (intercepto)',
    description: 'Los puntos se desplazan sistemáticamente por encima o por debajo de la línea horizontal de referencia.',
    correction: 'Revisar el predictor de μ: puede faltar una covariable o el intercepto estar mal especificado.',
    region: { x: 50, y: 20, w: 300, h: 40 },
  },
  {
    id: 'slope',
    name: 'Pendiente',
    description: 'Los puntos forman una línea diagonal creciente o decreciente a través del gráfico.',
    correction: 'El predictor de σ necesita ajuste: la varianza no se modela correctamente.',
    region: { x: 50, y: 60, w: 300, h: 80 },
  },
  {
    id: 'u-shape',
    name: 'Forma de U',
    description: 'Los puntos dibujan una curva cóncava o convexa (parábola) a lo largo del eje x.',
    correction: 'La distribución elegida no captura la asimetría: considerar ν (Box-Cox) o cambiar de familia.',
    region: { x: 50, y: 140, w: 300, h: 60 },
  },
  {
    id: 's-shape',
    name: 'Forma de S',
    description: 'Los puntos muestran una inflexión: primero suben y luego bajan (o viceversa).',
    correction: 'La curtosis no está bien modelada: considerar τ (grados de libertad) o una familia con colas más pesadas.',
    region: { x: 50, y: 200, w: 300, h: 60 },
  },
];

/**
 * Guía visual interactiva para interpretar worm plots según las cuatro
 * patologías documentadas (van Buuren & Fredriks, 2001):
 * nivel, pendiente, forma de U y forma de S.
 *
 * Si se proporciona una imagen precomputada, se muestra con overlays
 * explicativos. Si no, se dibuja un SVG esquemático con tooltips.
 */
export function WormPlotGuide({ image }: WormPlotGuideProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const activePathology = PATHOLOGIES.find((p) => p.id === hovered);

  if (image) {
    return (
      <div className="my-6 overflow-hidden rounded border border-ink-200 bg-white shadow-sm">
        <div className="border-b border-ink-200 bg-accent-50 px-4 py-2.5">
          <p className="flex items-center gap-2 text-sm font-semibold text-accent-800">
            <span aria-hidden>🪱</span>
            Worm plot — Guía de interpretación
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="Worm plot del modelo ajustado" className="w-full" loading="lazy" />
        <div className="border-t border-ink-200 px-4 py-3 text-sm text-ink-600">
          <p className="mb-2 font-medium text-ink-700">Patologías a observar:</p>
          <ul className="space-y-1.5">
            {PATHOLOGIES.map((p) => (
              <li key={p.id} className="flex gap-2">
                <span className="font-semibold text-accent-700">{p.name}:</span>
                <span>{p.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-200 bg-white shadow-sm">
      <div className="border-b border-ink-200 bg-accent-50 px-4 py-2.5">
        <p className="flex items-center gap-2 text-sm font-semibold text-accent-800">
          <span aria-hidden>🪱</span>
          Worm plot — Guía de interpretación interactiva
        </p>
      </div>

      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <svg
          viewBox="0 0 400 280"
          className="w-full max-w-md shrink-0"
          role="img"
          aria-label="Esquema de worm plot con las cuatro patologías"
        >
          {/* Marco y ejes */}
          <rect x="40" y="10" width="320" height="260" fill="#f8f9fa" stroke="#dee2e6" />
          <line x1="40" y1="140" x2="360" y2="140" stroke="#adb5bd" strokeDasharray="4 2" />
          <text x="200" y="275" textAnchor="middle" fontSize="10" fill="#6b7280">
            Cuantiles teóricos (z)
          </text>
          <text x="15" y="140" textAnchor="middle" fontSize="10" fill="#6b7280" transform="rotate(-90 15 140)">
            Residuos
          </text>

          {/* Regiones de patologías */}
          {PATHOLOGIES.map((p) => (
            <rect
              key={p.id}
              x={p.region.x}
              y={p.region.y}
              width={p.region.w}
              height={p.region.h}
              fill={hovered === p.id ? '#3b82f6' : 'transparent'}
              fillOpacity={0.12}
              stroke={hovered === p.id ? '#1e3a5f' : 'transparent'}
              strokeWidth={1.5}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(hovered === p.id ? null : p.id)}
              className="cursor-pointer"
            >
              <title>{p.name}</title>
            </rect>
          ))}

          {/* Puntos de ejemplo (worm ideal = línea recta) */}
          {Array.from({ length: 21 }, (_, i) => {
            const x = 60 + (i * 280) / 20;
            const y = 140 + (i - 10) * 2;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3}
                fill={hovered ? '#ced4da' : '#1e3a5f'}
                className="transition-colors"
              />
            );
          })}

          {/* Etiquetas de patologías */}
          {PATHOLOGIES.map((p) => (
            <text
              key={p.id}
              x={p.region.x + 4}
              y={p.region.y + 14}
              fontSize="9"
              fill={hovered === p.id ? '#1e3a5f' : '#868e96'}
              fontWeight={hovered === p.id ? 'bold' : 'normal'}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {p.name}
            </text>
          ))}
        </svg>

        <div className="min-w-0 flex-1">
          {activePathology ? (
            <div className="animate-fade-in rounded border border-accent-200 bg-accent-50 p-4">
              <p className="font-semibold text-accent-800">{activePathology.name}</p>
              <p className="mt-1.5 text-sm text-ink-700">{activePathology.description}</p>
              <p className="mt-2 text-sm">
                <span className="font-semibold text-positive-700">Corrección: </span>
                <span className="text-ink-700">{activePathology.correction}</span>
              </p>
            </div>
          ) : (
            <div className="rounded border border-ink-200 bg-ink-50 p-4 text-sm text-ink-600">
              <p className="font-medium text-ink-700">Pasa el cursor sobre las regiones</p>
              <p className="mt-1">
                El worm plot ideal muestra puntos alineados sobre la línea horizontal.
                Las desviaciones sistemáticas indican problemas en el modelo.
              </p>
              <ul className="mt-3 space-y-1">
                {PATHOLOGIES.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setHovered(p.id)}
                      className="text-accent-700 underline hover:no-underline"
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
