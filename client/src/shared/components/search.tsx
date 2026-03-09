import React, { useState, useEffect, useCallback } from 'react';
import { getAuthHeaders, BASE_URL } from '@/services/websocket/apis/config';
import { SearchResult } from '@/services/websocket/apis/globalsearchlogic';
import { GlobalSearchResponse } from '@/services/websocket/apis/globalsearchlogic';


export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Adding Timestamp as a query param or header is common for cache busting/security
      const timestamp = new Date().getTime();
      const url = `${BASE_URL}/v1/api/global-search/search?symbol=${searchTerm.toUpperCase()}&top=20&skip=0&_t=${timestamp}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
          'X-Timestamp': timestamp.toString(), // Example of sending timestamp in header
        },
      });

      if (!response.ok) throw new Error('Search failed');

      const data: GlobalSearchResponse = await response.json();
      setResults(data.openSearchResponse || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce effect: Wait 300ms after user stops typing to call API
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search stocks, options (e.g. REL)..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isSearching && (
          <div className="absolute right-3 top-3.5">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {results.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((item) => (
            <div
              key={item.uniqueKey}
              className="flex items-center justify-between p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{item.tradingSymbol}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-bold">
                    {item.exchangeName}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {item.contractType === 'OPTION' 
                    ? `${item.displayExpiryDate} | Strike: ${item.displayStrikePrice} ${item.optionType}`
                    : item.symbolName}
                </span>
              </div>
              
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                  item.optionType === 'CE' ? 'bg-green-100 text-green-700' : 
                  item.optionType === 'PE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.instrumentType}
                </span>
                <div className="text-[10px] text-gray-400 mt-1">Lot: {item.lotSize}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};