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
      const response = await fetch(`${BASE_URL}/v1/api/profile/dashboard-config`, {
            headers: getAuthHeaders()
        // 1. Generate the dynamic headers
        // This sends all the required keys (source, appName, etc.)
        });

        if (response.status === 412) {
            console.warn("Dashboard: Handshake/Device sync issue (412).");
            return; // Exit early without throwing a loud error
        }

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        const data = await response.json();
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