    import axios from 'axios';
    import { BASE_URL, getAuthHeaders, STATIC_PUBLIC_KEY } from './config';
    import { DEVICE_ID } from './config';
    // src/services/websocket/apis/prehandshake.ts
export const preAuthHandshake = async () => {
    try {
        const response = await axios.post(
            `${BASE_URL}/v1/api/auth/pre-auth-handshake`,
            {
                devicePublicKey: STATIC_PUBLIC_KEY,
                deviceId: DEVICE_ID // <--- THIS IS THE MISSING LINK
            }, 
            { headers: getAuthHeaders() }
        );
        console.log('Handshake Success!', response.data);
        return response.data;
    } catch (error: any) {
        console.error("Handshake Failed:", error.response?.data);
        throw error;
    }
};