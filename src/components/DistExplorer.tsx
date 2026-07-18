'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { DISTRIBUTIONS, getDistribution, type DistParams } from '@/lib/distributions';

const CANVAS_W = 520;
const CANVAS_H = 220;
const PAD = 36;

/**
 * Explorador interactivo de distribuciones GAMLSS.
 *
 * Permite seleccionar una distribución y manipular sus parámetros (μ, σ, ν, τ)
 * mediante sliders. Dibuja en tiempo real la PDF y la CDF sobre un canvas.
 *
 * Las fórmulas están implementadas en `lib/distributions.ts` usando la
 * parametrización de Rigby et al. (2019).
 */
export function DistExplorer() {
  const [distKey, setDistKey] = useState('NO');
  const dist = getDistribution(distKey)!;

  const [params, setParams] = useState<DistParams>({
    mu: dist.defaults.mu ?? 0,
    sigma: dist.defaults.sigma ?? 1,
    nu: dist.defaults.nu ?? 0,
    tau: dist.defaults.tau ?? 0,
  });

  const [showCDF, setShowCDF] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset params when distribution changes
  useEffect(() => {
    const d = getDistribution(distKey)!;
    setParams({
      mu: d.defaults.mu ?? 0,
      sigma: d.defaults.sigma ?? 1,
      nu: d.defaults.nu ?? 0,
      tau: d.defaults.tau ?? 0,
    });
  }, [distKey]);

  const { xMin, xMax, points } = useMemo(() => {
    const [lo, hi] = dist.xRange(params);
    const N = 300;
    const xs = Array.from({ length: N }, (_, i) => lo + ((hi - lo) * i) / (N - 1));
    const ys = xs.map((x) => (showCDF ? dist.cdf(x, params) : dist.pdf(x, params)));
    return { xMin: lo, xMax: hi, points: xs.map((x, i) => ({ x, y: ys[i] })) };
  }, [dist, params, showCDF]);

  const yMax = useMemo(() => {
    const maxVal = Math.max(...points.map((p) => p.y));
    return maxVal > 0 ? maxVal * 1.1 : 1;
  }, [points]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Axes area
    const plotW = CANVAS_W - PAD - 10;
    const plotH = CANVAS_H - PAD - 16;
    const ox = PAD;
    const oy = CANVAS_H - PAD;

    // Grid lines
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const gy = oy - (plotH * i) / 4;
      ctx.beginPath();
      ctx.moveTo(ox, gy);
      ctx.lineTo(ox + plotW, gy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + plotW, oy);
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox, oy - plotH);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(xMin.toFixed(1), ox, oy + 14);
    ctx.fillText(xMax.toFixed(1), ox + plotW, oy + 14);
    ctx.textAlign = 'right';
    ctx.fillText('0', ox - 4, oy + 3);
    ctx.fillText(yMax.toFixed(showCDF ? 2 : 4), ox - 4, oy - plotH + 3);

    // Curve
    const toPx = (x: number) => ox + ((x - xMin) / (xMax - xMin)) * plotW;
    const toPy = (y: number) => oy - (y / yMax) * plotH;

    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (const p of points) {
      if (!isFinite(p.y) || p.y < 0) continue;
      const px = toPx(p.x);
      const py = toPy(Math.min(p.y, yMax));
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Fill under curve (PDF only)
    if (!showCDF && started) {
      ctx.lineTo(toPx(points[points.length - 1].x), oy);
      ctx.lineTo(toPx(points[0].x), oy);
      ctx.closePath();
      ctx.fillStyle = 'rgba(30, 58, 95, 0.08)';
      ctx.fill();
    }

    // Title
    ctx.fillStyle = '#343a40';
    ctx.font = '11px ui-sans-serif, system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${dist.label} — ${showCDF ? 'CDF' : 'PDF'}`,
      ox,
      14
    );
  }, [dist, points, xMin, xMax, yMax, showCDF]);

  useEffect(() => {
    const raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  const paramDefs = dist.params;

  function updateParam(key: keyof DistParams, value: number) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-200 bg-white shadow-sm">
      <div className="border-b border-ink-200 bg-accent-50 px-4 py-2.5">
        <p className="flex items-center gap-2 text-sm font-semibold text-accent-800">
          <span aria-hidden>🔬</span>
          Explorador de distribuciones GAMLSS
        </p>
        <p className="mt-0.5 text-xs text-ink-500">
          Selecciona una familia y ajusta los parámetros para ver la densidad en tiempo real.
        </p>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_220px]">
        {/* Canvas + controls */}
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Distribución:
              <select
                value={distKey}
                onChange={(e) => setDistKey(e.target.value)}
                className="ml-2 rounded border border-ink-300 bg-white px-2 py-1 text-sm font-normal text-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                {DISTRIBUTIONS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <span className="rounded bg-ink-100 px-2 py-0.5 text-xs text-ink-600">
              Soporte: {dist.support}
            </span>
            <button
              type="button"
              onClick={() => setShowCDF((v) => !v)}
              className={clsx(
                'rounded px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
                showCDF
                  ? 'bg-accent-600 text-white hover:bg-accent-700'
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              )}
            >
              {showCDF ? 'Mostrar PDF' : 'Mostrar CDF'}
            </button>
          </div>

          <canvas
            ref={canvasRef}
            style={{ width: CANVAS_W, height: CANVAS_H, maxWidth: '100%' }}
            className="rounded border border-ink-200"
            role="img"
            aria-label={`Gráfico de ${showCDF ? 'CDF' : 'PDF'} para ${dist.label}`}
          />
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          {paramDefs.map((key) => {
            const label = { mu: 'μ', sigma: 'σ', nu: 'ν', tau: 'τ' }[key];
            const value = params[key];
            const range = PARAM_RANGES[key];
            return (
              <div key={key}>
                <label className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink-700">{label}</span>
                  <span className="font-mono text-xs text-accent-700">
                    {value.toFixed(2)}
                  </span>
                </label>
                <input
                  type="range"
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={value}
                  onChange={(e) => updateParam(key, parseFloat(e.target.value))}
                  className="mt-1 w-full accent-accent-600"
                  aria-label={`Parámetro ${label}`}
                />
              </div>
            );
          })}

          <div className="rounded bg-ink-50 px-3 py-2 text-xs text-ink-500">
            <p>
              <span className="font-medium">Parametrización:</span> Rigby et al. (2019).
              Los sliders cubren rangos típicos para cada parámetro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PARAM_RANGES: Record<string, { min: number; max: number; step: number }> = {
  mu: { min: 0.1, max: 200, step: 0.1 },
  sigma: { min: 0.01, max: 3, step: 0.01 },
  nu: { min: -3, max: 3, step: 0.05 },
  tau: { min: 0.5, max: 50, step: 0.5 },
};
