import noble, {Peripheral} from '@abandonware/noble'
import logger from "../utils/logger";
import {hashids} from "../utils/hashIdUtil";
import currentEpochSeconds from "../utils/currentEpochSeconds";
import {app} from "../app";

export class DeviceManager {

    async setupScanning() {
        noble.on('discover', this.handleScannedPeripheral.bind(this));
        await noble.startScanningAsync([], true)
    }

    private handleScannedPeripheral(peripheral: Peripheral) {
        if (!peripheral.advertisement.localName) {
            return
        }

        // Trable Clients send an advertised name with a TRBLE- prefix
        const name = peripheral.advertisement.localName
        if (!name.startsWith("TRBLE-")) {
            return;
        }

        // Need to decode the provided id to the full hex ObjectId first
        const id = hashids.decodeHex(name.slice(6))

        const txPower: number | undefined = peripheral.advertisement.txPowerLevel
        const rssi = peripheral.rssi

        this.submitRSSI(id, txPower, rssi, currentEpochSeconds())

        logger.debug("============================================")
        logger.debug("id: " + name + "  ==>  " + id)
        logger.debug("txPower: " + txPower)
        logger.debug("RSSI: " + rssi)
        logger.debug("============================================")
    }

    public submitRSSI(clientId: string, txPower: number | undefined, rssi: number, timestamp: number) {
        app.apiClient.post('api/v1/location/submitRSSI', {
            targetId: clientId,
            rssi: rssi,
            txPower: txPower,
            timestamp: timestamp
        }).catch(err => {
            logger.error("Failed to submit RSSI measurement: " + err.toString())
        })
    }
}

export default new DeviceManager()