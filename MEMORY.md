# Curso GAMLSS - Progreso del Proyecto

## Estado general
- **Fecha de actualización**: 2026-07-17
- **Fase**: 1 (sin WebR, sin backend)
- **Progreso MDX**: 20/20 módulos completos (100%)

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

## Pendiente
- [ ] Generar datos CSV ejecutando los scripts R
- [ ] Generar outputs precomputados (imágenes PNG, consola)
- [ ] Tests unitarios para componentes React nuevos
- [ ] Tests E2E para navegación y accesibilidad
- [ ] Validar sintaxis MDX (build de Next.js)
- [ ] Fase 2: integración WebR para RCell interactivos
