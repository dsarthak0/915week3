import React, { useState, useEffect, useCallback } from 'react';
import { getAuthHeaders, BASE_URL } from '@/services/websocket/apis/config';

interface MarketStatusItem {
  marketStatus: string;
  exchange: string;
}

interface MarketApiResponse {
  market_status: MarketStatusItem[];
  errors?: Array<{ errorMessage: string }>; 
}

export const MarketStatusHeader: React.FC = () => {
  const [markets, setMarkets] = useState<MarketStatusItem[]>([]);

  const fetchMarketStatus = useCallback(async () => {
    const token = localStorage.getItem('bearer_token');
    if (!token || token === 'undefined') return;

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/v2/api/stocks/market-status`, {
        method: 'POST',
        headers: { 
          ...headers, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({}),
      });

      // 1. Handle Critical Auth Failures (401)
      if (response.status === 401) {
        console.error("Session expired (401). Redirecting...");
        localStorage.removeItem('bearer_token');
        window.location.href = '/login';
        return;
      }

      // 2. Handle Device Sync Issues (412)
      if (response.status === 412) {
        console.warn("Market Status: Device/Clock out of sync (412).");
        return;
      }

      // Parse JSON once for subsequent checks
      const data: MarketApiResponse = await response.json();

      // 3. Handle Forbidden/Expired via Body (403)
      if (response.status === 403 && data.errors?.[0]?.errorMessage?.toLowerCase().includes("expired")) {
        console.error("Token expired (403). Redirecting...");
        localStorage.removeItem('bearer_token');
        window.location.href = '/login';
        return;
      }

      // 4. General Error Handling
      if (!response.ok) {
        throw new Error(`Market API Error: ${response.status}`);
      }

      // 5. Success
      if (data?.market_status) {
        setMarkets(data.market_status);
      }
      
    } catch (error) {
      console.error("Failed to fetch market status:", error);
    }
  }, []);

  useEffect(() => {
    fetchMarketStatus();
    
    const interval = setInterval(fetchMarketStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchMarketStatus]);

  const getDisplayStatus = (status: string | undefined) => {
    if (!status) return "Closed";
    return status.toLowerCase().includes("open") ? "Live" : "Closed";
  };

  return (
    <div className="flex gap-4 p-3 bg-white border-b overflow-x-auto shadow-sm no-scrollbar">
      {markets.length === 0 ? (
        <span className="text-xs text-gray-400 italic animate-pulse">
          Refreshing market status...
        </span>
      ) : (
        markets.map((m, index) => {
          const statusLabel = getDisplayStatus(m.marketStatus);
          const isLive = statusLabel === "Live";

          return (
            <div key={`${m.exchange}-${index}`} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border whitespace-nowrap">
              <span className="text-xs font-bold text-gray-600">{m.exchange}</span>
              <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                isLive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {statusLabel}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};