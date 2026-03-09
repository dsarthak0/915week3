import { getAuthHeaders } from "./config";

// Use relative paths so the Vite Proxy handles the domain/CORS
const BASE_V1 = '/v1/api/auth';
const BASE_V2 = '/v2/api/auth';

export const getHandshake = async (): Promise<number> => {
  const res = await fetch(`${BASE_V1}/pre-auth-handshake`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Handshake failed');
  const data = await res.json();
  return data.time_stamp;
};

export const loginUser = async (credentials: any) => {
  const ts = await getHandshake();
  const res = await fetch(`${BASE_V1}/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ 
      username: credentials.name,    
      password: credentials.password,
      time_stamp: ts
    }),
  });
  return await res.json();
};

export const verifyOtp = async (otpValue: string) => {
  // Always get a fresh handshake for OTP as well
  const ts = await getHandshake(); 
  
  // Note: Your vite.config has /v2, check if validate-otp is v1 or v2
  const res = await fetch(`${BASE_V2}/validate-otp`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ 
      otp: otpValue, 
      time_stamp: ts 
    }),
  });
  
  const data = await res.json();
  if (data.token || data.bearer_token) {
    localStorage.setItem('bearer_token', data.token || data.bearer_token);
  }
  return data;
};