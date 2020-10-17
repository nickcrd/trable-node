import * as Sentry from "@sentry/node";

/** @deprecated No longer needed since sentry automatically logs caught exceptions */
export default (error: any) => {
    // Sentry has been initialized, so we can track the exception
    if (Sentry.getCurrentHub().getClient() != undefined) {
        Sentry.captureException(error)
    }
}

