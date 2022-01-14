# vite-plugin-mds

Markdown for Vite

- Use Markdown as Vue components
- Use Vue components in Markdown

> ℹ️ **0.2.x is for Vite 2 and 0.1.x is for Vite 1**

## Install

Install

```bash
npm i vite-plugin-mds -D # yarn add vite-plugin-mds -D
```

Add it to `vite.config.js`

```ts
// vite.config.js
import Vue from '@vitejs/plugin-vue'
import { vitePluginMarkdownReact } from 'vite-plugin-mds'

export default {
  plugins: [Vue(), vitePluginMarkdownReact()]
}
```

```ts
// vite.config.js
import React from '@vitejs/plugin-react'
import { vitePluginMarkdownVue } from 'vite-plugin-mds'

export default {
  plugins: [React(), vitePluginMarkdownVue()]
}
```
