# Landing Coseex SpA

Landing page B2B estática y responsive, publicada en `https://coseex.cl/`.

## Archivos

- `index.html`: estructura y contenido.
- `css/styles.css`: sistema visual y responsive.
- `js/main.js`: navegación, animaciones, FAQ, envío AJAX del formulario y estado persistente del contacto flotante.
- `assets/logo-coseex.png`: logo original suministrado.
- `assets/logo-coseex-hd.png`: versión HD optimizada para el fondo blanco del sitio.
- `assets/hero-logistica-coseex.png`: fotografía editorial generada para el hero.
- `assets/hero-logistica-coseex.webp`: versión optimizada que carga en la página.
- `assets/clientes/`: logos corporativos optimizados para el carrusel continuo.
- `sitemap.xml`: índice de las URL canónicas para buscadores.
- `robots.txt`: indica la ubicación del sitemap; Cloudflare puede anteponer sus propias reglas administradas.

## Pendientes y puesta en marcha

1. El formulario envía por AJAX a FormSubmit sin abrir la aplicación de correo; la dirección `contacto@coseex.cl` y el formulario de `https://coseex.cl/` ya fueron activados y probados.
2. Los datos del formulario pasan por FormSubmit antes de llegar al correo; revisar esta decisión si se requiere un tratamiento de datos propio o se migra a un hosting con backend.
3. Mantener `sitemap.xml` actualizado solo cuando cambie sustancialmente la página. Su `<lastmod>` debe reflejar una fecha real de modificación.
4. Revisar la indexación, consultas y posición media en Google Search Console una vez añadida la propiedad `coseex.cl` y enviado el sitemap.

Para revisar localmente:

```bash
python3 -m http.server 8080
```
