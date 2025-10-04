// import { createContext, useContext, useState } from 'react';

// const MainContext = createContext();

// export const ContextProvider = ({ children }) => {
//   const [currentQuestion, setcurrentQuestion] = useState([]);
//   const [testDetail, setTestDetails] = useState({});
//   const [TestActive, setTestActive] = useState({});
//   const [final, setFinal] = useState({});
//   const [time, setTime] = useState(0);

//   // --- Violation logging state ---
//   const [violationsLog, setViolationsLog] = useState([]);
//   const [violationsCount, setViolationsCount] = useState({});

//   const logViolation = (type, details = {}) => {
//     const ts = new Date().toISOString();
//     setViolationsLog(prev => [{ type, details, ts }, ...prev]);
//     setViolationsCount(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
//   };

//   const resetViolations = () => {
//     setViolationsLog([]);
//     setViolationsCount({});
//   };

//   /**
//    * computeFinalTime
//    * - Traverses violationsLog timestamps
//    * - eventTypesStart: events that mark the beginning of an interruption
//    * - eventTypesEnd: events that mark the end of interruption (visibility_shown etc)
//    *
//    * Params:
//    * - opts.sessionStart (ISO string) optional — if not provided uses earliest log ts
//    * - opts.sessionEnd (ISO string) optional — if not provided uses latest log ts or now
//    *
//    * Side effects:
//    * - setTime(activeSeconds)  // (active time in seconds)
//    * - setFinal(prev => ({ ...prev, finalTime: activeSeconds, interruptedTime, totalSessionTime, sessionStart, sessionEnd }))
//    */
//   const computeFinalTime = (opts = {}) => {
//     const logs = [...violationsLog]; // current copy
//     if (!logs || logs.length === 0) {
//       // nothing logged — set everything to zero and return
//       setTime(0);
//       setFinal(prev => ({ ...prev, finalTime: 0, interruptedTime: 0, totalSessionTime: 0, sessionStart: null, sessionEnd: null }));
//       return {
//         finalTime: 0,
//         interruptedTime: 0,
//         totalSessionTime: 0,
//         sessionStart: null,
//         sessionEnd: null
//       };
//     }

//     // Ensure ascending order by timestamp (oldest first)
//     logs.sort((a, b) => new Date(a.ts) - new Date(b.ts));

//     const eventTypesStart = new Set([
//       'fullscreen_exit',    // user left fullscreen
//       'app_switch',         // user switched apps
//       'tab_switch_exit',    // custom event you emitted when tab switched out
//       'visibility_hidden'   // page became hidden
//       // add other start event types here
//     ]);

//     const eventTypesEnd = new Set([
//       'visibility_shown'    // page became visible again
//       // add other end event types here (e.g., 'fullscreen_enter' if you log it)
//     ]);

//     // session start / end
//     const sessionStart = opts.sessionStart ? new Date(opts.sessionStart) : new Date(logs[0].ts);
//     const sessionEnd = opts.sessionEnd ? new Date(opts.sessionEnd) : new Date(logs[logs.length - 1].ts);

//     let interruptedMs = 0;
//     let currentStart = null; // Date when interruption started
//     for (const ev of logs) {
//       const evTime = new Date(ev.ts);

//       if (eventTypesStart.has(ev.type)) {
//         // start an interrupt only if not currently in one
//         if (!currentStart) currentStart = evTime;
//         // if already in interruption, ignore duplicate starts
//       } else if (eventTypesEnd.has(ev.type)) {
//         // if we are in an interrupt, close it
//         if (currentStart) {
//           // clamp: end cannot be earlier than start
//           const endTime = evTime > currentStart ? evTime : currentStart;
//           interruptedMs += endTime - currentStart;
//           currentStart = null;
//         }
//         // else - a visibility_shown without prior recorded start: ignore
//       } else {
//         // other events we ignore for interval calculation (but you can add logic)
//       }
//     }

//     // if still in interruption after iterating, close it at sessionEnd (or now)
//     if (currentStart) {
//       const endTime = sessionEnd > currentStart ? sessionEnd : currentStart;
//       interruptedMs += endTime - currentStart;
//       currentStart = null;
//     }

//     const totalSessionMs = sessionEnd - sessionStart;
//     // avoid negative values (in case logs are weird)
//     const totalSessionMsSafe = totalSessionMs > 0 ? totalSessionMs : 0;
//     const interruptedMsSafe = interruptedMs > totalSessionMsSafe ? totalSessionMsSafe : interruptedMs;

//     const activeMs = totalSessionMsSafe - interruptedMsSafe;
//     const activeSeconds = Math.round(activeMs / 1000 * 1000) / 1000; // keep ms precision -> seconds (3 dec)
//     const interruptedSeconds = Math.round(interruptedMsSafe / 1000 * 1000) / 1000;
//     const totalSessionSeconds = Math.round(totalSessionMsSafe / 1000 * 1000) / 1000;

//     // Update provided time and final state
//     setTime(activeSeconds);
//     setFinal(prev => ({
//       ...prev,
//       finalTime: activeSeconds,
//       interruptedTime: interruptedSeconds,
//       totalSessionTime: totalSessionSeconds,
//       sessionStart: sessionStart.toISOString(),
//       sessionEnd: sessionEnd.toISOString()
//     }));

//     return {
//       finalTime: activeSeconds,
//       interruptedTime: interruptedSeconds,
//       totalSessionTime: totalSessionSeconds,
//       sessionStart: sessionStart.toISOString(),
//       sessionEnd: sessionEnd.toISOString()
//     };
//   };

//   return (
//     <MainContext.Provider
//       value={{
//         final, setFinal,
//         currentQuestion, setcurrentQuestion,
//         testDetail, setTestDetails,
//         TestActive, setTestActive,
//         time, setTime,

//         // violations
//         violationsLog,
//         violationsCount,
//         logViolation,
//         resetViolations,

//         // exported helper
//         computeFinalTime
//       }}
//     >
//       {children}
//     </MainContext.Provider>
//   );
// };

// export const useMainContext = () => useContext(MainContext);
import { createContext, useContext, useState } from "react";

const MainContext = createContext();

export const ContextProvider = ({ children }) => {
  const [currentQuestion, setcurrentQuestion] = useState([]);
  const [testDetail, setTestDetails] = useState({});
  const [TestActive, setTestActive] = useState({});
  const [final, setFinal] = useState({});
  const [time, setTime] = useState(0);

  const [violationsLog, setViolationsLog] = useState([]);
  const [violationsCount, setViolationsCount] = useState({});
  const [activeIntervals, setActiveIntervals] = useState({});

  // Enhanced violation logger with interval tracking
  const logViolation = (type, details = {}, phase = null) => {
    const ts = new Date().toISOString();
    setViolationsCount((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));

    // Start phase
    if (phase === "start") {
      setActiveIntervals((prev) => ({
        ...prev,
        [type]: { start: ts },
      }));
      setViolationsLog((prev) => [
        { type, phase: "start", ts, details },
        ...prev,
      ]);
    }
    // End phase
    else if (phase === "end") {
      const active = activeIntervals[type];
      const startTs = active?.start ? new Date(active.start) : new Date(ts);
      const endTs = new Date(ts);
      const durationSec = Math.round((endTs - startTs) / 1000);

      setViolationsLog((prev) => [
        { type, phase: "end", ts, duration: durationSec, details },
        ...prev,
      ]);

      // Remove from active
      setActiveIntervals((prev) => {
        const copy = { ...prev };
        delete copy[type];
        return copy;
      });
    }
    // Normal events
    else {
      setViolationsLog((prev) => [{ type, ts, details }, ...prev]);
    }
  };

  const resetViolations = () => {
    setViolationsLog([]);
    setViolationsCount({});
    setActiveIntervals({});
  };

  // Compute active time summary
  const computeFinalTime = () => {
    const logs = [...violationsLog];
    if (!logs.length) {
      setTime(0);
      setFinal({
        finalTime: 0,
        interruptedTime: 0,
        totalSessionTime: 0,
        sessionStart: null,
        sessionEnd: null,
      });
      return;
    }

    const startEvents = logs.filter((l) => l.phase === "start");
    const endEvents = logs.filter((l) => l.phase === "end");

    let interrupted = 0;
    for (const start of startEvents) {
      const end = endEvents.find(
        (e) => e.type === start.type && new Date(e.ts) > new Date(start.ts)
      );
      if (end) {
        interrupted += end.duration || 0;
      }
    }

    logs.sort((a, b) => new Date(a.ts) - new Date(b.ts));
    const sessionStart = new Date(logs[0].ts);
    const sessionEnd = new Date(logs[logs.length - 1].ts);
    const totalSession = Math.max((sessionEnd - sessionStart) / 1000, 0);
    const activeTime = Math.max(totalSession - interrupted, 0);

    setTime(activeTime);
    setFinal({
      finalTime: activeTime,
      interruptedTime: interrupted,
      totalSessionTime: totalSession,
      sessionStart: sessionStart.toISOString(),
      sessionEnd: sessionEnd.toISOString(),
    });
  };

  return (
    <MainContext.Provider
      value={{
        final,
        setFinal,
        currentQuestion,
        setcurrentQuestion,
        testDetail,
        setTestDetails,
        TestActive,
        setTestActive,
        time,
        setTime,
        violationsLog,
        violationsCount,
        logViolation,
        resetViolations,
        computeFinalTime,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
