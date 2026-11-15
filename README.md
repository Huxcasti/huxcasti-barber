# Huxcasti Barber

**Prototipo inicial — 15 de noviembre de 2026**

Plataforma en desarrollo para crear páginas de barberías personalizadas y un sistema de reservas propio de Huxcasti.

## Estado actual

El archivo `index.html` contiene una demostración en español que se adapta al iPhone. Se puede probar directamente en un navegador una vez publicada como sitio de pruebas:

- **Página del cliente:** ver barbería, fotos y precios; solicitar citas de prueba.
- **Panel del barbero:** editar nombre, descripción, color, servicios y precios, tres enlaces de fotos y la política de depósito; revisar solicitudes simuladas.
- **Panel Huxcasti:** crear otros negocios de ejemplo y seleccionarlos.

**Importante:** la demostración no tiene autenticación, roles, servidores, sincronización, disponibilidad en tiempo real ni cobros reales. La información se guarda en `localStorage` del navegador y se puede perder. No debe utilizarse con clientes, pagos o información personal real. Cualquier persona con el enlace puede acceder a todas las vistas de la demo.

## PayPal y ATH Móvil

Los botones **no conectan cuentas ni aceptan pagos**. Son ejemplos para diseñar el flujo del barbero.

- **PayPal:** para que cada barbero cobre en su propia cuenta, necesitamos evaluar y solicitar el acceso que corresponda a las funciones de onboarding de comerciantes para plataformas. La autorización debe producirse en el entorno oficial de PayPal, sin recoger contraseñas ni tarjetas. No habilitaremos el cobro hasta comprobar la aprobación, la integración y las respuestas del servidor.
- **ATH Móvil:** cada barbero deberá utilizar su propia cuenta **ATH Business** y el método oficial de integración que aplique. No basta con un teléfono o pATH. Nunca guardaremos credenciales privadas en este repositorio, en el código del navegador ni en la conversación.

Consulta documentación oficial antes de integrar: https://developer.paypal.com/platforms/ y https://ath.business/

## Próximos pasos para el producto real

1. Preparar autenticación con roles: dueño de plataforma, dueño de negocio, barbero y cliente.
2. Separar el frontend y un backend seguro. Usar PostgreSQL/Supabase con aislamiento entre barberías y políticas de acceso.
3. Construir disponibilidad por profesional, servicios, duración, descansos y prevención de reservas duplicadas mediante operaciones atómicas en el servidor.
4. Desarrollar calendario real, cancelación, historial y notificaciones.
5. Integrar PayPal/ATH Móvil con conexión validada por cuenta de negocio, comprobación de depósitos por servidor, estados de pago y gestión de reembolsos.
6. Realizar pruebas y revisar seguridad, protección de datos, términos y soporte antes de ofrecerlo comercialmente.

## Abrir la demo

Abrir `index.html` localmente desde un navegador compatible o publicarlo en un entorno de pruebas. **No publicar todavía como sistema de reservas productivo.**

El repositorio debe mantenerse **privado** mientras se desarrolla la autenticación y el backend.

© Huxcasti — demostración interna.
