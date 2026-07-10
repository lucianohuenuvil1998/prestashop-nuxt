<script setup lang="ts">
useSeoMeta({
  title: 'Términos y condiciones',
  description: 'Conoce nuestros términos y condiciones de uso y compra.',
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

    <AppBreadcrumb
      class="mb-6"
      :items="[{ label: 'Inicio', to: '/' }, { label: 'Términos y condiciones' }]"
    />

    <h1 class="text-3xl font-bold text-gray-900 mb-2">Términos y condiciones</h1>
    <p class="text-sm text-gray-400 mb-10">Última actualización: {{ new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>

    <div class="prose prose-sm max-w-none text-gray-600 space-y-8">

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">1. Aceptación de los términos</h2>
        <p>
          Al acceder y utilizar este sitio web, el usuario acepta quedar vinculado por los presentes términos y condiciones de uso.
          Si no está de acuerdo con alguna parte de estos términos, por favor no utilice nuestro sitio.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">2. Uso del sitio</h2>
        <p>
          El usuario se compromete a utilizar el sitio únicamente para fines lícitos y de manera que no infrinja los derechos de terceros.
          Queda prohibido el uso del sitio para actividades fraudulentas, spam o cualquier acto que pudiera dañar la reputación del servicio.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">3. Productos y precios</h2>
        <p>
          Nos reservamos el derecho de modificar los precios, disponibilidad y descripción de los productos en cualquier momento sin previo aviso.
          Los precios exhibidos incluyen los impuestos aplicables salvo que se indique lo contrario.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">4. Proceso de compra</h2>
        <p>
          Una vez confirmada la compra, se enviará un correo electrónico de confirmación al usuario.
          El contrato de compra queda perfeccionado en el momento en que el usuario recibe dicha confirmación.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">5. Devoluciones</h2>
        <p>
          El usuario dispone de un plazo de 30 días desde la recepción del pedido para solicitar la devolución del producto,
          siempre que se encuentre en perfectas condiciones y en su embalaje original.
          Para iniciar una devolución, comuníquese a través de nuestro formulario de contacto.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">6. Limitación de responsabilidad</h2>
        <p>
          En ningún caso seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del sitio.
          Nuestra responsabilidad máxima estará limitada al monto de la compra realizada.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">7. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de actualizar estos términos en cualquier momento.
          Le notificaremos de cambios significativos mediante un aviso destacado en el sitio o por correo electrónico.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-3">8. Contacto</h2>
        <p>
          Para consultas sobre estos términos, puede comunicarse con nosotros a través de nuestra
          <NuxtLink to="/contact" class="text-indigo-600 hover:underline">página de contacto</NuxtLink>.
        </p>
      </section>

    </div>
  </div>
</template>
