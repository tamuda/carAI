"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  const [isHoldingToSpeak, setIsHoldingToSpeak] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const userAnalyzerRef = useRef<AnalyserNode | null>(null);
  const aiAnalyzerRef = useRef<AnalyserNode | null>(null);
  const audioTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    startVoiceSession();

    return () => {
      cleanup();
    };
  }, []);

  // Handle push-to-talk state
  useEffect(() => {
    if (audioTrackRef.current) {
      audioTrackRef.current.enabled = isHoldingToSpeak;
    }
  }, [isHoldingToSpeak]);

  // Keyboard support - spacebar to talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isAISpeaking && !isHoldingToSpeak) {
        e.preventDefault();
        handleSpeakStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isHoldingToSpeak) {
        e.preventDefault();
        handleSpeakEnd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isHoldingToSpeak, isAISpeaking]);

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
            const average =
              dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
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
      audioTrackRef.current = audioTrack;

      // Disable audio by default (push-to-talk)
      audioTrack.enabled = false;

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
          if (
            message.type ===
            "conversation.item.input_audio_transcription.completed"
          ) {
            setTranscript((prev) => [...prev, `You: ${message.transcript}`]);
          }

          if (message.type === "response.done") {
            const text =
              message.response?.output?.[0]?.content?.[0]?.transcript;
            if (text) {
              setTranscript((prev) => [...prev, `AI Mechanic: ${text}`]);
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

  const handleSpeakStart = () => {
    if (audioTrackRef.current) {
      audioTrackRef.current.enabled = true;
      setIsHoldingToSpeak(true);
    }
  };

  const handleSpeakEnd = () => {
    if (audioTrackRef.current) {
      audioTrackRef.current.enabled = false;
      setIsHoldingToSpeak(false);
    }
  };

  const handleClose = () => {
    cleanup();
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-full max-h-screen h-screen p-0 overflow-hidden border-none">
        {/* Full Screen Video */}
        <div className="relative w-full h-full bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Connection Overlay */}
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6" />
                <p className="text-white text-xl font-semibold">
                  Connecting to AI Mechanic...
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Setting up video and voice
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 px-8">
              <div className="glass-card-premium rounded-3xl p-8 max-w-md text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-white mb-3">Connection Error</h3>
                <p className="text-red-400 mb-4">{error}</p>
                <p className="text-sm text-white/60 mb-6">
                  Make sure you've added your OpenAI API key to .env.local
                </p>
                <Button onClick={handleClose} className="bg-white text-black w-full">
                  Close
                </Button>
              </div>
            </div>
          )}

          {!isConnecting && !error && (
            <>
              {/* Top Bar - Issue & Status */}
              <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-start justify-between">
                  {/* Issue Info */}
                  <div className="glass-card-premium px-4 py-3 rounded-2xl">
                    <p className="text-xs text-white/60 mb-1">Fixing</p>
                    <p className="text-sm text-white font-semibold">{issueName}</p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-full glass-card-premium flex items-center justify-center hover:bg-white/10 transition-all"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* AI Status Indicator */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="glass-card-premium px-4 py-2 rounded-full flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isAISpeaking ? "bg-green-400" : "bg-white/40"
                      }`}
                      style={{
                        animation: isAISpeaking
                          ? "pulse-subtle 0.5s ease-in-out infinite"
                          : "none",
                      }}
                    />
                    <span className="text-sm text-white font-medium">
                      {isAISpeaking ? "AI Speaking" : "AI Listening"}
                    </span>
                  </div>

                  {/* Transcript Toggle */}
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="glass-card-premium px-4 py-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    <span className="text-sm text-white/80">
                      {showTranscript ? "Hide" : "Show"} Chat
                    </span>
                  </button>
                </div>
              </div>

              {/* Transcript Overlay - Expandable */}
              <AnimatePresence>
                {showTranscript && transcript.length > 0 && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="absolute top-32 left-6 right-6 max-h-64 overflow-y-auto glass-card-premium rounded-3xl p-4"
                  >
                    <div className="space-y-2">
                      {transcript.slice(-5).map((message, index) => (
                        <div
                          key={index}
                          className={`text-sm ${
                            message.startsWith("You:")
                              ? "text-white/80"
                              : "text-green-400 font-medium"
                          }`}
                        >
                          {message}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Latest AI Message - Subtitle Style */}
              {!showTranscript && transcript.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-32 left-6 right-6"
                >
                  <div className="glass-card-premium rounded-2xl px-6 py-4 backdrop-blur-2xl">
                    <p className="text-white text-center leading-relaxed">
                      {transcript[transcript.length - 1]?.replace("AI Mechanic: ", "")}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Bottom Controls - Apple/Tesla Style */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="max-w-md mx-auto space-y-4">
                  {/* Voice Activity Visualization */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-150 ${
                          isHoldingToSpeak && isUserSpeaking
                            ? "bg-red-400"
                            : isAISpeaking
                              ? "bg-green-400"
                              : "bg-white/30"
                        }`}
                        animate={{
                          height:
                            isHoldingToSpeak && isUserSpeaking
                              ? `${Math.random() * 30 + 20}px`
                              : isAISpeaking
                                ? `${Math.random() * 30 + 20}px`
                                : "12px",
                        }}
                        transition={{
                          duration: 0.1,
                          repeat: isHoldingToSpeak || isAISpeaking ? Infinity : 0,
                        }}
                      />
                    ))}
                  </div>

                  {/* Push to Talk Button - Premium Design */}
                  <button
                    onMouseDown={handleSpeakStart}
                    onMouseUp={handleSpeakEnd}
                    onMouseLeave={handleSpeakEnd}
                    onTouchStart={handleSpeakStart}
                    onTouchEnd={handleSpeakEnd}
                    disabled={isAISpeaking}
                    className={`w-full py-6 rounded-full font-semibold text-lg transition-all duration-200 shadow-2xl ${
                      isHoldingToSpeak
                        ? "bg-red-500 text-white scale-95 shadow-red-500/50"
                        : isAISpeaking
                          ? "bg-white/5 text-white/30 cursor-not-allowed"
                          : "bg-white text-black hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isAISpeaking ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-2xl">🔇</span>
                        <span>AI is speaking...</span>
                      </span>
                    ) : isHoldingToSpeak ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-2xl animate-pulse">🎤</span>
                        <span>Listening...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-2xl">🎤</span>
                        <span>Hold to Speak</span>
                      </span>
                    )}
                  </button>

                  {/* Helper Text */}
                  <p className="text-center text-white/50 text-sm">
                    {isAISpeaking
                      ? "Wait for AI to finish..."
                      : "Press and hold to talk • Release to let AI respond"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
