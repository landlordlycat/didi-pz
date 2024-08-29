import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import auth from '@/middleware/auth'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import eleIconPlugin from './plugins/eleIcon'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).use(auth)
pinia.use(piniaPluginPersistedstate)

app.use(eleIconPlugin)

app.mount('#app')
