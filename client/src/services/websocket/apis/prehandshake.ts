    import axios from 'axios';
    import { BASE_URL, getAuthHeaders, STATIC_PUBLIC_KEY } from './config';

    export const preAuthHandshake = async () => {
        try {
            const response = await axios.post(
                `${BASE_URL}/v1/api/auth/pre-auth-handshake`,
                {
                    devicePublicKey: STATIC_PUBLIC_KEY
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