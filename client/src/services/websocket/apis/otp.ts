import axios from 'axios';
import { BASE_URL, getAuthHeaders } from './config';

export const validateOtp = async (username: string, otpValue: string) => {
    const body = {
        username: username,
        // Convert the string from the input field to a number
        otp: parseInt(otpValue, 10) 
    };

    try {
        const response = await axios.post(
            `${BASE_URL}/v2/api/auth/validate-otp`,
            body,
            { headers: getAuthHeaders() }
        );
        
        // Based on typical NVantage responses, the token is in response.data.data.token
        return response.data; 
    } catch (error: any) {
        console.error("OTP Validation Error:", error.response?.data);
        throw error;
    }
};