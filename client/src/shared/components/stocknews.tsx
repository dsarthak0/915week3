import React, { useState, useEffect } from 'react';
import { getAuthHeaders, BASE_URL } from '@/services/websocket/apis/config';

// Helper to decode HTML entities like &amp; to &
const decodeHTML = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const StockNews: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const url = `${BASE_URL}/v1/api/stocks/news?top=10&skip=0`;
      const response = await fetch(url, {
        headers: { ...getAuthHeaders() }
      });
      const data = await response.json();
      
      // Ensure we are setting an array even if the API structure changes
      const newsArray = Array.isArray(data) ? data : (data.news || []);
      setNews(newsArray);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  if (isLoading) return <div className="p-10 text-center animate-pulse">Loading Feed...</div>;

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Live Market Feed</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
          {news.length} Updates
        </span>
      </div>

      {news.map((item, index) => (
        <div 
          key={index} 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
              {item.source.split('_')[0]}
            </span>
            <span className="text-[10px] text-gray-400 italic">
              {item.publishedDate}
            </span>
          </div>

          <a 
            href={item.link} 
            target="_blank" 
            rel="noreferrer"
            className="text-md font-semibold text-gray-900 hover:text-blue-600 block mb-2 leading-tight"
          >
            {decodeHTML(item.title)}
          </a>

          <p className="text-sm text-gray-600 line-clamp-3">
            {item.contentSnippet}
          </p>
        </div>
      ))}
    </div>
  );
};