import { getPreAuthHandshake } from "./prehandshake";

export const verifyOtp = async (otp: string): Promise<any> => {
  try {
    // 1. Get a FRESH timestamp for the OTP step
    const timestamp = await getPreAuthHandshake();

    // 2. Submit the OTP to the auth endpoint
    const response = await fetch('https://preprodapisix.omnenest.com/v2/api/auth/validate-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        otp: otp,
        time_stamp: timestamp
      }),
    });

    const data = await response.json();
    
    // 3. If successful, this usually returns the { bearertoken }
    if (data.token) {
      localStorage.setItem('bearer_token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error("OTP Verification Error:", error);
    throw error;
  }
};