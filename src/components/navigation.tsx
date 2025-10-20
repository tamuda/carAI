"use client";

interface NavigationProps {
  currentScreen: string;
  onNavigate: (
    screen: "dashboard" | "diagnostics" | "insights" | "profile"
  ) => void;
}

export default function Navigation({
  currentScreen,
  onNavigate,
}: NavigationProps) {
  const navItems = [
    {
      id: "dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      label: "Home",
    },
    {
      id: "diagnostics",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      label: "Diagnostics",
    },
    {
      id: "insights",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      label: "Insights",
    },
    {
      id: "profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
      <div className="glass-card-premium border-t border-white/10 backdrop-blur-2xl mx-4 mb-6 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-around px-4 py-5">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`flex flex-col items-center gap-2 transition-all duration-300 relative ${
                  isActive
                    ? "text-white scale-110"
                    : "text-white/40 hover:text-white/70 hover:scale-105"
                }`}
              >
                {isActive && (
                  <div className="absolute -inset-3 rounded-2xl bg-white/5" />
                )}

                <div className="relative">
                  <svg
                    className="w-7 h-7 relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={isActive ? 2.5 : 2}
                      d={item.icon}
                    />
                  </svg>
                </div>

                <span
                  className={`text-xs font-medium tracking-wide ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
