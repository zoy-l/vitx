import type { IConfig } from 'vitx'

export enum IFrame {
  vue = 'vue',
  react = 'react'
}

export interface IVitxSiteConfig {
  entry?: string
  site?: {
    locales?: Record<string, any>
    defaultLang?: string
    title?: string
    description?: string
    logo?: string
    lazy?: boolean
  }
  build?: IConfig
}
