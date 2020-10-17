/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    trableMasterUrl: string
    apiKey: string
    sentryUrl?: any
    loggerLevel: string
    nodeConfig: NodeConfig
  }
  interface NodeConfig {
    rssiAt1m: number
    pathLossParam: number
  }
  export const config: Config
  export type Config = IConfig
}