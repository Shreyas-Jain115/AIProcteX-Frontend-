// src/components/proctor/BackgroundProctor.jsx
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";

const BackgroundProctor = forwardRef(
  (
    {
      testId,
      baseURL = "http://localhost:8080/", // absolute origin
      uploadPath = "/upload",             // or `/api/tests/${testId}/upload`
      debug = true,
    },
    ref
  ) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const canvasRef = useRef(null);
    const lastShotRef = useRef(null);     // last sent yyyymmddHHMMSS
    const [ready, setReady] = useState(false);
    const [active, setActive] = useState(true);
    const activeRef = useRef(true);
    const log = (...a) => debug && console.log("[Proctor]", ...a);

    useEffect(() => { activeRef.current = active; }, [active]);

    const stopTracksOnly = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        log("Camera tracks stopped.");
      }
    };

    const stopAll = () => {
      setActive(false);
      stopTracksOnly();
    };

    const getUserId = () => {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      try {
        const obj = JSON.parse(raw);
        return obj?.userId ?? obj?.id ?? null;
      } catch {
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      }
    };

    const getTimeLong = () => {
      const d = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      return Number(
        `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(
          d.getHours()
        )}${pad(d.getMinutes())}${pad(d.getSeconds())}`
      );
    };

    // Start camera (StrictMode-safe)
    useEffect(() => {
      let cancelled = false;
      setActive(true); // ensure active on (re)mount in StrictMode

      (async () => {
        try {
          log("Requesting camera…");
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          });
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          const video = videoRef.current;
          if (video) {
            const markReady = () => { if (!ready) { setReady(true); log("Video ready."); } };
            video.addEventListener("canplay", markReady, { once: true });
            video.addEventListener("loadedmetadata", markReady, { once: true });
            video.addEventListener("playing", markReady, { once: true });
            video.srcObject = stream;
            await video.play().catch(() => {});
          }
          log("Camera started.");
        } catch (err) {
          console.error("[Proctor] Camera error:", err);
        }
      })();

      return () => {
        cancelled = true;
        // Stop hardware only; do NOT setActive(false) here (StrictMode double-invoke)
        stopTracksOnly();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Capture loop: drift-free, aligned to exact second boundaries
    useEffect(() => {
      if (!ready) { log("Waiting for video ready…"); return; }
      if (!canvasRef.current) canvasRef.current = document.createElement("canvas");

      let cancelled = false;
      let timeoutId;

      log("Capture loop (aligned) started.");

      const scheduleNext = () => {
        if (cancelled) return;
        const now = Date.now();
        const msUntilNextSecond = 1000 - (now % 1000) + 5; // small cushion
        timeoutId = setTimeout(tick, msUntilNextSecond);
      };

      const tick = async () => {
        if (cancelled || !activeRef.current) {
          scheduleNext();
          return;
        }
        try {
          const userId = getUserId();
          if (!userId) { log("Skip: userId not found."); return scheduleNext(); }
          if (!testId)  { log("Skip: testId missing.");  return scheduleNext(); }

          const video = videoRef.current;
          if (!streamRef.current || !video || video.readyState < 2) {
            log("Skip: video not ready (readyState:", video?.readyState, ")");
            return scheduleNext();
          }

          const timeLong = getTimeLong(); // yyyymmddHHMMSS
          if (timeLong % 5 === 0 && lastShotRef.current !== timeLong) {
            lastShotRef.current = timeLong;

            const w = video.videoWidth || 640;
            const h = video.videoHeight || 480;
            const canvas = canvasRef.current;
            canvas.width = w; canvas.height = h;
            canvas.getContext("2d").drawImage(video, 0, 0, w, h);

            const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.8));
            if (!blob) { log("Skip: toBlob() returned null"); return scheduleNext(); }

            const form = new FormData();
            form.append("userId", String(userId));
            form.append("testId", String(testId));
            form.append("frame", blob, `frame_${timeLong}.jpg`);
            form.append("time", String(timeLong));
            form.append("device", "false");

            const url = `${baseURL}${uploadPath}`;
            log("📸 Uploading", timeLong, "→", url);
            await axios.post(url, form, { headers: { "Content-Type": "multipart/form-data" } });
            log("✅ Uploaded", timeLong);
          } else {
            log("Tick:", timeLong, "→ not divisible by 5.");
          }
        } catch (err) {
          console.error("[Proctor] Upload failed:", axios.isAxiosError(err)
            ? `${err.response?.status ?? ""} ${err.response?.data ?? err.message}`
            : err);
        } finally {
          scheduleNext();
        }
      };

      // start aligned
      scheduleNext();

      // re-align when tab becomes visible again
      const onVis = () => {
        if (!document.hidden) {
          clearTimeout(timeoutId);
          scheduleNext();
        }
      };
      document.addEventListener("visibilitychange", onVis);

      return () => {
        cancelled = true;
        clearTimeout(timeoutId);
        document.removeEventListener("visibilitychange", onVis);
        log("Capture loop (aligned) stopped.");
      };
      // Keep deps STABLE; if baseURL/uploadPath/testId change, remount with a new key.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready]);

    useImperativeHandle(ref, () => ({
      stop: async () => {
        stopAll();
        await new Promise((r) => setTimeout(r, 50));
      },
    }));

    return (
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        style={{ width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
      />
    );
  }
);

export default BackgroundProctor;
