/// <reference types="vite/client" />

import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    id?: string
    name?: string
    icon?: string
    path?: string
    describe?: string
  }
}
