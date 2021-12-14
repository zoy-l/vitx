import 'vitx-site-common/styles'

import { createApp } from 'vue'
import routers from './router'

import App from './App.vue'

createApp(App).use(routers).mount('#vitx-app')
