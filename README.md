# Landing Coseex SpA

Landing page B2B estática y responsive, lista para GitHub Pages o Cloudflare Pages.

## Archivos

- `index.html`: estructura y contenido.
- `css/styles.css`: sistema visual y responsive.
- `js/main.js`: navegación, animaciones, FAQ, envío AJAX del formulario y estado persistente del contacto flotante.
- `assets/logo-coseex.png`: logo original suministrado.
- `assets/logo-coseex-hd.png`: versión HD optimizada para el fondo blanco del sitio.
- `assets/hero-logistica-coseex.png`: fotografía editorial generada para el hero.
- `assets/clientes/`: logos corporativos optimizados para el carrusel continuo.

## Pendientes antes de publicar

1. Reemplazar `+56 9 0000 0000` y `56900000000` por el teléfono real.
2. Confirmar o reemplazar `contacto@coseex.cl`.
3. Agregar el video como `assets/video-coseex.mp4` y habilitar su `<source>` dentro del contenedor visible del hero. La fotografía actual funciona como portada mientras tanto.
4. El formulario envía por AJAX a FormSubmit sin abrir la aplicación de correo. Tras publicarlo, hacer un envío de prueba y **confirmar el enlace de activación recibido en `contacto@coseex.cl`**. Hasta activar la dirección, FormSubmit no entregará los mensajes al buzón. Revisar también spam y confirmar que la casilla exista.
5. Los datos del formulario pasan por FormSubmit antes de llegar al correo; revisar esta decisión si se requiere un tratamiento de datos propio o se migra a un hosting con backend.

Para revisar localmente:

```bash
python3 -m http.server 8080
```
