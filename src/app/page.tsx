"use client";

import { useState } from "react";
import SplashScreen from "@/components/splash-screen";
import ConnectVehicle from "@/components/connect-vehicle";
import Dashboard from "@/components/dashboard";
import AIDiagnostics from "@/components/ai-diagnostics";
import PredictiveInsights from "@/components/predictive-insights";
import ProfileSettings from "@/components/profile-settings";
import Navigation from "@/components/navigation";

export default function CarAIApp() {
  const [currentScreen, setCurrentScreen] = useState<
    "splash" | "connect" | "dashboard" | "diagnostics" | "insights" | "profile"
  >("splash");
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
    setTimeout(() => setCurrentScreen("dashboard"), 500);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onContinue={() => setCurrentScreen("connect")} />;
      case "connect":
        return <ConnectVehicle onConnect={handleConnect} />;
      case "dashboard":
        return <Dashboard />;
      case "diagnostics":
        return <AIDiagnostics />;
      case "insights":
        return <PredictiveInsights />;
      case "profile":
        return <ProfileSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Apple-inspired gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#050505]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/10 via-transparent to-transparent" />

      <div className="max-w-md mx-auto relative">
        {renderScreen()}
        {isConnected &&
          currentScreen !== "splash" &&
          currentScreen !== "connect" && (
            <Navigation
              currentScreen={currentScreen}
              onNavigate={setCurrentScreen}
            />
          )}
      </div>
    </div>
  );
}
