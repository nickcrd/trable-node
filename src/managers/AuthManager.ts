import GenericResponse from "../models/GenericResponse";
import {app} from "../app";
import logger from "../utils/logger";
import {response} from "express";

export class AuthManager {
    public async verifyApiKey() {
        try {
            const response = await app.apiClient.get<GenericResponse>('api/v1/devices/heartbeat')
            logger.info("Connected to Master Node.")
        } catch (error) {
            if (error.response) {
                logger.error("Invalid API Key: " + JSON.stringify(error.response.data) ?? "")
            } else {
                logger.error("An error occurred while trying to enroll to master node. " + error)
            }
            process.exit(1)
        }
    }
}

export default new AuthManager()
