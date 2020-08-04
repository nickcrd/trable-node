import logger from "./utils/logger";
import {config, IConfig} from 'node-config-ts'
import sentryLogger from "./loaders/sentryLogger";
import axios, {AxiosInstance} from 'axios'
import AuthManager from "./managers/AuthManager";
import DeviceManager from "./managers/DeviceManager";

export class TrableApp {
    readonly config: IConfig
    public apiClient: AxiosInstance

    constructor() {
        logger.debug(config.trableMasterUrl)
        this.config = config
        this.apiClient = axios.create({
            baseURL: config.trableMasterUrl,
            headers: { 'Authorization': 'Bearer ' + config.apiKey }
        })
    }

    public initializeApp() {
        logger.info("Initializing app...")
        sentryLogger(this)
    }

    public registerModules() {
        logger.info("Registering Modules...")
        AuthManager.verifyApiKey()
        DeviceManager.setupScanning()
    }

    public start() {
        logger.info("Starting Trable Node app...")
        this.initializeApp()
        this.registerModules()
        logger.info("Finished startup")
        return this
    }

}

export const app = new TrableApp()
app.start()