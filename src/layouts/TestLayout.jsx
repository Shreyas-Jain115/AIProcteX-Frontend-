// src/layouts/TestLayout.jsx
import { Outlet, useParams } from "react-router-dom";
import { useRef, useState, useMemo } from "react";
import BackgroundProctor from "../components/Photos/BackgroundProctor";
import VoiceProctor from "../components/Photos/VoiceProctor";

export default function TestLayout() {
  const { testId } = useParams();

  const photoRef = useRef(null);
  const voiceRef = useRef(null);

  // live transcript (optional overlay)
  const [voiceLog, setVoiceLog] = useState("");

  const outletCtx = useMemo(
    () => ({
      stopProctor: async () => {
        try { await photoRef.current?.stop(); } catch {}
        let transcript = "";
        try { transcript = await voiceRef.current?.stop(); } catch {}
        return { transcript };
      },
    }),
    []
  );

  const showOverlay = import.meta?.env?.MODE !== "production"; // show in dev only

  return (
    <>
      {testId && (
        <>
          {/* 📸 Camera background proctor */}
          <BackgroundProctor
            key={`photo-${testId}`}
            ref={photoRef}
            testId={Number(testId)}
            // Use ONE of these two patterns depending on your backend mapping:
            // 1) Class has @RequestMapping("/api/tests") and method @PostMapping("/upload"):
            baseURL="http://localhost:8080/api/tests"
            uploadPath="/upload"
            // 2) OR if endpoint is http://localhost:8080/api/tests/{testId}/upload:
            // baseURL="http://localhost:8080"
            // uploadPath={`/api/tests/${testId}/upload`}
            debug={false}
          />

          {/* 🎤 Voice background proctor (English-only) */}
          <VoiceProctor
            key={`voice-${testId}`}
            ref={voiceRef}
            debug={false}
            onTranscriptUpdate={(txt) => setVoiceLog(txt)}
          />

          {/* Optional: live transcript overlay (hidden in production) */}
          {showOverlay && (
            <div
              style={{
                position: "fixed",
                bottom: 10,
                left: 10,
                background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "13px",
                maxWidth: "60%",
                zIndex: 9999,
                fontFamily: "monospace",
                pointerEvents: "none",
                whiteSpace: "pre-wrap",
              }}
            >
              {voiceLog || "Listening…"}
            </div>
          )}
        </>
      )}

      <Outlet context={outletCtx} />
    </>
  );
}
