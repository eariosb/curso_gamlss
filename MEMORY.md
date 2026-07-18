# Curso GAMLSS - Progreso del Proyecto

## Estado general
- **Fecha de actualización**: 2026-07-18
- **Fase**: 1 (sin WebR, sin backend)
- **Progreso MDX**: 20/20 módulos completos (100%)
- **Gráficos precomputados**: 24 PNGs en `public/precomputed/` (20 reales + 4 placeholders del módulo 11)

## Componentes React creados y registrados
| Componente | Archivo | Estado |
|------------|---------|--------|
| ProcessSteps | `src/components/ProcessSteps.tsx` | OK |
| LessonProgressTracker | `src/components/LessonProgressTracker.tsx` | OK |
| ParamTabs | `src/components/ParamTabs.tsx` | OK |
| GaicTable | `src/components/GaicTable.tsx` | OK |
| WormPlotGuide | `src/components/WormPlotGuide.tsx` | OK |
| Gamlss2Accordion | `src/components/Gamlss2Accordion.tsx` | OK |
| DistExplorer | `src/components/DistExplorer.tsx` | OK |
| distributions.ts | `src/lib/distributions.ts` | OK |

Todos registrados en `src/components/mdx-components.tsx`.

## Scripts R de generación de datos
| Script | Dataset | Módulo(s) |
|--------|---------|-----------|
| `triangulo_ibnr_caucion.R` | triangulo_caucion | 16 |
| `demanda_skus_logistica.R` | demanda_skus | 13 |
| `cementos_cauca.R` | cementos | 1, 5, 7 |
| `fatiga_cables.R` | fatiga | 12 |
| `recuperaciones_acc.R` | recuperaciones_acc | 9, 15 |
| `frecuencia_polizas.R` | frecuencia_polizas | 8, 17 |
| `cartera_pd.R` | cartera_pd | 6, 14, 19 |
| `lotes_defectuosos.R` | lotes_defectuosos | 9 |

## Módulos MDX completos
### Bloque I: Fundamentos (Módulos 1-5)
1. `01-por-que-modelar-mas-que-la-media.mdx` - Motivación (preexistente)
2. `02-marco-gamlss.mdx` - Marco matemático GAMLSS
3. `03-arsenal-distribuciones.mdx` - Catálogo de distribuciones
4. `04-diagnostico-residuos-worm-plots.mdx` - Diagnóstico y worm plots
5. `05-suavizados-p-splines.mdx` - P-splines y no linealidad

### Bloque II: Construcción (Módulos 6-10)
6. `06-efectos-aleatorios.mdx` - Efectos aleatorios en GAMLSS
7. `07-seleccion-modelos-gaic.mdx` - Selección de modelos y GAIC
8. `08-datos-conteo.mdx` - Poisson, NBI y ceros inflados
9. `09-proporciones-beta-beinf.mdx` - Beta e infladas en 0 y 1
10. `10-modelando-colas-pesadas-bct-gb2.mdx` - BCT y GB2

### Bloque III: Dominios (Módulos 11-17)
11. `11-centiles-curvas-referencia-lms.mdx` - Centiles y método LMS
12. `12-confiabilidad-censura.mdx` - Weibull y censura
13. `13-demanda-intermitente-inventarios.mdx` - Demanda intermitente
14. `14-riesgo-credito-pd.mdx` - PD con modelos binomiales
15. `15-lgd-beinf.mdx` - LGD con BEINF
16. `16-reservas-ibnr-triangulos.mdx` - Reservas IBNR
17. `17-tarificacion-frecuencia-severidad.mdx` - Tarificación integrada

### Bloque IV: Frontera (Módulos 18-20)
18. `18-gamlss2-nuevo-ecosistema.mdx` - gamlss2
19. `19-proyecto-final-ifrs9.mdx` - Proyecto IFRS 9 completo
20. `20-horizontes-bayesian-webr.mdx` - Bayesian GAMLSS y WebR

## Gráficos precomputados

### Imágenes existentes (20 PNGs reales generados con R)
- `01/`: explorar-carteras.png, histdist-severidad.png
- `02/`: gamlss-gamma-mu.png, gamlss-gamma-mu-sigma.png, residuos-rapido.png
- `03/`: fitdist-severidad.png
- `04/`: worm-plot-dbbmi.png, worm-plot-falla.png
- `05/`: cementos-modelos.png
- `06/`: pd-efecto-aleatorio.png
- `07/`: balance-sesgo-varianza.png
- `09/`: lotes-beinf.png
- `10/`: bct-gb2-comparacion.png
- `11/`: centiles-dbbmi.png, lmst-extension.png
- `12/`: weibull-censura.png
- `13/`: estacionalidad-cy.png
- `14/`: pd-modelo-completo.png
- `15/`: lgd-beinf-completo.png
- `17/`: simulacion-agregada.png

### Placeholders (4 PNGs del módulo 11, pendientes de regenerar con R)
- `11/`: lms-parametros.png, worm-plot-lms.png, comparacion-lms-lmst.png, centiles-severidad-plot.png

### Cómo regenerar todos los gráficos
1. Instalar R con paquetes: `gamlss`, `gamlss.data`, `survival`
2. Ejecutar: `pnpm precompute` (equivale a `Rscript src/data-gen/precompute_outputs.R`)
3. Los PNGs se generan en `public/precomputed/` a 150 DPI, 1000x700px
4. Verificar: `pnpm precompute:check`

### Fallback visual
El componente `CodeBlock` tiene `onError` en `<img>`: si un PNG falta, muestra
"Gráfico no disponible temporalmente" con instrucción de ejecutar el código R.

### Calidad gráfica del script R
- Paleta consistente: `COL_PRIMARY` (#1e3a5f), `COL_SECONDARY` (#2e7d32), `COL_ACCENT` (#e67e22), `COL_DANGER` (#c0392b)
- Tema limpio: `set_clean_par()` con fondo blanco, grid sutil, fuentes legibles
- Anotaciones pedagógicas en worm plots (patologías señaladas)
- `histDist` con colores distinguibles y leyenda clara
- `centiles` con bandas de confianza y etiquetas descriptivas

## Pendiente
- [ ] Regenerar los 4 placeholders del módulo 11 ejecutando R con `pnpm precompute`
- [ ] Tests unitarios para componentes React nuevos
- [ ] Tests E2E para navegación y accesibilidad
- [ ] Fase 2: integración WebR para RCell interactivos
