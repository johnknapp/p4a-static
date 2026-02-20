import type { App } from 'vue'
import { plugin as formkitPlugin } from '@formkit/vue'
import formkitConfig from './formkit.config'

export default (app: App) => {
  app.use(formkitPlugin, formkitConfig)
}
