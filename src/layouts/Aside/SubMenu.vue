<template>
  <template v-for="(item, i) in menuData">
    <el-menu-item v-if="!item.children || item.children.length === 0" :index="item.meta?.path" @click="handleClick(item)" :key="i">
      <el-icon size="20">
        <component :is="item.meta?.icon!"></component>
      </el-icon>
      <template #title>{{ item.meta?.name }}</template>
    </el-menu-item>

    <el-sub-menu v-else :index="item.name">
      <template #title>
        <el-icon>
          <component :is="item.meta?.icon"></component>
        </el-icon>
        <span>{{ item.meta?.name }}</span>
      </template>
      <SubMenu :menuData="item.children!" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts" generic="T">
import type { RouteRecordRaw } from 'vue-router'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()
const { onAddMenuTag } = menuStore
const props = defineProps<{
  menuData: RouteRecordRaw[]
}>()
const { menuData } = toRefs(props)

const handleClick = (item: RouteRecordRaw) => {
  onAddMenuTag(item.meta!)
}
</script>
