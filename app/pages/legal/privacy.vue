<script setup lang="ts">
useSeoMeta({
  title: 'Política de privacidad',
  description: 'Conoce cómo recopilamos, usamos y protegemos tu información personal.',
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

    <AppBreadcrumb
      class="mb-6"
      :items="[{ label: 'Inicio', to: '/' }, { label: 'Política de privacidad' }]"
    />

    <h1 class="text-3xl font-bold text-gray-900 mb-2">Política de privacidad</h1>
    <p class="text-sm text-gray-400 mb-10">Última actualización: {{ new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>

    <div class="prose prose-sm max-w-none text-gray-600 space-y-8">

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">1. Datos que recopilamos</h2>
        <p>Recopilamos la información que usted nos proporciona directamente, como:</p>
        <ul class="mt-2 ml-4 list-disc space-y-1 text-sm">
          <li>Nombre y apellido</li>
          <li>Dirección de correo electrónico</li>
          <li>Dirección de entrega</li>
          <li>Número de teléfono (opcional)</li>
          <li>Historial de pedidos</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">2. Cómo usamos sus datos</h2>
        <p>Utilizamos la información recopilada para:</p>
        <ul class="mt-2 ml-4 list-disc space-y-1 text-sm">
          <li>Procesar y gestionar sus pedidos</li>
          <li>Enviar confirmaciones y actualizaciones de estado</li>
          <li>Brindar soporte al cliente</li>
          <li>Mejorar nuestros servicios y experiencia de usuario</li>
        </ul>
        <p class="mt-3">No vendemos ni cedemos sus datos personales a terceros sin su consentimiento explícito.</p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">3. Cookies</h2>
        <p>
          Utilizamos cookies técnicas necesarias para el funcionamiento del sitio (por ejemplo, para mantener su sesión activa y el carrito de compras).
          No utilizamos cookies de rastreo publicitario sin su consentimiento.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">4. Seguridad</h2>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra accesos no autorizados, pérdida o divulgación.
          Las contraseñas se almacenan siempre de forma cifrada.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">5. Sus derechos</h2>
        <p>En cualquier momento puede:</p>
        <ul class="mt-2 ml-4 list-disc space-y-1 text-sm">
          <li>Acceder a sus datos personales desde su cuenta</li>
          <li>Corregir información incorrecta</li>
          <li>Solicitar la eliminación de su cuenta y datos asociados</li>
          <li>Oponerse al procesamiento de sus datos</li>
        </ul>
        <p class="mt-3">
          Para ejercer estos derechos, contáctenos a través de nuestra
          <NuxtLink to="/contact" class="text-indigo-600 hover:underline">página de contacto</NuxtLink>.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">6. Retención de datos</h2>
        <p>
          Conservamos sus datos durante el tiempo necesario para cumplir con los fines descritos en esta política
          y con las obligaciones legales aplicables.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">7. Cambios a esta política</h2>
        <p>
          Podemos actualizar esta política de privacidad periódicamente.
          Le informaremos de cambios relevantes publicando la nueva versión en esta página con la fecha de actualización.
        </p>
      </section>

    </div>
  </div>
</template>
