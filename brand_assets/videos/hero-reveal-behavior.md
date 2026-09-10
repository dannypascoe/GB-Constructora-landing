# Comportamiento de aparición del Hero (navbar + texto + overlay)

## Estado inicial — mientras el video se reproduce
- Se ve **solo el video**, a pantalla completa.
- El navbar/menú superior está oculto.
- El texto del Hero (título, descripción, botones "Solicitar cotización" / "Ver proyectos") está oculto.
- No hay sombreado/overlay oscuro sobre el video — se ve el video limpio, sin nada encima.

## Al terminar el video (evento `ended`)
El video ya se queda congelado en el último frame (casa terminada) — ese comportamiento no cambia. Lo nuevo, disparado en cuanto termina:
- Aparece el navbar/menú superior con fade-in.
- Aparece el texto del Hero con fade-in.
- Aparece el overlay oscuro sobre el video, también con fade-in (para que el texto tenga contraste suficiente).
- Todo esto ocurre **una sola vez**, igual que el video (no hay loop, así que tampoco se repite la animación).

## Implementación sugerida
- Escuchar el evento nativo `ended` del `<video>`, no un `setTimeout` — así no se desincroniza si el video tarda en cargar o el usuario tiene conexión lenta.
- Navbar, texto y overlay existen en el DOM desde el inicio con `opacity: 0; pointer-events: none;`, y pasan a `opacity: 1; pointer-events: auto;` al recibir el evento. Esto evita layout shift y evita que alguien haga click en el navbar antes de tiempo.
- Transición sugerida: ~700ms, ease-out. Los tres elementos aparecen al mismo tiempo (fácilmente ajustable a escalonado si se prefiere).

```js
const video = document.querySelector('#hero-video');
const navbar = document.querySelector('#navbar');
const heroText = document.querySelector('#hero-text');
const overlay = document.querySelector('#hero-overlay');

video.addEventListener('ended', () => {
  navbar.classList.add('is-visible');
  heroText.classList.add('is-visible');
  overlay.classList.add('is-visible');
});
```

```css
#navbar, #hero-text, #hero-overlay {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.7s ease-out;
}
#navbar.is-visible, #hero-text.is-visible, #hero-overlay.is-visible {
  opacity: 1;
  pointer-events: auto;
}
```
