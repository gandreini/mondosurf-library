import { DeviceUUID } from 'device-uuid';

/**
 * Checks if there's a device_id in the localStorage.
 * If there's no device_id, it creates one and returns it.
 * If there's already a device_id, it returns it.
 * The device_id is a unique identifier of the device.
 * 
 * @returns {string} The unique id of the device.
 */
export const getDeviceId = (): string => {
    if (!localStorage.getItem('device_id')) {
        const du = new DeviceUUID().parse();
        const dua = [
            du.platform,
            du.os,
            du.cpuCores,
            du.isDesktop,
            du.isMobile,
            du.isTablet,
            du.isWindows,
            du.isLinux,
            du.isLinux64,
            du.isMac,
            du.isiPad,
            du.isiPhone,
            du.isiPod,
            du.isSmartTV,
            du.pixelDepth,
            du.isTouchScreen
        ];
        const uuid = du.hashMD5(dua.join(':'));
        localStorage.setItem('device_id', uuid);
        return uuid;
    } else {
        return localStorage.getItem('device_id')!;
    }
}