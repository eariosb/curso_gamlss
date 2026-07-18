import type { NextConfig } from 'next';

/**
 * Fase 1 (estática): sin WebR. Los bloques de código R se renderizan con
 * resaltado de sintaxis y resultados precomputados desde /public/precomputed.
 *
 * Preparación Fase 2 (WebR): cuando se integre la ejecución en el navegador,
 * añadir aquí los headers COOP/COEP (ver curso MLM, next.config.js) y el
 * fallback de webpack para `fs`/`path`. Ningún componente actual necesita
 * cambios: `CodeBlock` conservará su API y `RCell` se añadirá como variante
 * ejecutable.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
