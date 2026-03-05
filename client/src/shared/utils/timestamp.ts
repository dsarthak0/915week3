export const getTimestamp = (): string => Date.now().toString();

export const generateRequestId = (): string => `req_${Date.now()}`;