import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/** 创建带持久化插件的 Pinia 实例 */
export function setupPinia() {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  return pinia
}
