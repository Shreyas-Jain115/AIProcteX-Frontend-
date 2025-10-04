import { useEffect, useState } from "react";
import { useMainContext } from "../context/AuthContext";

const SecurityBlocker = () => {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wasHidden, setWasHidden] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const [deviceCount, setDeviceCount] = useState(0);

  // ===== import logging API from context =====
  const { logViolation, violationsCount, violationsLog } = useMainContext();

  useEffect(() => {
    const record = (type, details = {}) => {
      setCounter((prev) => prev + 1);
      logViolation(type, details);
    };

    const incrementAndAlert = (type, message, details = {}) => {
      if (!alertActive) {
        record(type, details);
        setAlertActive(true);
        setTimeout(() => {
          alert(message);
          setAlertActive(false);
        }, 100);
      } else {
        record(type, details);
      }
    };

    const requestFullScreen = () => {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    };

    // force fullscreen on mount
    requestFullScreen();

    // FULLSCREEN CHANGE (with interval logging)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation("fullscreen_exit", { reason: "fullscreenchange" }, "start");
        incrementAndAlert(
          "fullscreen_exit",
          "⚠ Fullscreen mode is required!",
          { reason: "fullscreenchange" }
        );
        requestFullScreen();
      } else {
        logViolation("fullscreen_exit", { reason: "fullscreenchange" }, "end");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // KEYDOWN: try to detect PrintScreen + combinations
    const blockScreenshotAndRecording = (event) => {
      const key = event.key || "";
      const isPrint = key === "PrintScreen";
      const combo =
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        ["S", "4", "R", "5"].includes(key);
      if (isPrint || combo) {
        event.preventDefault?.();
        incrementAndAlert(
          "screenshot",
          "⚠ Screenshots & Screen Recording are disabled!",
          { key, ctrl: event.ctrlKey, meta: event.metaKey, shift: event.shiftKey }
        );
      }
    };
    document.addEventListener("keydown", blockScreenshotAndRecording);

    // BLOCK COMMON SHORTCUTS (copy/paste etc.)
    const blockShortcuts = (event) => {
      const keyCode = event.keyCode || event.which;
      if ((event.ctrlKey || event.metaKey) && [67, 86, 88, 84].includes(keyCode)) {
        event.preventDefault?.();
        incrementAndAlert(
          "copy_paste_shortcut",
          "⚠ Keyboard shortcuts are disabled!",
          { keyCode }
        );
      }
    };
    document.addEventListener("keydown", blockShortcuts);

    // VISIBILITY CHANGE (with interval logging)
    const visibilityHandler = () => {
      const hidden = document.hidden;
      setWasHidden(hidden);
      if (hidden) {
        logViolation("visibility_hidden", { hidden: true }, "start");
      } else {
        logViolation("visibility_hidden", { hidden: false }, "end");
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    // BEFORE UNLOAD
    window.onbeforeunload = (event) => {
      record("attempt_unload", {});
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave?";
    };

    // BLUR / FOCUS (App Switch with interval logging)
    let lostFocus = false;
    const detectAppSwitch = () => {
      if (!document.hasFocus() && !wasHidden && !alertActive && !lostFocus) {
        lostFocus = true;
        logViolation("app_switch", {}, "start");
        incrementAndAlert(
          "app_switch",
          "⚠ You switched apps! Please stay on this page."
        );
      } else if (document.hasFocus() && lostFocus) {
        logViolation("app_switch", {}, "end");
        lostFocus = false;
      }
    };
    window.addEventListener("blur", detectAppSwitch);
    window.addEventListener("focus", detectAppSwitch);

    // USB device check
    const detectRemoteAccess = setInterval(() => {
      if (navigator.usb && typeof navigator.usb.getDevices === "function") {
        navigator.usb
          .getDevices()
          .then((devices) => {
            setDeviceCount(devices.length);
            if ((devices.length || 0) > 0) {
              record("usb_connected", { deviceCount: devices.length });
            }
          })
          .catch(() => {});
      }
    }, 5000);

    // PREVENT RESIZE (small window)
    const preventResize = () => {
      if (
        (window.innerWidth < 800 || window.innerHeight < 600) &&
        !alertActive
      ) {
        incrementAndAlert(
          "window_resize_small",
          "⚠ You must keep the window in full size!",
          { width: window.innerWidth, height: window.innerHeight }
        );
        requestFullScreen();
      }
    };
    window.addEventListener("resize", preventResize);

    // KEYUP PrintScreen fallback
    const blockScreenshotKeyUp = (event) => {
      if (event.key === "PrintScreen") {
        event.preventDefault?.();
        incrementAndAlert("screenshot", "⚠ Screenshots are not allowed!", {
          key: event.key,
        });
      }
    };
    document.addEventListener("keyup", blockScreenshotKeyUp);

    // Cleanup
    return () => {
      clearInterval(detectRemoteAccess);
      window.removeEventListener("blur", detectAppSwitch);
      window.removeEventListener("focus", detectAppSwitch);
      window.removeEventListener("resize", preventResize);
      document.removeEventListener("keydown", blockShortcuts);
      document.removeEventListener("keydown", blockScreenshotAndRecording);
      document.removeEventListener("keyup", blockScreenshotKeyUp);
      document.removeEventListener("visibilitychange", visibilityHandler);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.onbeforeunload = null;
    };
  }, [wasHidden, alertActive, logViolation]);

  useEffect(() => {
    if (counter > 0 && counter % 4 === 0) {
      setText("");
    }
  }, [counter]);

  const handleSubmit = () => {
    if (counter < 10) {
      setSubmitted(true);
      alert("✅ Submission successful!");
    } else {
      alert("❌ Submission failed! Too many security violations.");
    }
  };

  return <></>;
};

export default SecurityBlocker;
