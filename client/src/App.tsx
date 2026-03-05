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

export default function App() {
  // 1. Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    if (token) setIsAuthenticated(true);
  }, []);

  // 2. Starts WebSocket connection — only if authenticated
  useWebSocket();

  const activeTab = useUIStore((s) => s.activeTab);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":  return <DashboardPage />;
      case "portfolio":  return <PortfolioPage />;
      case "orderbook":  return <OrderBookPage />;
      case "watchlist":  return <WatchlistPage />;
      default:           return <DashboardPage />;
    }
  };

  // 3. Conditional Rendering: If not logged in, show ONLY LoginPage
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      background: "var(--bg-void)",
    }}>
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
        fontFamily: "var(--font-mono)", letterSpacing: "0.5px",
        flexShrink: 0,
      }}>
        <span>ws://localhost:8080</span>
        <span>Groww-915 · Simulated data — for learning only</span>
      </footer>

      <NotificationStack />
    </div>
  );
}
