<template>
  <div class="content flex items-center justify-between flex-1">
    <div class="left">
      <div class="flex items-center space-x-1">
        <div class="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5]" @click="onToggleCollapse"><gg-format-indent-decrease v-if="!isCollapse" style="width: auto; height: 30px" /> <gg-format-indent-increase v-else style="width: auto; height: 30px" /></div>
        <ul class="flex space-x-1 h-[40px]">
          <li v-for="(item, index) in selectMenuList" :key="item.path" :class="{ 'bg-[#f5f5f5]': item.path === $route.path }" class="flex items-center space-x-1 hover:bg-[#f5f5f5] cursor-pointer p-3 border-1 border border-gray-100">
            <router-link :to="item.path!" class="flex items-center space-x-1">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span> {{ item.name }}</span>
            </router-link>
            <gg-close @click="handleCloseMenu(item.path!, index)" />
          </li>
        </ul>
      </div>
    </div>

    <div class="right">
      <el-dropdown @command="handleCommand" trigger="click">
        <div class="el-dropdown-link flex items-center space-x-1">
          <el-avatar :src="userInfo.avatar" />
          <p class="user-name">{{ userInfo.name }}</p>
          <ep-arrow-down />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { State } from '@/content/state'
import { useMenuStore } from '@/stores/menu'
import { getItem, removeItem } from '@/utils/localStorage'
import { storeToRefs } from 'pinia'
const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()
const { isCollapse, selectMenu } = storeToRefs(menuStore)
const { onToggleCollapse, onDeleteMenuTag } = menuStore
const selectMenuList = computed(() => selectMenu.value)
const userInfo = computed(() => getItem(State.UserInfo).userInfo)
const handleCloseMenu = (path: string, index: number) => {
  onDeleteMenuTag(path)
  if (route.path !== path) return

  if (!selectMenu.value.length) {
    router.push('/')
  } else {
    if (selectMenu.value.length <= index) {
      router.push(selectMenu.value[index - 1].path!)
    } else {
      router.push(selectMenu.value[index].path!)
    }
  }
}

const handleCommand = (command: any) => {
  if (command === 'cancel') {
    removeItem(State.UserInfo)
    removeItem(State.Menu)
    ElMessage.success('退出成功')
    router.replace('/login')
  }
}
</script>

<style lang="less"></style>
