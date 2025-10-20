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

interface AIVideoCallProps {
  issueName: string;
  onClose: () => void;
}

const MECHANIC_INSTRUCTIONS = `You are an expert car mechanic providing live video assistance to help fix a car issue.

CURRENT ISSUE: High coolant temperature (105°C - should be 85-95°C)

Your job is to:
1. Guide the user step-by-step through checking and refilling coolant
2. Pretend you can "see" through their camera (they're pointing it at the engine)
3. Give clear, simple instructions one step at a time
4. Ask them to confirm each step before moving to the next
5. Use car mechanic language but explain technical terms simply
6. Be encouraging and patient

REPAIR STEPS TO GUIDE THEM THROUGH:
1. Verify engine is cool (wait 30 min if not)
2. Locate coolant reservoir (translucent tank near radiator)
3. Check fluid level (should have MIN/MAX markings)
4. Test for pressure (gently squeeze tank)
5. Open cap carefully when no pressure
6. Inspect coolant condition (check for rust/oil)
7. Add 50/50 coolant mix to MAX line
8. Replace cap and start engine
9. Monitor temperature (should stabilize at 90-95°C)
10. Check for leaks

IMPORTANT RULES:
- Speak naturally like you're on a phone call
- Keep responses SHORT - 1-2 sentences max per response
- Ask ONE question at a time
- Wait for their response before next instruction
- If they sound unsure, reassure them
- Safety first - always emphasize waiting for engine to cool
- Act like you're looking through the camera: "I can see...", "Point the camera closer to..."

Start by greeting them and asking if the engine is cool to touch.`;

export default function AIVideoCall({ issueName, onClose }: AIVideoCallProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const userAnalyzerRef = useRef<AnalyserNode | null>(null);
  const aiAnalyzerRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    startVoiceSession();

    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const startVoiceSession = async () => {
    try {
      setIsConnecting(true);

      // Get OpenAI Realtime session
      const sessionResponse = await fetch("/api/openai-session");
      if (!sessionResponse.ok) {
        throw new Error("Failed to get OpenAI session");
      }
      const session = await sessionResponse.json();
      const sessionToken = session.client_secret.value;

      // Create WebRTC peer connection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Set up audio element for AI voice
      if (!audioElementRef.current) {
        audioElementRef.current = document.createElement("audio");
      }
      audioElementRef.current.autoplay = true;

      // Handle incoming audio from AI
      pc.ontrack = (event) => {
        if (audioElementRef.current) {
          audioElementRef.current.srcObject = event.streams[0];

          // Set up AI voice activity detection
          const audioCtx = new AudioContext();
          const aiSource = audioCtx.createMediaStreamSource(event.streams[0]);
          const analyser = audioCtx.createAnalyser();
          aiSource.connect(analyser);
          analyser.fftSize = 256;
          aiAnalyzerRef.current = analyser;

          const detectAIVoice = () => {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setIsAISpeaking(average > 10);
            requestAnimationFrame(detectAIVoice);
          };
          detectAIVoice();
        }
      };

      // Get user microphone and camera
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: "environment" }, // Back camera
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set up user voice activity detection
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      microphone.connect(analyser);
      userAnalyzerRef.current = analyser;

      // Detect when user is speaking
      const detectUserVoice = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const average = array.reduce((a, b) => a + b, 0) / array.length;
        setIsUserSpeaking(average > 15);
        requestAnimationFrame(detectUserVoice);
      };
      detectUserVoice();

      // Add audio track to peer connection
      const audioTrack = stream.getAudioTracks()[0];
      pc.addTrack(audioTrack, stream);

      // Create data channel for events
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log("Data channel opened");
        // Send initial instructions
        dc.send(
          JSON.stringify({
            type: "session.update",
            session: {
              instructions: MECHANIC_INSTRUCTIONS,
              voice: "sage",
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500,
              },
            },
          })
        );
      };

      dc.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // Handle transcript updates
          if (message.type === "conversation.item.input_audio_transcription.completed") {
            setTranscript((prev) => [
              ...prev,
              `You: ${message.transcript}`,
            ]);
          }
          
          if (message.type === "response.done") {
            const text = message.response?.output?.[0]?.content?.[0]?.transcript;
            if (text) {
              setTranscript((prev) => [
                ...prev,
                `AI Mechanic: ${text}`,
              ]);
            }
          }
        } catch (error) {
          console.error("Error parsing data channel message:", error);
        }
      };

      // Create and set offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to OpenAI
      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/sdp",
          },
        }
      );

      if (!sdpResponse.ok) {
        throw new Error("Failed to get SDP answer from OpenAI");
      }

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      setIsConnecting(false);
    } catch (error: any) {
      console.error("Error starting voice session:", error);
      setError(error.message);
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    cleanup();
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

            {/* Error Message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="glass-card-premium rounded-2xl p-6 max-w-md text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <p className="text-sm text-white/60 mb-4">
                    Make sure you've added your OpenAI API key to .env.local
                  </p>
                  <Button onClick={handleClose} className="bg-white text-black">
                    Close
                  </Button>
                </div>
              </div>
            )}

            {/* AI Speaking Indicator */}
            {!isConnecting && !error && (
              <div className="absolute top-4 left-4 glass-card-premium px-4 py-2 rounded-full flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isAISpeaking ? "bg-green-400" : "bg-white/40"
                  }`}
                  style={{
                    animation: isAISpeaking ? "pulse-subtle 0.5s ease-in-out infinite" : "none",
                  }}
                />
                <span className="text-sm text-white font-medium">
                  {isAISpeaking ? "AI Speaking..." : "AI Listening"}
                </span>
              </div>
            )}

            {/* User Microphone Indicator */}
            {!isConnecting && !error && (
              <div className="absolute top-4 right-4 glass-card-premium px-4 py-2 rounded-full flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isUserSpeaking ? "bg-red-500" : "bg-white/40"
                  }`}
                  style={{
                    animation: isUserSpeaking ? "pulse-subtle 0.5s ease-in-out infinite" : "none",
                  }}
                />
                <span className="text-sm text-white font-medium">
                  {isUserSpeaking ? "You're Speaking" : "Microphone On"}
                </span>
              </div>
            )}

            {/* Issue Badge */}
            <div className="absolute bottom-4 left-4 glass-card-premium px-4 py-2 rounded-2xl">
              <p className="text-xs text-white/50 mb-1">Fixing:</p>
              <p className="text-sm text-white font-semibold">{issueName}</p>
            </div>
          </div>

          {/* Transcript */}
          <div className="p-6 max-h-64 overflow-y-auto space-y-3 bg-black/20">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl">Live Conversation</DialogTitle>
              <p className="text-xs text-white/60">
                Speak naturally - the AI can hear you
              </p>
            </DialogHeader>

            {transcript.length === 0 && !isConnecting && !error && (
              <p className="text-sm text-white/50 italic text-center py-4">
                Start talking to the AI mechanic...
              </p>
            )}

            <div className="space-y-2">
              <AnimatePresence>
                {transcript.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`text-sm ${
                      message.startsWith("You:")
                        ? "text-white/80"
                        : "text-green-400"
                    }`}
                  >
                    {message}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Voice Activity Visualization */}
            {!isConnecting && !error && (
              <div className="flex items-center justify-center gap-1 py-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isUserSpeaking
                        ? "bg-red-400 h-8"
                        : isAISpeaking
                          ? "bg-green-400 h-8"
                          : "bg-white/20 h-4"
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animation:
                        isUserSpeaking || isAISpeaking
                          ? "pulse-subtle 0.5s ease-in-out infinite"
                          : "none",
                      height:
                        isUserSpeaking || isAISpeaking
                          ? `${Math.random() * 20 + 20}px`
                          : "16px",
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                End Call
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
