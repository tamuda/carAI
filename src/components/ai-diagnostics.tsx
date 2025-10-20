"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AIDiagnostics() {
  const diagnostics = [
    {
      code: "P0302",
      title: "Cylinder 2 Misfire Detected",
      description: "Likely spark plug wear. Safe to drive short distances.",
      confidence: 87,
      severity: "medium",
      recommendation: "Replace spark plugs within 2 weeks",
      impact: "Medium",
    },
    {
      code: "P0171",
      title: "System Too Lean (Bank 1)",
      description: "Minor air intake issue detected. Monitor fuel efficiency.",
      confidence: 72,
      severity: "low",
      recommendation: "Check air filter and intake system",
      impact: "Low",
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-12 px-6">
      <motion.div
        className="mb-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-5xl font-bold mb-3 tracking-tight text-white">
          AI Diagnostics
        </h1>
        <p className="text-lg text-white/60 font-light">
          Natural language insights
        </p>
      </motion.div>

      <div className="space-y-5 mb-8">
        {diagnostics.map((diagnostic, index) => (
          <motion.div
            key={diagnostic.code}
            className="glass-card-premium rounded-3xl p-8 border-gradient hover:scale-[1.01] transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Header with code and confidence */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    diagnostic.severity === "medium"
                      ? "bg-yellow-400/80"
                      : "bg-white/80"
                  }`}
                  style={{ animation: "pulse-subtle 2s ease-in-out infinite" }}
                />
                <span className="text-sm font-mono text-white/50 tracking-wider">
                  {diagnostic.code}
                </span>
              </div>

              {/* Premium confidence indicator */}
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="absolute h-full bg-gradient-to-r from-white via-white/90 to-white/70 rounded-full"
                    style={{
                      width: `${diagnostic.confidence}%`,
                      transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                    }}
                  />
                </div>
                <span className="text-sm text-white font-semibold">
                  {diagnostic.confidence}%
                </span>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold mb-3 tracking-tight text-white">
              {diagnostic.title}
            </h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed font-light">
              {diagnostic.description}
            </p>

            {/* Premium recommendation box */}
            <div className="glass-card rounded-2xl p-6 mb-6 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-white/90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-medium">
                    Recommendation
                  </p>
                  <p className="text-sm font-light leading-relaxed text-white/80">
                    {diagnostic.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Impact badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-white/50 uppercase tracking-wider font-medium">
                Impact:
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  diagnostic.severity === "medium"
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "bg-white/10 text-white/90"
                }`}
              >
                {diagnostic.impact}
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 glass-card border-white/20 bg-transparent hover:bg-white/5 hover:border-white/30 transition-all duration-300 text-white"
              >
                View Details
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-white hover:bg-white/90 text-black font-semibold hover:scale-[1.02] transition-all duration-300"
              >
                Find Parts
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Button className="w-full bg-white hover:bg-white/90 text-black py-8 text-lg font-semibold rounded-full hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Run Full Scan
        </Button>
      </motion.div>
    </div>
  );
}
