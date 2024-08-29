import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import PanelHead from '@/components/panelHead.vue'
import type { App } from 'vue'

const components = {
  PanelHead
}

export default {
  install: (app: App, _options?: any) => {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }

    for (const [key, component] of Object.entries(components)) {
      app.component(key, component)
    }
  }
}
