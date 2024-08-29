import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'

// interface MetaType {
//   describe: string
//   id: string
//   icon: string
//   name: string
//   path: string
// }

export const useMenuStore = defineStore(
  'Menu',
  () => {
    const isCollapse = ref<boolean>(false)
    const selectMenu = ref<RouteMeta[]>([])
    const routesList = ref<RouteRecordRaw[]>([])

    const onToggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }
    const onAddMenuTag = (meta: RouteMeta) => {
      // 检验是否重复
      const isExist = selectMenu.value.some((item) => item.path === meta.path)
      if (isExist) return
      selectMenu.value.push(meta)
    }

    const onDeleteMenuTag = (path: string) => {
      selectMenu.value = selectMenu.value.filter((item) => item.path !== path)
    }

    const onDynamicMenu = (routesData: RouteRecordRaw[]) => {
      // 动态菜单
      const modules = import.meta.glob('@/pages/**/**/*.vue')
      routesData.forEach((route: RouteRecordRaw) => {
        if (!route.children) {
          const url = `/src/pages${route.meta?.path}/index.vue`
          route.component = modules[url]
        } else {
          onDynamicMenu(route.children)
        }
      })
      routesList.value = routesData
    }

    return {
      //states
      isCollapse,
      selectMenu,
      routesList,
      // actions
      onToggleCollapse,
      onAddMenuTag,
      onDeleteMenuTag,
      onDynamicMenu
    }
  },
  {
    persist: {
      paths: ['selectMenu', 'routesList']
    }
  }
)
