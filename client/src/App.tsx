import { useState, useEffect } from "react";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { Header } from "@/shared/components/Header";
import { NotificationStack } from "@/shared/components/NotificationStack";
import { DashboardPage } from "@/pages/DashboardPage";
import { PortfolioPage } from "@/features/portfolio-overview/PortfolioPage";
import { OrderBookPage } from "@/features/order-book/OrderBookPage";
import { WatchlistPage } from "@/features/dashboard/WatchlistPage";
import { LoginPage } from "./pages/LoginPage"; // Import your new page
import { useUIStore } from "@/store/ui.store";
import { DashboardHeader } from "./shared/components/apiheader";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Note: Use 'bearer_token' to match your LoginPage key
    const token = localStorage.getItem('bearer_token');
    if (token) setIsAuthenticated(true);
  }, []);

  useWebSocket();
  const activeTab = useUIStore((s) => s.activeTab);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardPage />;
      case "portfolio": return <PortfolioPage />;
      case "orderbook": return <OrderBookPage />;
      case "watchlist": return <WatchlistPage />;
      default: return <DashboardPage />;
    }
  };

  // --- SINGLE RETURN BLOCK ---
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      background: "var(--bg-void)",
    }}>
      {!isAuthenticated ? (
        // SHOW THIS IF NOT LOGGED IN
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        // SHOW THIS IF LOGGED IN
        <>
          <DashboardHeader /> {/* This will now have the token it needs! */}
          <Header />
          <main style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
            {renderTab()}
          </main>
          <footer style={{
            padding: "4px 20px",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-panel)",
            display: "flex", justifyContent: "space-between",
            fontSize: "9px", color: "var(--text-muted)",
          }}>
            <span>ws://localhost:8080</span>
            <span>Groww-915 · Simulated data</span>
          </footer>
        </>
      )}
      <NotificationStack />
    </div>
  );
}