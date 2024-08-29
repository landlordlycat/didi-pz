<template>
  <div class="h-full">
    <el-container>
      <Aside />

      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <PanelHead />
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts" generic="T">
import Aside from './Aside/index.vue'
import PanelHead from '@/components/PanelHead.vue'

import Header from './Header/index.vue'
</script>
<style lang="postcss" scoped>
.el-container {
  @apply h-full;
}
.el-header {
  @apply flex justify-between w-full border-b-2 border-gray-200;
}
</style>
