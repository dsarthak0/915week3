import { getTimestamp } from "@/shared/utils/timestamp";

export const BASE_URL = '/api-proxy'; 
export const DEVICE_ID = '2abe6bee-768f-4714-ab8d-2da64540bda8';

// This is the static key the server is looking for in the handshake body
export const STATIC_PUBLIC_KEY = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1Gd3dEUVlKS29aSWh2Y05BUUVCQlFBRFN3QXdTQUpCQUxmQUp0Uy9ZcjVWSCtNUTVUZmkvTG1zNUZldDNMM3g2SUNYMW9zME15RWpjUC9ldmFGdFYrZkJOTTBKRG5WQ3h3alZwRkNHaElybkt1S3d1Y2pUUndrQ0F3RUFBUT09DQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=";

export const getAuthHeaders = () => {
    const ts = Date.now().toString();
    const token = localStorage.getItem('bearer_token'); // Match the key!
    return {
        'content-type': 'application/json',
        'appName': 'NVantage - Middleware Qa',
        'buildNumber': '10005',
        'packageName': 'com.coditas.omnenest.omnenest_mobile_app.middlewareqa',
        'appVersion': '1.0.6',
        'os': 'android',
        'deviceId': DEVICE_ID,
        'deviceIp': '10.0.2.16',
        'timestamp': ts,
        'source': 'MOB',
        'appInstallId': DEVICE_ID,
        'userAgent': 'com.coditas.omnenest.omnenest_mobile_app.middlewareqa/1.0.6 (Google google sdk_gphone64_x86_64; Android 15 SDK35)',
        // Matches your format: deviceId-timestamp
        'xRequestId': `${DEVICE_ID}-${ts}` ,
        'Authorization': token ? `Bearer ${token}` : ''
    };
};