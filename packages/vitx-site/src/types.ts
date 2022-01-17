import type { IConfig } from 'vitx'

export enum IFrame {
  vue = 'vue',
  react = 'react'
}

export type IDocuments = { name: string; path: string; isComponent?: boolean }[]

export type INav = {
  title: string
  items: { title: string; path: string }[]
}[]

export type INavs = Record<string, INav>

export interface IVitxSiteConfig {
  componentEntry?: string
  docEntry?: string
  site?: {
    defaultLang?: string
    title?: string
    description?: string
    logo?: string
    lazy?: boolean
  }
  components?: {
    nav?: INavs | INav
    simulator?: boolean
  }
  build?: IConfig
}
