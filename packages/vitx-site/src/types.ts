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

export interface IVitxSiteConfig {
  componentEntry?: string
  docEntry?: string
  site?: {
    locales?: Record<string, INav>
    simulator?: boolean
    defaultLang?: string
    title?: string
    description?: string
    logo?: string
    lazy?: boolean
    nav?: INav
  }
  build?: IConfig
}
