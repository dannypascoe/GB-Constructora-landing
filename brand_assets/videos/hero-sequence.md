# Secuencia de video del Hero

## Archivo a usar
**`hero-sequence.mp4`** — este es el único archivo que el Hero debe cargar. Ya está generado y confirmado (unión de `hero-1.mp4` + `hero-2.mp4`, sin cortes, se ve completo).

`hero-1.mp4` y `hero-2.mp4` son los clips fuente originales — se conservan como referencia, pero **no se usan directamente en el sitio**, ya quedaron unidos en `hero-sequence.mp4`.

## Comportamiento decidido
- Se reproduce **una sola vez** de principio a fin (terreno → casa terminada).
- Al terminar, el video se queda congelado en el último frame (la casa terminada). **No hace loop.**
- Arranca **al cargar la página** (no al hacer scroll) — el Hero ya es visible desde que se abre el sitio.
- Sin audio. El atributo `muted` es obligatorio en el `<video>`: los navegadores solo permiten autoplay sin interacción del usuario si el video va muteado.

## Atributos del `<video>` en el Hero
```html
<video autoplay muted playsinline>
  <source src="brand_assets/videos/hero-sequence.mp4" type="video/mp4">
</video>
```
`playsinline` es obligatorio para que en iPhone/Safari el video se reproduzca dentro del Hero en vez de forzar pantalla completa.