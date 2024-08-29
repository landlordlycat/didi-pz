<script setup lang="ts" generic="T">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition>
      <component :is="Component"></component>
    </transition>
  </RouterView>
</template>
