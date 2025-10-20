"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function PredictiveInsights() {
  const [powerFlow, setPowerFlow] = useState(65);
  const [efficiency, setEfficiency] = useState(82);

  // Animate power flow
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerFlow((prev) => {
        const change = Math.random() * 20 - 10;
        return Math.max(30, Math.min(95, prev + change));
      });
      setEfficiency((prev) => {
        const change = Math.random() * 10 - 5;
        return Math.max(65, Math.min(98, prev + change));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const predictions = [
    {
      metric: "Battery Health",
      current: 94,
      predicted: 86,
      change: -8,
      months: 3,
    },
    {
      metric: "Brake Pad Life",
      current: 78,
      predicted: 45,
      change: -33,
      months: 6,
    },
    {
      metric: "Oil Quality",
      current: 88,
      predicted: 65,
      change: -23,
      months: 2,
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-8 px-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-4xl font-bold mb-2 text-white">
          Predictive Insights
        </h1>
        <p className="text-white/60">Future health forecasts</p>
      </motion.div>

      {/* Tesla-Inspired Power Distribution Widget */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="glass-card-premium border-white/10 p-6 mb-6">
          <h3 className="font-semibold mb-6 text-white">
            Real-Time Power Distribution
          </h3>

          {/* Car visualization with power flow */}
          <div className="relative mb-8">
            <div className="flex items-center justify-center">
              {/* Simplified car shape */}
              <svg
                width="300"
                height="120"
                viewBox="0 0 300 120"
                className="drop-shadow-2xl"
              >
                <defs>
                  {/* Animated gradient for power flow */}
                  <linearGradient
                    id="powerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)">
                      <animate
                        attributeName="stop-color"
                        values="rgba(59, 130, 246, 0.8);rgba(96, 165, 250, 1);rgba(59, 130, 246, 0.8)"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop offset="50%" stopColor="rgba(96, 165, 250, 1)">
                      <animate
                        attributeName="stop-color"
                        values="rgba(96, 165, 250, 1);rgba(59, 130, 246, 0.8);rgba(96, 165, 250, 1)"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)">
                      <animate
                        attributeName="stop-color"
                        values="rgba(59, 130, 246, 0.8);rgba(96, 165, 250, 1);rgba(59, 130, 246, 0.8)"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </stop>
                  </linearGradient>

                  {/* Glow filter */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Car body */}
                <path
                  d="M 80 60 L 60 80 L 50 80 L 50 90 L 250 90 L 250 80 L 240 80 L 220 60 L 200 50 L 100 50 Z"
                  fill="rgba(255, 255, 255, 0.1)"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                />

                {/* Car windshield */}
                <path
                  d="M 100 50 L 120 35 L 180 35 L 200 50 Z"
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                />

                {/* Battery position (center) */}
                <rect
                  x="130"
                  y="70"
                  width="40"
                  height="15"
                  rx="3"
                  fill="url(#powerGradient)"
                  filter="url(#glow)"
                />

                {/* Animated power lines - battery to motors */}
                <motion.path
                  d="M 150 70 L 150 50 L 90 50"
                  stroke="url(#powerGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  animate={{
                    strokeDashoffset: [0, -10],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.path
                  d="M 150 70 L 150 50 L 210 50"
                  stroke="url(#powerGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  animate={{
                    strokeDashoffset: [0, -10],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Front wheels */}
                <circle
                  cx="90"
                  cy="95"
                  r="12"
                  fill="rgba(255, 255, 255, 0.2)"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="3"
                />
                <circle
                  cx="210"
                  cy="95"
                  r="12"
                  fill="rgba(255, 255, 255, 0.2)"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Power metrics */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {powerFlow.toFixed(0)}
                  <span className="text-lg">kW</span>
                </div>
                <div className="text-xs text-white/50">Power Output</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {efficiency.toFixed(0)}
                  <span className="text-lg">%</span>
                </div>
                <div className="text-xs text-white/50">Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  247
                  <span className="text-lg">mi</span>
                </div>
                <div className="text-xs text-white/50">Range</div>
              </div>
            </div>
          </div>

          {/* Energy flow indicator */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">Energy Flow</span>
              <span className="text-sm font-semibold text-blue-400">
                Optimal
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${efficiency}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                }}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main forecast graph */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="glass-card-premium border-white/10 p-6 mb-6">
          <h3 className="font-semibold mb-6 text-white">
            Battery Health Forecast
          </h3>

          {/* Graph visualization */}
          <div className="relative h-48 mb-6 pl-12">
            <svg
              className="w-full h-full"
              viewBox="0 0 300 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop
                    offset="0%"
                    stopColor="rgb(255, 255, 255)"
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(255, 255, 255)"
                    stopOpacity="0.2"
                  />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line
                x1="0"
                y1="37.5"
                x2="300"
                y2="37.5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="75"
                x2="300"
                y2="75"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="112.5"
                x2="300"
                y2="112.5"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />

              {/* Forecast line */}
              <path
                d="M 0 15 L 75 20 L 150 35 L 225 60 L 300 90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Subtle glow effect */}
              <path
                d="M 0 15 L 75 20 L 150 35 L 225 60 L 300 90"
                fill="none"
                stroke="rgb(255, 255, 255)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.1"
                filter="blur(4px)"
              />
            </svg>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/50">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Prediction text */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm leading-relaxed text-white/80">
              <span className="text-white font-semibold">
                Battery health forecast:
              </span>{" "}
              −8% expected in 3 months. Consider scheduling maintenance around
              month 4.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Enhanced Prediction Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="glass-card-premium border-white/10 p-6">
          <h3 className="font-semibold mb-6 text-white">
            Component Health Forecast
          </h3>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 mb-4 pb-3 border-b border-white/10">
            <div className="col-span-4 text-xs font-medium text-white/50">
              Component
            </div>
            <div className="col-span-2 text-xs font-medium text-white/50 text-center">
              Current
            </div>
            <div className="col-span-4 text-xs font-medium text-white/50">
              Forecast
            </div>
            <div className="col-span-2 text-xs font-medium text-white/50 text-right">
              Change
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-5">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.metric}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid grid-cols-12 gap-4 items-center"
              >
                {/* Component Name */}
                <div className="col-span-4">
                  <h4 className="font-semibold text-white mb-0.5">
                    {prediction.metric}
                  </h4>
                  <p className="text-xs text-white/40">
                    {prediction.months} mo. outlook
                  </p>
                </div>

                {/* Current Value */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm">
                    <span className="text-lg font-bold text-white">
                      {prediction.current}
                      <span className="text-xs">%</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="col-span-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/80 rounded-full transition-all duration-500"
                        style={{
                          width: `${prediction.current}%`,
                          boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          prediction.change < -20
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                            : "bg-white/70"
                        }`}
                        style={{
                          width: `${prediction.predicted}%`,
                          boxShadow:
                            prediction.change < -20
                              ? "0 0 10px rgba(250, 204, 21, 0.4)"
                              : "none",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>Now</span>
                    <span>
                      +{prediction.months}mo → {prediction.predicted}%
                    </span>
                  </div>
                </div>

                {/* Change Indicator */}
                <div className="col-span-2 text-right">
                  <div
                    className={`inline-flex items-center justify-center px-3 py-2 rounded-lg ${
                      prediction.change < -20
                        ? "bg-yellow-500/20 text-yellow-400"
                        : prediction.change < -10
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    <span className="text-sm font-bold">
                      {prediction.change > 0 ? "+" : ""}
                      {prediction.change}%
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-white/30">
                    {prediction.change < -20
                      ? "Action needed"
                      : prediction.change < -10
                      ? "Monitor"
                      : "Healthy"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
