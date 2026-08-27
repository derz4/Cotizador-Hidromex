// VERSIÓN DE PRUEBA — bloquea TODO sin excepción, sin importar usuario/contraseña.
// Si ves este mensaje en el navegador, el Worker SÍ se está ejecutando (buena señal).
// Si en vez de esto ves el cotizador normal, el Worker NO se está ejecutando.

export default {
  async fetch(request) {
    return new Response('PRUEBA: el Worker SI se esta ejecutando correctamente.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },
};
