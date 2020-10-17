import {TrableApp} from "../app";
import logger from "../utils/logger";
import * as Sentry from "@sentry/node";

export default (app: TrableApp) => {
    if (app.config.sentryUrl) {
        logger.info("Initializing Sentry Logger")
        Sentry.init({ dsn: app.config.sentryUrl });
    }
}
