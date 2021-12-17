// import 'prismjs/components/prism-markup-templating'
// import 'prismjs/components/prism-typescript'
// import 'prismjs/components/prism-javascript'

// import 'prismjs/components/prism-markup'
// import 'prismjs/components/prism-bash'
import { createApp } from 'vue'
// import 'prismjs'
import Counter from './Counter.vue'
import App from './App.vue'

const app = createApp(App)

app.component('Counter', Counter)

app.mount('#app')
