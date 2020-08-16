import logger from "./utils/logger";
import {config, IConfig} from "node-config-ts"
import sentryLogger from "./loaders/sentryLogger";
import axios, {AxiosInstance} from 'axios'
import AuthManager from "./managers/AuthManager";
import DeviceManager from "./managers/DeviceManager";

export class TrableApp {
    readonly config: IConfig
    public apiClient: AxiosInstance

    constructor() {
        this.config = config
        sentryLogger(this)

        logger.verbose("Building API Client with Master URL: " + config.trableMasterUrl)
        this.apiClient = axios.create({
            baseURL: config.trableMasterUrl,
            headers: { 'Authorization': 'Bearer ' + config.apiKey }
        })
    }

    public registerModules() {
        AuthManager.verifyApiKey()
        DeviceManager.setupScanning()
    }

    public start() {
        this.registerModules()
        return this
    }

}

export const app = new TrableApp()
app.start()