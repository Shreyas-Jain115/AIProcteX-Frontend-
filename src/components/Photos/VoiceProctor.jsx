// src/components/proctor/VoiceProctor.jsx
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

/**
 * VoiceProctor (English-only)
 * - Starts mic + Web Speech API (if available) on mount
 * - Continuously builds a final concatenated transcript (English)
 * - Optionally streams updates via onTranscriptUpdate
 * - Exposes ref.stop(): Promise<string> that resolves to the final transcript
 * - StrictMode-safe cleanup
 */
const VoiceProctor = forwardRef(
  ({ onTranscriptUpdate, debug = false }, ref) => {
    const streamRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const rafIdRef = useRef(null);

    const srRef = useRef(null);                // SpeechRecognition instance
    const [active, setActive] = useState(true);
    const activeRef = useRef(true);

    const [transcript, setTranscript] = useState(""); // live + final text
    const pendingTextRef = useRef("");                // last interim (not yet final)

    const log = (...a) => debug && console.log("[VoiceProctor]", ...a);

    useEffect(() => { activeRef.current = active; }, [active]);

    const stopTracksOnly = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        log("Mic tracks stopped.");
      }
    };

    const stopAudioNodes = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
        audioCtxRef.current = null;
      }
      analyserRef.current = null;
      dataArrayRef.current = null;
    };

    const stopRecognition = () => {
      const sr = srRef.current;
      if (sr) {
        try {
          sr.onresult = null;
          sr.onend = null;
          sr.onerror = null;
          sr.stop();
        } catch {}
        srRef.current = null;
        log("SpeechRecognition stopped.");
      }
    };

    const stopAll = () => {
      setActive(false);
      stopRecognition();
      stopAudioNodes();
      stopTracksOnly();
    };

    // Start mic + SpeechRecognition (English only)
    useEffect(() => {
      let cancelled = false;
      setActive(true); // ensure active on (re)mount in StrictMode

      (async () => {
        try {
          log("Requesting microphone…");
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;

          // Minimal audio graph (optional; useful if you want simple VAD/logging)
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          try {
            const audioCtx = new AudioContext();
            audioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.8;
            analyserRef.current = analyser;
            source.connect(analyser);
            dataArrayRef.current = new Float32Array(analyser.fftSize);

            // Optional tiny VAD trace (disabled by default)
            if (debug) {
              const vadLoop = () => {
                if (!analyserRef.current || !dataArrayRef.current) return;
                analyserRef.current.getFloatTimeDomainData(dataArrayRef.current);
                // no-op; you could compute RMS for debug here
                rafIdRef.current = requestAnimationFrame(vadLoop);
              };
              rafIdRef.current = requestAnimationFrame(vadLoop);
            }
          } catch (e) {
            log("AudioContext unavailable (ok to ignore):", e);
          }

          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SR) {
            console.warn("[VoiceProctor] SpeechRecognition not supported in this browser.");
            return;
          }

          const sr = new SR();
          srRef.current = sr;
          sr.lang = "en-US";       // 🔒 English only
          sr.continuous = true;
          sr.interimResults = true;

          sr.onresult = (e) => {
            let interim = "";
            let didChange = false;

            setTranscript((prev) => {
              let next = prev;
              for (let i = e.resultIndex; i < e.results.length; i++) {
                const res = e.results[i];
                const text = res[0]?.transcript || "";
                if (res.isFinal) {
                  const txt = text.trim();
                  if (txt) {
                    next = next ? `${next} ${txt}` : txt;
                    didChange = true;
                    log("Final:", txt);
                  }
                } else {
                  interim += text;
                }
              }
              return next;
            });

            pendingTextRef.current = interim.trim();
            if (debug && interim) log("Interim:", pendingTextRef.current);
            if (didChange && onTranscriptUpdate) onTranscriptUpdate((transcript + " " + pendingTextRef.current).trim());
            else if (onTranscriptUpdate) onTranscriptUpdate((transcript + (pendingTextRef.current ? " " + pendingTextRef.current : "")).trim());
          };

          sr.onerror = (err) => {
            console.warn("[VoiceProctor] SpeechRecognition error:", err?.error || err);
          };

          // Keep recognition running
          sr.onend = () => {
            if (activeRef.current) {
              try { sr.start(); } catch {}
            }
          };

          sr.start();
          log("SpeechRecognition started (en-US).");
        } catch (err) {
          console.error("[VoiceProctor] Mic error:", err);
        }
      })();

      return () => {
        cancelled = true;
        // StrictMode cleanup: stop systems; keep state flag untouched
        stopRecognition();
        stopAudioNodes();
        stopTracksOnly();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Expose async stop() → returns final transcript (including any pending interim)
    useImperativeHandle(ref, () => ({
      stop: async () => {
        // First, stop everything
        stopAll();

        // Small delay to allow any late finalization (best-effort)
        await new Promise((r) => setTimeout(r, 100));

        // Append any leftover interim so it's not lost
        const pending = pendingTextRef.current?.trim();
        let finalOut;
        if (pending) {
          finalOut = (transcript ? `${transcript} ${pending}` : pending).trim();
          // push to state for completeness
          setTranscript(finalOut);
        } else {
          finalOut = transcript.trim();
        }

        return finalOut;
      },
    }));

    // Headless: no UI
    return null;
  }
);

export default VoiceProctor;
