// Protege TODO el sitio con usuario y contraseña (HTTP Basic Auth) antes de servir los archivos estáticos.
// El navegador muestra su propio cuadro nativo de usuario/contraseña — funciona en iPhone, Android y computadora.
//
// Configura la contraseña en: tu proyecto en Cloudflare > Settings > Variables and Secrets
//   BASIC_AUTH_USER  (opcional, si no lo pones se usa "hidromex")
//   BASIC_AUTH_PASS  (obligatorio para que la protección quede activa)
// Después de agregar las variables, vuelve a desplegar (o haz un pequeño cambio y sube de nuevo) para que tomen efecto.

export default {
  async fetch(request, env) {
    const validUser = env.BASIC_AUTH_USER || 'hidromex';
    const validPass = env.BASIC_AUTH_PASS;

    // Si todavía no se configuró la contraseña, dejamos pasar sin bloquear
    // (para que el sitio no se quede inaccesible por un olvido de configuración).
    if (validPass) {
      const authHeader = request.headers.get('Authorization');
      let autorizado = false;

      if (authHeader && authHeader.startsWith('Basic ')) {
        try {
          const decoded = atob(authHeader.slice(6));
          const separatorIndex = decoded.indexOf(':');
          const user = decoded.slice(0, separatorIndex);
          const pass = decoded.slice(separatorIndex + 1);
          if (user === validUser && pass === validPass) {
            autorizado = true;
          }
        } catch (e) {
          // credenciales mal formadas, se trata igual que "no autorizado"
        }
      }

      if (!autorizado) {
        return new Response('Acceso restringido. Ingresa el usuario y la contraseña.', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Cotizador Hidromex Energy", charset="UTF-8"',
          },
        });
      }
    }

    // Credenciales correctas (o sin contraseña configurada): servir el sitio estático normalmente
    return env.ASSETS.fetch(request);
  },
};
