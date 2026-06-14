import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import App from './App.vue'
import router from './router'
import { setupPinia } from './stores'

const app = createApp(App)

app.use(setupPinia())
app.use(router)
app.use(ArcoVue)

app.mount('#app')
