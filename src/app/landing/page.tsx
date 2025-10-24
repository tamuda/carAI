"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import {
  Car,
  Brain,
  Camera,
  Shield,
  Zap,
  Smartphone,
  ArrowRight,
  Play,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - More Visible */}
        <div className="absolute inset-0">
          <Image
            src="/hand holding phone.png"
            alt="Hand holding phone"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* CarOS Text - Behind/Above the phone */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
            CarOS
          </h1>
        </motion.div>

        {/* Tagline and Buttons - Bottom Front */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-xl md:text-2xl text-white mb-8 font-medium drop-shadow-lg">
              Your car's brain in your pocket
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg shadow-2xl"
              >
                Try Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 opacity-20"
        >
          <Car className="h-16 w-16 text-white" />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 opacity-20"
        >
          <Brain className="h-12 w-12 text-white" />
        </motion.div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Intelligence meets automotive
            </h2>
            <p className="text-gray-400 text-lg">
              AI-powered diagnostics that understand your car like never before
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800/50 p-8 hover:border-gray-700/50 transition-all duration-300">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                      <Brain className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI Diagnostics</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Advanced machine learning analyzes your vehicle's health
                      in real-time, predicting issues before they become
                      problems.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Button
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Video Call Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-purple-900/30 to-black/50 border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Video Support</h3>
                <p className="text-gray-400">
                  Connect with AI mechanics through your camera for instant
                  guidance.
                </p>
              </Card>
            </motion.div>

            {/* Security Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-green-900/30 to-black/50 border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-gray-400">
                  Your data stays protected with enterprise-grade security.
                </p>
              </Card>
            </motion.div>

            {/* Performance Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-yellow-900/30 to-black/50 border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Real-time Performance
                    </h3>
                    <p className="text-gray-400">
                      Monitor your vehicle's performance metrics and get instant
                      insights.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-gray-400 text-lg">
              Three simple steps to automotive intelligence
            </p>
          </motion.div>

          <Timeline
            data={[
              {
                title: "Connect Your Device",
                content: (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="h-6 w-6 text-blue-400" />
                      <span className="text-lg font-semibold text-white">
                        Step 1
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      Link your smartphone to your vehicle's diagnostic port for
                      seamless data flow.
                    </p>
                  </div>
                ),
              },
              {
                title: "AI Analysis",
                content: (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="h-6 w-6 text-purple-400" />
                      <span className="text-lg font-semibold text-white">
                        Step 2
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      Our advanced AI processes real-time data to understand
                      your car's health and performance.
                    </p>
                  </div>
                ),
              },
              {
                title: "Smart Insights",
                content: (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Car className="h-6 w-6 text-green-400" />
                      <span className="text-lg font-semibold text-white">
                        Step 3
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      Receive actionable insights, maintenance reminders, and
                      predictive diagnostics.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to transform your driving?
            </h2>
            <p className="text-gray-400 text-xl mb-8">
              Experience the future of automotive intelligence today.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg"
              >
                Try Demo Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
