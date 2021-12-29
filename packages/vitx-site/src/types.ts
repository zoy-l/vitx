import type { IConfig } from 'vitx'

export enum IFrame {
  vue = 'vue',
  react = 'react'
}

export interface IVitxSiteConfig {
  entry?: string
  site?: {
    locales?: Record<string, any>
    defaultLang: string
  }
  build?: IConfig
}
