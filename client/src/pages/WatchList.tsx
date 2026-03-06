import React, { useState, useEffect } from 'react';
import { getAuthHeaders, BASE_URL } from '@/services/websocket/apis/config';

// --- Interfaces ---
interface WatchlistTab {
  watchlistName: string;
  watchlistId: number;
}

interface Scrip {
  scripToken: string;
  symbolName: string;
  exchange: string;
  lastTradedPrice: number;
  netChange: number;
  previousClosePrice: number;
}

export const GrowwWatchlist: React.FC = () => {
  const [tabs, setTabs] = useState<WatchlistTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [scrips, setScrips] = useState<Scrip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Fetch the available Watchlists (Tabs)
  const fetchTabs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/v1/api/watchlist/list`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return;

      const data = await response.json();
      const allTabs = [
        ...(data.userDefinedWatchlists || []),
        ...(data.predefinedWatchlists || []),
      ];

      setTabs(allTabs);
      // Set initial active tab to defaultWatchlistId
      if (data.defaultWatchlistId) {
        setActiveTabId(data.defaultWatchlistId);
      } else if (allTabs.length > 0) {
        setActiveTabId(allTabs[0].watchlistId);
      }
    } catch (error) {
      console.error("Failed to fetch tabs:", error);
    }
  };

  // 2. Fetch Scrips for the selected Tab
  const fetchScrips = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/v1/api/watchlist/scrips/list`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watchlistId: id }),
      });

      if (!response.ok) throw new Error("Scrip fetch failed");

      const data = await response.json();
      setScrips(data.scrips || []);
    } catch (error) {
      console.error("Failed to fetch scrips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  useEffect(() => {
    if (activeTabId) {
      fetchScrips(activeTabId);
    }
  }, [activeTabId]);

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Horizontal Tabs Area */}
      <div className="flex border-b border-gray-100 overflow-x-auto bg-gray-50/50 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.watchlistId}
            onClick={() => setActiveTabId(tab.watchlistId)}
            className={`px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
              activeTabId === tab.watchlistId
                ? 'text-green-600 border-b-2 border-green-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.watchlistName.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Scrip List Area */}
      <div className="flex flex-col divide-y divide-gray-50 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-400">Fetching stocks...</span>
          </div>
        ) : scrips.length > 0 ? (
          scrips.map((scrip) => {
            const isNegative = scrip.netChange < 0;
            const pnlPercentage = ((scrip.netChange / scrip.previousClosePrice) * 100).toFixed(2);

            return (
              <div
                key={scrip.scripToken}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{scrip.symbolName}</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase">{scrip.exchange}</span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{scrip.lastTradedPrice.toFixed(2)}
                  </span>
                  <span className={`text-xs font-medium ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                    {isNegative ? '' : '+'}{scrip.netChange.toFixed(2)} ({pnlPercentage}%)
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-gray-400 text-sm">No stocks in this watchlist</div>
        )}
      </div>
    </div>
  );
};