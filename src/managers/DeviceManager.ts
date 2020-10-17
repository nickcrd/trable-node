import noble, {Peripheral} from '@abandonware/noble'
import logger from "../utils/logger";
import {hashids} from "../utils/hashIdUtil";
import currentEpochSeconds from "../utils/currentEpochSeconds";
import {app} from "../app";

export class DeviceManager {

    private submitQueue: Map<string, number[]> = new Map()

    async setupScanning() {
        logger.info("[Bluetooth Manager] Initializing...")
        noble.on('discover', this.handleScannedPeripheral.bind(this));
        await noble.startScanningAsync([], true)
        logger.info("[Bluetooth Manager] Started scanning for advertisement packets.")
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
        const id = this.decodeOrFetchCached(name.slice(6))

        const txPower: number | undefined = peripheral.advertisement.txPowerLevel
        const rssi = peripheral.rssi

        this.addRSSIToSubmitQueue(id, txPower, rssi)

        logger.debug("============================================")
        logger.debug("id: " + name + "  ==>  " + id)
        logger.debug("RSSI: " + rssi)
        logger.debug("============================================")
    }

    public async addRSSIToSubmitQueue(clientId: string, txPower: number | undefined, rssi: number) {
        if (!this.submitQueue.has(clientId)) {
            this.submitQueue.set(clientId, [rssi]);
            return
        }

        this.submitQueue.get(clientId)!.push(rssi);
        if (this.submitQueue.get(clientId)!.length >= 15) {
            this.submitRSSI(clientId, this.submitQueue.get(clientId)!, currentEpochSeconds());
            this.submitQueue.delete(clientId)
        }

    }


    public async submitRSSI(clientId: string, rssi: number[], timestamp: number) {
        app.apiClient.post('api/v1/location/submitRSSI', {
            targetId: clientId,
            rssiMeasurements: rssi,
            rssi1m: app.config.nodeConfig.rssiAt1m,
            pathLossParam: app.config.nodeConfig.pathLossParam,
            timestamp: timestamp
        }).catch(err => {
            logger.error("Failed to submit RSSI measurements: " + err.toString())
        })
    }

    private idCache: Map<string, string> = new Map();
    private decodeOrFetchCached(decodedName: string) {
        return this.idCache.get(decodedName) ?? this._decode(decodedName)
    }
    private _decode(name: string): string {
        const decoded = hashids.decodeHex(name);
        this.idCache.set(name, decoded)
        return decoded
    }
}

export default new DeviceManager()