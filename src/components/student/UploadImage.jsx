import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL2 = "http://localhost:5010";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [count, setCount] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const redirectMsg = location.state?.message;

  // userId -> always a string
  const userStr = localStorage.getItem("user");
  const uniqueId = (() => {
    try {
      const parsed = userStr ? JSON.parse(userStr) : null;
      return parsed?.userId ? String(parsed.userId) : null;
    } catch {
      return null;
    }
  })();

  // 1) Check current count on mount
  useEffect(() => {
    if (!uniqueId) return;
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE_URL2}/check_images/${encodeURIComponent(uniqueId)}`);
        const data = await res.json();
        if (res.ok) {
          setCount(data.count ?? 0);
          setUploaded(Boolean(data.uploaded));
          if (data.uploaded) doRedirect();
        } else {
          setMessage(data.error || "Failed to check image count");
        }
      } catch {
        setMessage("Failed to check image count");
      }
    };
    run();
    // optional: refresh count every few seconds if other tabs may upload too
    // const id = setInterval(run, 5000); return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueId]);

  const doRedirect = () => {
    // small delay for UX messaging; optional
    setTimeout(() => {
      if (location.state?.redirectTo) navigate(location.state.redirectTo);
      else navigate(-1);
    }, 800);
  };

  const startCamera = async () => {
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStreaming(true);
        setMessage("");
      } catch {
        setMessage("Cannot access webcam.");
      }
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());
    videoRef.current.srcObject = null;
    setStreaming(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setImage(dataUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueId) {
      setMessage("No user ID found. Please sign in again.");
      return;
    }
    if (!image) {
      setMessage("Please capture a photo first.");
      return;
    }
    if (count >= 5) {
      setMessage("You already have 5 images. Continuing…");
      doRedirect();
      return;
    }

    setMessage("Uploading...");
    try {
      const res = await fetch(`${API_BASE_URL2}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, unique_id: uniqueId }),
      });
      const data = await res.json();

      // success path
      if (res.ok) {
        const newCount = (data.images_count ?? count) > count
          ? data.images_count
          : count + 1; // fallback if backend didn’t send images_count
        setCount(newCount);
        setMessage(data.message || `Uploaded (${newCount}/5).`);
        setImage(null); // clear preview to prompt next shot

        if (newCount >= 5) {
          setUploaded(true);
          setMessage("Got all 5 images. Continuing…");
          doRedirect();
        }
        return;
      }

      // error path
      const errMsg = (data.error || "").toLowerCase();
      if (errMsg.includes("maximum of 5")) {
        setCount(5);
        setUploaded(true);
        setMessage("Already have 5 images. Continuing…");
        doRedirect();
      } else {
        setMessage(data.error || "Error uploading image.");
      }
    } catch {
      setMessage("Error uploading image.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto", padding: 24, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <h2 style={{ marginBottom: 2, color: "#2d3748" }}>Upload Your Image</h2>
      <div style={{ fontSize: 14, color: "#4a5568" }}>{`Progress: ${count}/5`}</div>

      {redirectMsg && (
        <div style={{ color: "#e53e3e", background: "#fff5f5", border: "1px solid #feb2b2", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontWeight: 600, textAlign: "center" }}>
          {redirectMsg}
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        {!streaming ? (
          <button type="button" onClick={startCamera} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#3182ce", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            📷 Start Webcam
          </button>
        ) : (
          <>
            <button type="button" onClick={capturePhoto} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#38a169", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
              📸 Capture Photo
            </button>
            <button type="button" onClick={stopCamera} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#e53e3e", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
              🛑 Stop
            </button>
          </>
        )}
      </div>

      <div style={{ width: 320, height: 240, position: "relative", background: "#f7fafc", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        <video ref={videoRef} autoPlay style={{ width: 320, height: 240, display: streaming ? "block" : "none", borderRadius: 8, objectFit: "cover" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {!streaming && !image && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#a0aec0", fontSize: 18 }}>
            Webcam preview
          </div>
        )}
        {image && (
          <img src={image} alt="Captured" style={{ width: 160, marginTop: 10, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", padding: 4 }} />
        )}
      </div>

      <button type="submit" disabled={!image || uploaded} style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: !image || uploaded ? "#a0aec0" : "#805ad5", color: "#fff", fontWeight: 700, fontSize: 16, cursor: !image || uploaded ? "not-allowed" : "pointer", marginTop: 4 }}>
        {count < 5 ? `Upload (${count}/5)` : "Continue"}
      </button>

      <div style={{ minHeight: 24, color: message?.toLowerCase().includes("error") ? "#e53e3e" : "#2b6cb0", fontWeight: 500, marginTop: 6, textAlign: "center" }}>
        {message}
      </div>
    </form>
  );
};

export default UploadImage;
