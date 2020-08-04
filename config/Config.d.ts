/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    trableMasterUrl: string
    apiKey: string
    sentryUrl?: any
    configLevel: string
    nodeConfig: NodeConfig
  }
  interface NodeConfig {
    defaultTxPower: number
    minMeasurements: number
    kalman: Kalman
  }
  interface Kalman {
    R: number
    Q: number
  }
  export const config: Config
  export type Config = IConfig
}
