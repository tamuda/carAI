"use client";

import { motion } from "framer-motion";

export default function Dashboard() {
  const metrics = [
    {
      label: "RPM",
      value: "2,450",
      unit: "rpm",
      status: "normal",
      trend: "+2.3%",
    },
    {
      label: "Coolant Temp",
      value: "92",
      unit: "°C",
      status: "normal",
      trend: "Stable",
    },
    {
      label: "Battery",
      value: "12.8",
      unit: "V",
      status: "normal",
      trend: "+0.2V",
    },
    {
      label: "Voltage",
      value: "14.2",
      unit: "V",
      status: "normal",
      trend: "Optimal",
    },
  ];

  return (
    <div className="min-h-screen pb-28 pt-16 px-8">
      <motion.div
        className="mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          className="text-5xl font-bold mb-4 tracking-tight text-white"
          style={{ letterSpacing: "-0.02em" }}
        >
          Dashboard
        </h1>
        <p className="text-lg text-white/60 font-light">
          Real-time vehicle monitoring
        </p>
      </motion.div>

      <motion.div
        className="glass-card-premium rounded-[2rem] p-12 mb-12 border-gradient relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

        <div className="relative text-center">
          <p className="text-sm text-white/50 mb-6 uppercase tracking-widest font-medium">
            Vehicle Health
          </p>
          <div
            className="text-8xl font-bold text-white mb-8 tracking-tight"
            style={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            92%
          </div>

          <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full"
              style={{ animation: "shimmer 3s infinite" }}
            />
            <div
              className="relative h-full bg-gradient-to-r from-white via-white/90 to-white/80 rounded-full"
              style={{
                width: "92%",
                transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  "0 0 20px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
              }}
            />
          </div>

          <p className="text-sm text-white/50 mt-6 font-light">
            All systems operational
          </p>
        </div>
      </motion.div>

      <motion.div
        className="mb-12 relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="glass-card rounded-[2rem] p-20 flex items-center justify-center relative overflow-hidden"
          style={{ minHeight: "320px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 0.8, 1.6, 2.4].map((delay) => (
              <div
                key={delay}
                className="absolute w-40 h-40 rounded-full border border-white/10"
                style={{
                  animation: `radar-wave 5s ease-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 bg-white/10 blur-[60px] rounded-full"
              style={{ animation: "pulse-subtle 4s ease-in-out infinite" }}
            />
            <svg
              className="relative w-64 h-64 text-white/70"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-5 mb-12">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="glass-card rounded-3xl p-7 border-gradient hover:scale-[1.03] transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p className="text-xs text-white/50 mb-4 uppercase tracking-widest font-medium">
              {metric.label}
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span
                className="text-4xl font-bold tracking-tight text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                {metric.value}
              </span>
              <span className="text-sm text-white/50 font-light">
                {metric.unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full bg-white/80"
                  style={{
                    animation: "pulse-subtle 2.5s ease-in-out infinite",
                  }}
                />
                <span className="text-xs text-white/50 font-light">Stable</span>
              </div>
              <span className="text-xs text-white font-semibold">
                {metric.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="glass-card-premium rounded-3xl p-8 border-gradient"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl glass-morphism flex items-center justify-center flex-shrink-0">
            <svg
              className="w-8 h-8 text-white/90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4 tracking-tight text-white">
              AI Summary
            </h3>
            <p className="text-base text-white/60 leading-relaxed font-light">
              Everything looks good today. 3 metrics trending stable. No
              immediate attention required.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
