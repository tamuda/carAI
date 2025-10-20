"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  role: "ai" | "user";
  content: string;
  timestamp: number;
}

interface AIVideoCallProps {
  issueName: string;
  onClose: () => void;
}

export default function AIVideoCall({ issueName, onClose }: AIVideoCallProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Simulated AI guidance steps for fixing coolant issue
  const guidanceSteps = [
    {
      trigger: "start",
      ai: "Hi! I can see your engine bay through the camera. I'll help you check the coolant issue. First, make sure the engine is completely cool - it should be off for at least 30 minutes. Is it cool to touch?",
    },
    {
      trigger: "yes",
      ai: "Great! Now, point your camera at the engine bay. I need to see the coolant reservoir - it's usually a translucent plastic tank near the radiator. Can you find it?",
    },
    {
      trigger: "found",
      ai: "Perfect! I can see it. Now check the level - there should be MIN and MAX markings on the side. Point the camera closer so I can see the fluid level. Is it below the MIN line?",
    },
    {
      trigger: "low",
      ai: "I can see it's low. We need to add coolant. Before opening it, press on the tank - does it feel firm or can you squeeze it? This tells us if there's still pressure.",
    },
    {
      trigger: "soft",
      ai: "Good, no pressure. Now carefully unscrew the cap counter-clockwise. Show me the opening - I need to check if the coolant looks clean or if there's rust or oil in it.",
    },
    {
      trigger: "clean",
      ai: "Excellent! The coolant looks good - no contamination. Now slowly pour in the 50/50 coolant mix until it reaches the MAX line. Pour slowly and show me as you fill it.",
    },
    {
      trigger: "filled",
      ai: "Perfect! I can see it's at the right level now. Screw the cap back on tightly. Now start your engine and let it idle for 2 minutes while I monitor the temperature through your OBD sensor.",
    },
    {
      trigger: "running",
      ai: "Great! Temperature is stabilizing at 92°C - that's perfect! The issue is resolved. Make sure to check the level again tomorrow to see if it drops - that would indicate a leak. You're all set! 🎉",
    },
  ];

  useEffect(() => {
    // Enable camera
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Use back camera on mobile
          audio: true,
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Simulate connection delay
        setTimeout(() => {
          setIsConnecting(false);
          simulateAIResponse("start");
        }, 2000);
      } catch (error) {
        console.error("Camera access error:", error);
        setIsConnecting(false);
      }
    };

    enableCamera();

    return () => {
      // Cleanup camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const simulateAIResponse = (trigger: string) => {
    const step = guidanceSteps.find((s) => s.trigger === trigger);
    if (step) {
      setIsSpeaking(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: step.ai, timestamp: Date.now() },
        ]);
        setIsSpeaking(false);
        setCurrentStep((prev) => prev + 1);
      }, 1500); // Simulate AI thinking time
    }
  };

  const quickResponses = [
    { label: "Yes, it's cool", trigger: "yes", step: 0 },
    { label: "Found the reservoir", trigger: "found", step: 1 },
    { label: "Below MIN line", trigger: "low", step: 2 },
    { label: "Feels soft, no pressure", trigger: "soft", step: 3 },
    { label: "Coolant looks clean", trigger: "clean", step: 4 },
    { label: "Filled to MAX", trigger: "filled", step: 5 },
    { label: "Engine running", trigger: "running", step: 6 },
  ];

  const handleQuickResponse = (trigger: string, label: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: label, timestamp: Date.now() },
    ]);
    simulateAIResponse(trigger);
  };

  const handleClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          {/* Video Feed */}
          <div className="relative w-full aspect-video bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Connection Overlay */}
            {isConnecting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg">Connecting to AI Mechanic...</p>
                </div>
              </div>
            )}

            {/* AI Status Indicator */}
            {!isConnecting && (
              <div className="absolute top-4 left-4 glass-card-premium px-4 py-2 rounded-full flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isSpeaking ? "bg-green-400" : "bg-white/40"
                  }`}
                  style={{
                    animation: isSpeaking ? "pulse-subtle 1s ease-in-out infinite" : "none",
                  }}
                />
                <span className="text-sm text-white font-medium">
                  {isSpeaking ? "AI Speaking..." : "AI Ready"}
                </span>
              </div>
            )}

            {/* Microphone Indicator */}
            {!isConnecting && (
              <div className="absolute top-4 right-4 glass-card-premium px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-white font-medium">Recording</span>
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="p-6 max-h-80 overflow-y-auto space-y-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl">AI Video Assistance</DialogTitle>
              <p className="text-sm text-white/60">
                Fixing: {issueName}
              </p>
            </DialogHeader>

            {/* Messages */}
            <div className="space-y-3">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm flex-shrink-0">
                        🤖
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                        message.role === "ai"
                          ? "glass-card-premium border border-white/10"
                          : "bg-white/10"
                      }`}
                    >
                      <p className="text-sm text-white/90 leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm flex-shrink-0">
                        👤
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isSpeaking && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div className="glass-card-premium border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Response Buttons */}
            {!isConnecting && !isSpeaking && currentStep < guidanceSteps.length && (
              <div className="flex flex-wrap gap-2 pt-4">
                {quickResponses
                  .filter((r) => r.step === currentStep)
                  .map((response) => (
                    <Button
                      key={response.trigger}
                      onClick={() => handleQuickResponse(response.trigger, response.label)}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm"
                      size="sm"
                    >
                      {response.label}
                    </Button>
                  ))}
              </div>
            )}

            {/* Completion */}
            {currentStep >= guidanceSteps.length && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card-premium rounded-2xl p-6 text-center"
              >
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Issue Resolved!
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  Your coolant level is now optimal. Temperature is stable at 92°C.
                </p>
                <Button
                  onClick={handleClose}
                  className="bg-white hover:bg-white/90 text-black font-semibold"
                >
                  End Call
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

