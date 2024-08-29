import auth from '@/router'
import { getItem } from '@/utils/localStorage'
import { State } from '@/content/state'
import { useMenuStore } from '@/stores/menu'
//dynamic load menu
let isAddRoutes = false
auth.beforeEach(async (to, _from) => {
  const { token } = getItem(State.UserInfo)

  if (token) {
    //dynamic load menu
    const menuStore = useMenuStore()
    menuStore.onDynamicMenu(getItem(State.Menu).routesList)
    if (!to.redirectedFrom && !isAddRoutes) {
      menuStore.routesList.forEach((item) => {
        auth.addRoute('Main', item)
      })
      isAddRoutes = true

      return { ...to, replace: true }
    } else {
      if (to.path === '/login') {
        return '/'
      } else {
        return
      }
    }
  } else {
    if (to.path === '/login') {
      return
    }
    return '/login'
  }
})

export default auth
