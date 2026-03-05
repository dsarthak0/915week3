import React, { useState, useEffect } from 'react';
import { getAuthHeaders,BASE_URL } from '@/services/websocket/apis/config';
interface Feature {
  name: string;
}


interface ApiResponse {
  dashboard: {
    features: Feature[];
  };
}

export const DashboardHeader: React.FC = () => {
  
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
        // 1. Generate the dynamic headers
        const headers = getAuthHeaders();

        // 2. Use BASE_URL (which is your '/api-proxy')
        const response = await fetch(`${BASE_URL}/v1/api/profile/dashboard-config`, {
          method: 'GET',
          headers: headers, // This sends all the required keys (source, appName, etc.)
        });

        if (!response.ok) {
          // If it's still 400, the server might be rejecting 'MOB' from a web origin
          throw new Error(`Server error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        if (data?.dashboard?.features) {
          setFeatures(data.dashboard.features);
        }
      } catch (error) {
        console.error("Failed to fetch features:", error);
      }
    };

    fetchData();
}, []);

  return (
    <nav className="flex gap-4 p-4 border-b bg-white">
      {features.map((feature, index) => (
        
        <div key={index} className="font-semibold text-gray-700 cursor-pointer">
          {feature.name} 
        </div>
      ))}
    </nav>
  );
};