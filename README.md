# Curso GAMLSS — Regresión Distribucional Aplicada

Curso interactivo sobre **Modelos Aditivos Generalizados para Localización, Escala y Forma (GAMLSS)** para el Departamento de Estadística de la Universidad Nacional de Colombia, sede Medellín. Curso hermano de *Modelos Mixtos Aplicados a Ciencias de la Salud*, del cual hereda arquitectura, sistema de diseño y patrones pedagógicos.

> "Modelizar la distribución completa es un salto de nivel: se gana profundidad investigativa e interpretabilidad."

## Estado: Fase 1 (contenido estático)

- Bloques de código R con resaltado de sintaxis, botón **Copiar** y panel colapsable **Resultado esperado** (salida de consola máx. 30 líneas expandible con "+", y gráfico PNG precomputado).
- **Sin WebR en esta fase.** La ejecución en el navegador llega en la Fase 2; la API de `CodeBlock` (con `id` global único y `precomputed`) está diseñada para que `RCell` la reutilice sin tocar los MDX.

## Stack

Next.js 15 (App Router) · TypeScript estricto · Tailwind CSS 3 · MDX (`next-mdx-remote` + `remark-math` + `rehype-katex`) · pnpm · Docker.

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # build de producción (valida MDX y frontmatter con Zod)
pnpm typecheck
```

Con Docker: `docker compose up`.

## Estructura

```
src/
├── app/                  # layout, landing, ruta dinámica /cursos/[slug]
├── components/           # CodeBlock, Callout, Quiz, Flashcard, DataTable, Navigation…
├── content/modules/      # 01-….mdx a 20-….mdx (frontmatter validado con Zod)
├── data-gen/             # generadores R de datos simulados (semilla 2026)
└── lib/modules.ts        # loader único de contenido (DIP)
public/
├── data/                 # CSVs (< 1 MB cada uno)
└── precomputed/          # salidas de consola y PNGs por módulo/bloque
scripts/precompute.R      # ejecuta todos los CodeBlock y regenera precomputed/
```

## Flujo de verdad de los resultados

1. Los `precomputed` incluidos en los MDX son **salidas de referencia** marcadas con `[NOTA]`.
2. `Rscript scripts/precompute.R` (requiere R + gamlss local) ejecuta cada bloque identificado por su `id` (`NN/descripcion`) y escribe la salida real en `public/precomputed/NN/`.
3. Regla del curso: si la salida real difiere del texto del módulo, **se corrige el texto**. CI debe fallar si algún bloque tiene código roto.

## Datos

- `public/data/*.csv` se regeneran con `Rscript src/data-gen/*.R` (fuente de verdad, semilla 2026). Los CSV actuales del repo fueron generados con un port equivalente en Python para el arranque de la Fase 1; al ejecutar los scripts R se sobrescriben (los valores muestrales pueden variar levemente por el RNG, sin afectar la narrativa de los módulos, que se revalida con `precompute.R`).
- Datasets de `gamlss.data` (`rent`, `abdom`, `dbbmi`, …) se usan directamente desde R.

## Convenciones

- IDs de bloques: `NN/descripcion-corta`, únicos globalmente.
- Módulos: `NN-slug.mdx` con frontmatter `title, slug, objective, order, datasets, duration, prerequisites`.
- Los componentes MDX se inyectan vía `mdx-components.tsx` (no se escriben `import` dentro de los MDX).
- Notación matemática: Rigby & Stasinopoulos (2005) — $y \sim \mathcal{D}(\mu,\sigma,\nu,\tau)$.

## Documentos de diseño

Ver `../DISENO-CURSO-GAMLSS.md` (temario de 20 módulos y bibliografía curada), `../seed_promt.md`, `../dev_tools.md`, `../gen_content.md` y `../referencia.md`.

## Licencia

Contenido: CC BY-NC-SA 4.0. Código: MIT.
