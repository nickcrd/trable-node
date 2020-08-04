import GenericResponse from "../models/GenericResponse";
import {app} from "../app";
import logger from "../utils/logger";

export class AuthManager {
    public async verifyApiKey() {
        try {
            const response = await app.apiClient.get('api/v1/devices/heartbeat') as GenericResponse
            if (response.status != 200) {
                logger.error("Invalid API Key: " + response.message ?? "")
                process.exit(1)
            }
            logger.info("Connected to Master Node.")
        } catch (error) {
            logger.error("An error occurred while trying to enroll to master node. " + error.toString())
            process.exit(1)
        }
    }
}

export default new AuthManager()
