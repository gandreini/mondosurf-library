import { Network } from '@capacitor/network';

import { isApp } from './device.helpers';

/**
 * Checks the connection status.
 * Returns a promise that rejects if there's no connection.
 *
 * @returns {Promise} Returns a promise.
 */
export const checkConnection = async (): Promise<Boolean | null | undefined> => {
    return new Promise((resolve, reject) => {
        if (isApp()) {
            Network.getStatus()
                .then((status) => {
                    if (status.connected) {
                        resolve(true);
                    } else {
                        reject();
                    }
                })
                .catch((error) => {
                    reject();
                });
        } else {
            if (navigator.onLine) {
                resolve(true);
            } else {
                reject();
            }
        }
    });
};
