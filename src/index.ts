import { App, Plugin } from 'vue-demi'
import VirtualList from './VirtualList.vue'

export { VirtualList }

const _default = VirtualList as typeof VirtualList & { install: Plugin['install'] }

_default.install = (app: App) => {
  app.component('VirtualList', VirtualList)
}

export default _default
