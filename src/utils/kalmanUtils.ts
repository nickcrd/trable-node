//import {BLENode} from "../models/device/BLENodeModel";
import KalmanFilter from "./KalmanFilter";
import {config} from "node-config-ts";

var kalmanFiltersMap: Map<String, KalmanFilter> = new Map()

export const defaultKalmanFilter = new KalmanFilter({ R: config.nodeConfig.kalman.R, Q: config.nodeConfig.kalman.Q })

/** @deprecated */ /*
export function getKalmanFilter(node: BLENode) {
    if (!kalmanFiltersMap.has(node._id)) {
       kalmanFiltersMap.set(node._id, defaultKalmanFilter)
    }
    return kalmanFiltersMap.get(node._id)
}
*/