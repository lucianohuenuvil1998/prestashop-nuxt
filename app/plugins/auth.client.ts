/**
 * Plugin de inicialización de sesión (solo cliente).
 *
 * Se ejecuta una vez al cargar la app. Llama a GET /api/auth/me:
 * - Si la cookie de sesión existe y es válida → hidrata el store con los datos del usuario.
 * - Si no existe o expiró → el store queda vacío (usuario no autenticado).
 *
 * Esto permite que el middleware de rutas protegidas funcione correctamente
 * desde el primer render en el cliente.
 */

export default defineNuxtPlugin(async () => {
  const { fetchCurrentUser } = useAuth()
  await fetchCurrentUser()
})
