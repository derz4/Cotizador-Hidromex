// Protege TODO el sitio con usuario y contraseña (HTTP Basic Auth).
// El navegador muestra su propio cuadro nativo de usuario/contraseña — funciona en iPhone, Android y computadora.
//
// Configura la contraseña en: Cloudflare Pages > tu proyecto > Settings > Environment variables
//   BASIC_AUTH_USER  (opcional, si no lo pones se usa "hidromex")
//   BASIC_AUTH_PASS  (obligatorio para que la protección quede activa)
// Después de agregar las variables, vuelve a hacer un deploy (Retry deployment) para que tomen efecto.

export async function onRequest(context) {
  const { request, env, next } = context;

  const validUser = env.BASIC_AUTH_USER || 'hidromex';
  const validPass = env.BASIC_AUTH_PASS;

  // Si todavía no se configuró la contraseña, dejamos pasar sin bloquear
  // (para que el sitio no se quede inaccesible por un olvido de configuración).
  if (!validPass) {
    return next();
  }

  const authHeader = request.headers.get('Authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const decoded = atob(authHeader.slice(6));
      const separatorIndex = decoded.indexOf(':');
      const user = decoded.slice(0, separatorIndex);
      const pass = decoded.slice(separatorIndex + 1);
      if (user === validUser && pass === validPass) {
        return next();
      }
    } catch (e) {
      // credenciales mal formadas, se trata igual que "no autorizado"
    }
  }

  return new Response('Acceso restringido. Ingresa el usuario y la contraseña.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Cotizador Hidromex Energy", charset="UTF-8"',
    },
  });
}
