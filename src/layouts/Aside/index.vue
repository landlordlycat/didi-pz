<template>
  <el-menu :defaultActive background-color="#545c64" router active-text-color="#ffd04b" text-color="#fff" :collapse>
    <p class="logo-lg text-center text-white my-4 text-lg">{{ !collapse ? 'DODO陪朕' : 'DODO' }}</p>
    <SubMenu :menuData />
  </el-menu>
</template>

<script lang="ts" setup>
import SubMenu from './SubMenu.vue'
import { useMenuStore } from '@/stores/menu'
import { storeToRefs } from 'pinia'
const menuStore = useMenuStore()
const { isCollapse: collapse, routesList } = storeToRefs(menuStore)
const route = useRoute()
const defaultActive = computed(() => (route.path === '/' ? '/dashboard' : route.path))
// const menuData = reactive(router.options.routes[0].children!)
const menuData = computed(() => routesList.value)
</script>
