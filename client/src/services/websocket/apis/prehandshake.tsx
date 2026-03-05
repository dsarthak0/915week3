

export const getPreAuthHandshake = async (): Promise<number | null> => {
  try {
    const response = await fetch('https://preprodapisix.omnenest.com/v1/api/auth/pre-auth-handshake');
    
    if (!response.ok) {
      throw new Error('Handshake failed');
    }

    const data = await response.json();
    

    return data.time_stamp; 
  } catch (error) {
    console.error("Error fetching handshake:", error);
    return null;
  }
};