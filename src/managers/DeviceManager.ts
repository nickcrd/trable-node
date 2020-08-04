import noble, {Peripheral} from '@abandonware/noble'
import logger from "../utils/logger";

export class DeviceManager {

    async setupScanning() {
        noble.on('discover', this.handleScannedPeripheral);
        await noble.startScanningAsync([], true)
    }

    private handleScannedPeripheral(peripheral: Peripheral) {
        if (!peripheral.advertisement.localName) {
            return
        }

        // Trable Clients send an advertised name with a TRABLE- prefix
        const name = peripheral.advertisement.localName
        if (!name.startsWith("TRABLE-")) {
            return;
        }

        // Can't actually fit TRABLE- + ObjectID so I need to figure out a way to shorten it (will probably drop the prefix or smthing)
        // const id = btoa(name.slice(7))


        const txPower: number | undefined = peripheral.advertisement.txPowerLevel
        const rssi = peripheral.rssi

        logger.debug("============================================")
        logger.debug("id: " + name)
        logger.debug("txPower: " + txPower)
        logger.debug("RSSI: " + rssi)
        logger.debug("============================================")
    }
}

export default new DeviceManager()