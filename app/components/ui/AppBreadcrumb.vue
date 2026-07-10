<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{ items: BreadcrumbItem[] }>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
    <template v-for="(item, index) in items" :key="index">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="hover:text-gray-600 transition-colors whitespace-nowrap"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="text-gray-600 truncate max-w-[180px]">{{ item.label }}</span>

      <span v-if="index < items.length - 1" class="text-gray-300">/</span>
    </template>
  </nav>
</template>
