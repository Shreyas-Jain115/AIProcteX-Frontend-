// import React, { useState, useEffect } from "react";
// import {
//   useParams,
//   Link,
//   useNavigate,
//   useOutletContext,
// } from "react-router-dom";
// import {
//   FaListOl,
//   FaCheckCircle,
//   FaCode,
//   FaHourglassHalf,
//   FaQrcode,
//   FaTimes,
// } from "react-icons/fa";
// import { useMainContext } from "../../context/AuthContext";
// import { addSubmission } from "../../api/submission";
// import axios from "axios";
// import { UploadLogs,GetAllLogs ,SaveErrorCounts} from "../../api/activity";
// import { QRCodeCanvas } from "qrcode.react";

// const TestAttempt = () => {
//   const { testId } = useParams();
//   const navigate = useNavigate();
//   const {
//     currentQuestion,
//     final,
//     violationsLog,
//     violationsCount,
//     time,
//     resetViolations,
//   } = useMainContext();
//   const { stopProctor } = useOutletContext(); // <-- get the stopper from TestLayout
//   const problems = currentQuestion || [];
//   const durationMinutes =
//     Number(localStorage.getItem(`test_${testId}_duration`)) || 90;
//   const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

//   const getInitialStatuses = (problems) => {
//     const statuses = {};
//     for (const problem of problems) {
//       const storedStatus = localStorage.getItem(
//         `problem_${problem.question.problemId}_status`
//       );
//       statuses[problem.question.problemId] = storedStatus || "pending";
//     }
//     return statuses;
//   };

//   const [problemStatuses, setProblemStatuses] = useState(() =>
//     getInitialStatuses(problems)
//   );

//   // QR state
//   const [showQR, setShowQR] = useState(false);

//   // read userId for QR
//   const loggedUser = JSON.parse(localStorage.getItem("user")) || {};
//   const qrData = JSON.stringify({
//     userId: loggedUser.userId || "U001",
//     testId: String(testId || "T101"),
//   });

//   // TIMER
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           navigate("/student/history"); // auto redirect; proctor unmounts due to route change
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [navigate]);

//   // Listen for localStorage changes
//   useEffect(() => {
//     const handleStorageChange = () =>
//       setProblemStatuses(getInitialStatuses(problems));
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, [problems]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600)
//       .toString()
//       .padStart(2, "0");
//     const m = Math.floor((seconds % 3600) / 60)
//       .toString()
//       .padStart(2, "0");
//     const s = (seconds % 60).toString().padStart(2, "0");
//     return `${h}:${m}:${s}`;
//   };

//   // ---- FINISH & SUBMIT
//   async function HandleFinalSubmit() {
//     const LoggedUser = JSON.parse(localStorage.getItem("user"));
//     console.log("This is Voilation Count",violationsCount);
//     console.log(violationsLog);
//     const payload = {
//       userId: LoggedUser.userId,
//       testId: testId,
//       logs: violationsLog,
//     };
    
//     try {
//       let response = await UploadLogs(payload);
//       console.log("Logs Uploaded Succefully to Backend",response);
//       resetViolations();
//     } catch (e) {
//       console.log("Error Calling Upload LOGS", e);
//     }

//     const payload2 = {
//       userId: LoggedUser.userId,
//       testId: testId,
//       details: violationsCount,
//     };   

//     try {
//       let response = await SaveErrorCounts(payload2);
//       console.log("Error Count data From backend",response);
//       resetViolations();
//     } catch (e) {
//       console.log("Error Calling Error Count", e);
//     }

//     // try{
//     //   let response =await GetAllLogs(LoggedUser.userId,testId);
//     //   console.log("LOGS FROM BACKNEDD",response);
//     // }catch(e){
//     //   console.log("Error in fetching logs from backend", e);
//     // }
//     // console.log("Total time Voilation", time);

//     const { transcript } = (await stopProctor?.()) || { transcript: "" };
//     console.log("Final transcript:", transcript);
//     if (!LoggedUser) {
//       console.error("No logged-in user found");
//       return;
//     }

//     try {
//       // 1) stop background proctoring first
//       await stopProctor?.();

//       // 2) notify backend (Kafka producer)
//       // const form = new URLSearchParams();
//       // form.append("userId", String(LoggedUser.userId));
//       // form.append("testId", String(testId));
//       // await axios.post("http://localhost:8080/dummy/produce", form, {
//       //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       // });

//       // 3) submit result to your submissions API
//       // const totalScore = Object.values(final).reduce(
//       //   (sum, item) => sum + (item.score || 0),
//       //   0
//       // );
//       // const payload = {
//       //   username: LoggedUser.username,
//       //   test: { testId },
//       //   totalScore,
//       // };


//       // const response = await addSubmission(payload);

//       // console.log("✅ Kafka notified & submission saved:", response);

//       // 4) navigate away (proctor already stopped; layout unmount will also clean up)
//       navigate("/student/history");
//     } catch (err) {
//       console.error("Finish submit failed:", err);
//       // optional: show a toast and still navigate
//       navigate("/student/history");
//     }
//   }

//   const getStatusButton = (status, problemId) => {
//     switch (status) {
//       case "submitted":
//         return (
//           <button
//             disabled
//             className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-md font-semibold flex items-center gap-2"
//           >
//             <FaCheckCircle /> Submitted
//           </button>
//         );
//       case "attempted":
//         return (
//           <Link
//             to={`/student/attempt/${testId}/problem/${problemId}`}
//             className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1.5 rounded-md font-semibold flex items-center gap-2"
//           >
//             <FaHourglassHalf /> Re-attempt
//           </Link>
//         );
//       default:
//         return (
//           <Link
//             to={`/student/attempt/${testId}/problem/${problemId}`}
//             className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md font-semibold flex items-center gap-2"
//           >
//             <FaCode /> Solve Question
//           </Link>
//         );
//     }
//   };

//   return (
//     <div className="h-full flex flex-col relative">
//       <header className="flex-shrink-0 p-3 border-b border-slate-700 flex justify-between items-center">
//         <div>
//           <h1 className="text-xl font-bold text-white">Test in Progress</h1>
//           <p className="text-sm text-slate-400 flex items-center gap-2">
//             Attempting Test ID: <span className="font-semibold ml-1">{testId}</span>
//             {/* Small QR button beside the test id */}
//             <button
//               title="Show QR"
//               onClick={() => setShowQR(true)}
//               className="ml-2 bg-slate-700 hover:bg-slate-600 p-1 rounded text-sm text-white flex items-center gap-1"
//             >
//               <FaQrcode />
//             </button>
//           </p>
//           <p className="text-xs text-slate-400 mt-1">
//             User ID: {loggedUser.userId || "N/A"} | Test ID: {testId}
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-lg font-mono bg-slate-700 text-white py-1.5 px-3 rounded-lg">
//             {formatTime(timeLeft)}
//           </span>
//           <button
//             onClick={HandleFinalSubmit}
//             className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-1.5 px-4 rounded-lg text-sm"
//           >
//             Finish & Submit Test
//           </button>
//         </div>
//       </header>

//       <main className="flex-grow overflow-y-auto p-6">
//         <h2 className="text-2xl font-bold text-white mb-4">Problems</h2>
//         <div className="space-y-4">
//           {problems.map((problem, index) => (
//             <div
//               key={problem.question.problemId}
//               className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex justify-between items-center"
//             >
//               <div className="flex items-center gap-4">
//                 <span className="text-indigo-400 font-bold text-lg">{index + 1}</span>
//                 <h3 className="font-semibold text-white">{problem.question.title}</h3>
//               </div>
//               <div className="flex items-center gap-4">
//                 <span className="text-sm text-slate-400">{problem.points} points</span>
//                 {getStatusButton(
//                   problemStatuses[problem.question.problemId],
//                   problem.question.problemId
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* QR Modal / popup - small box near bottom-right */}
//       {showQR && (
//         <div className="fixed right-6 bottom-6 z-50 bg-slate-900/95 border border-slate-700 rounded-lg p-4 w-44 shadow-lg flex flex-col items-center gap-3">
//           <div className="w-full flex justify-between items-center">
//             <h4 className="text-sm font-semibold text-white">Test QR</h4>
//             <button
//               onClick={() => setShowQR(false)}
//               className="p-1 rounded hover:bg-slate-800 text-slate-300"
//               aria-label="Close QR"
//             >
//               <FaTimes />
//             </button>
//           </div>

//           <div className="bg-white p-2 rounded">
// <QRCodeCanvas value={qrData} size={128} />
//           </div>

//           <div className="text-xs text-slate-300 text-center break-words">{qrData}</div>

//           <button
//             onClick={() => setShowQR(false)}
//             className="mt-1 text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded"
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestAttempt;

import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import {
  FaListOl,
  FaCheckCircle,
  FaCode,
  FaHourglassHalf,
  FaQrcode,
  FaTimes,
} from "react-icons/fa";
import { useMainContext } from "../../context/AuthContext";
import { addSubmission } from "../../api/submission";
import axios from "axios";
import { UploadLogs, GetAllLogs, SaveErrorCounts } from "../../api/activity";
import { QRCodeCanvas } from "qrcode.react";

const TestAttempt = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const {
    currentQuestion,
    final,
    violationsLog,
    violationsCount,
    time,
    resetViolations,
  } = useMainContext();
  const { stopProctor } = useOutletContext(); // <-- get the stopper from TestLayout
  const problems = currentQuestion || [];
  const durationMinutes =
    Number(localStorage.getItem(`test_${testId}_duration`)) || 90;
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  const getInitialStatuses = (problems) => {
    const statuses = {};
    for (const problem of problems) {
      const storedStatus = localStorage.getItem(
        `problem_${problem.question.problemId}_status`
      );
      statuses[problem.question.problemId] = storedStatus || "pending";
    }
    return statuses;
  };

  const [problemStatuses, setProblemStatuses] = useState(() =>
    getInitialStatuses(problems)
  );

  // QR state
  const [showQR, setShowQR] = useState(false);

  // read userId for QR
  const loggedUser = JSON.parse(localStorage.getItem("user")) || {};
  const qrData = JSON.stringify({
    userId: loggedUser.userId || "U001",
    testId: String(testId || "T101"),
  });

  // TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/student/history"); // auto redirect; proctor unmounts due to route change
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () =>
      setProblemStatuses(getInitialStatuses(problems));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [problems]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // ---- FINISH & SUBMIT
  async function HandleFinalSubmit() {
    const LoggedUser = JSON.parse(localStorage.getItem("user"));
    console.log("This is Voilation Count", violationsCount);
    console.log(violationsLog);

    if (!LoggedUser) {
      console.error("No logged-in user found");
      return;
    }

    // Filter only required violation types
    const filteredLogs = violationsLog.filter((log) =>
      ["copy", "paste", "fullscreenexit", "app_switch"].includes(log.type)
    );

    const filteredCounts = {};
    for (const key of ["copy", "paste", "fullscreenexit", "app_switch"]) {
      filteredCounts[key] = violationsCount[key] || 0;
    }

    // Upload filtered logs
    try {
      const response = await UploadLogs({
        userId: LoggedUser.userId,
        testId,
        logs: filteredLogs,
      });
      console.log("Filtered logs uploaded:", response);
      resetViolations();
    } catch (e) {
      console.log("Error Calling Upload LOGS", e);
    }

    // Save filtered counts
    try {
      const response = await SaveErrorCounts({
        userId: LoggedUser.userId,
        testId,
        details: filteredCounts,
      });
      console.log("Error Count data From backend", response);
      resetViolations();
    } catch (e) {
      console.log("Error Calling Error Count", e);
    }

    const { transcript } = (await stopProctor?.()) || { transcript: "" };
    console.log("Final transcript:", transcript);

    try {
      // 1) stop background proctor first
      await stopProctor?.();

      // 2) notify backend (Kafka producer)
      const form = new URLSearchParams();
      form.append("userId", String(LoggedUser.userId));
      form.append("testId", String(testId));
      await axios.post("http://localhost:8080/dummy/produce", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // 3) submit result to your submissions API
      const totalScore = Object.values(final).reduce(
        (sum, item) => sum + (item.score || 0),
        0
      );
      const payload = {
        username: LoggedUser.username,
        test: { testId },
        totalScore,
      };


      // const response = await addSubmission(payload);

      console.log("✅ Kafka notified & submission saved:", response);

      // 4) navigate away (proctor already stopped; layout unmount will also clean up)
      navigate("/student/history");
    } catch (err) {
      console.error("Finish submit failed:", err);
      // optional: show a toast and still navigate
      navigate("/student/history");
    }
  }

  const getStatusButton = (status, problemId) => {
    switch (status) {
      case "submitted":
        return (
          <button
            disabled
            className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-md font-semibold flex items-center gap-2"
          >
            <FaCheckCircle /> Submitted
          </button>
        );
      case "attempted":
        return (
          <Link
            to={`/student/attempt/${testId}/problem/${problemId}`}
            className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1.5 rounded-md font-semibold flex items-center gap-2"
          >
            <FaHourglassHalf /> Re-attempt
          </Link>
        );
      default:
        return (
          <Link
            to={`/student/attempt/${testId}/problem/${problemId}`}
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md font-semibold flex items-center gap-2"
          >
            <FaCode /> Solve Question
          </Link>
        );
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <header className="flex-shrink-0 p-3 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Test in Progress</h1>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            Attempting Test ID: <span className="font-semibold ml-1">{testId}</span>
            {/* Small QR button beside the test id */}
            <button
              title="Show QR"
              onClick={() => setShowQR(true)}
              className="ml-2 bg-slate-700 hover:bg-slate-600 p-1 rounded text-sm text-white flex items-center gap-1"
            >
              <FaQrcode />
            </button>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            User ID: {loggedUser.userId || "N/A"} | Test ID: {testId}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-mono bg-slate-700 text-white py-1.5 px-3 rounded-lg">
            {formatTime(timeLeft)}
          </span>
          <button
            onClick={HandleFinalSubmit}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-1.5 px-4 rounded-lg text-sm"
          >
            Finish & Submit Test
          </button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Problems</h2>
        <div className="space-y-4">
          {problems.map((problem, index) => (
            <div
              key={problem.question.problemId}
              className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <span className="text-indigo-400 font-bold text-lg">{index + 1}</span>
                <h3 className="font-semibold text-white">{problem.question.title}</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">{problem.points} points</span>
                {getStatusButton(
                  problemStatuses[problem.question.problemId],
                  problem.question.problemId
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* QR Modal / popup - small box near bottom-right */}
      {showQR && (
        <div className="fixed right-6 bottom-6 z-50 bg-slate-900/95 border border-slate-700 rounded-lg p-4 w-44 shadow-lg flex flex-col items-center gap-3">
          <div className="w-full flex justify-between items-center">
            <h4 className="text-sm font-semibold text-white">Test QR</h4>
            <button
              onClick={() => setShowQR(false)}
              className="p-1 rounded hover:bg-slate-800 text-slate-300"
              aria-label="Close QR"
            >
              <FaTimes />
            </button>
          </div>

          <div className="bg-white p-2 rounded">
            <QRCodeCanvas value={qrData} size={128} />
          </div>

          <div className="text-xs text-slate-300 text-center break-words">{qrData}</div>

          <button
            onClick={() => setShowQR(false)}
            className="mt-1 text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TestAttempt;
