// FinalRiskData.jsx
import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { UploadLogs, SaveErrorCounts } from "../../api/activity";

export default function FinalRiskData({
  activityLogs = null,
  errorSummary = null,
}) {
  const { testId } = useParams();
  const loggedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userId = loggedUser.userId ?? null;

  const defaultActivityLogs = [
    {
      type: "visibility_hidden",
      phase: "end",
      ts: "2025-10-04T18:42:54.246Z",
      duration: 0,
      details: null,
    },
    {
      type: "visibility_hidden",
      phase: "start",
      ts: "2025-10-04T18:42:54.243Z",
      duration: null,
      details: null,
    },
    {
      type: "fullscreen_exit",
      phase: null,
      ts: "2025-10-04T18:42:51.828Z",
      duration: null,
      details: null,
    },
    {
      type: "fullscreen_exit",
      phase: "start",
      ts: "2025-10-04T18:42:51.827Z",
      duration: null,
      details: null,
    },
    {
      type: "window_resize_small",
      phase: null,
      ts: "2025-10-04T18:42:51.735Z",
      duration: null,
      details: null,
    },
    {
      type: "fullscreen_exit",
      phase: "end",
      ts: "2025-10-04T18:42:49.677Z",
      duration: 4,
      details: null,
    },
    {
      type: "copy_paste_shortcut",
      phase: null,
      ts: "2025-10-04T18:42:49.528Z",
      duration: null,
      details: null,
    },
    {
      type: "fullscreen_exit",
      phase: null,
      ts: "2025-10-04T18:42:45.937Z",
      duration: null,
      details: null,
    },
    {
      type: "fullscreen_exit",
      phase: "start",
      ts: "2025-10-04T18:42:45.937Z",
      duration: null,
      details: null,
    },
    {
      type: "fullscreen_exit",
      phase: "end",
      ts: "2025-10-04T18:42:44.215Z",
      duration: 0,
      details: null,
    },
    {
      type: "window_resize_small",
      phase: null,
      ts: "2025-10-04T18:42:44.164Z",
      duration: null,
      details: null,
    },
  ];

  const defaultErrorSummary = [
    {
      userId: 3,
      testId: 3,
      details:
        '{"window_resize_small":2,"fullscreen_exit":6,"copy_paste_shortcut":1,"visibility_hidden":2}',
    },
  ];

  const logsToShow = activityLogs ?? defaultActivityLogs;
  const errorsToParse = errorSummary ?? defaultErrorSummary;

  // Parse event counts
  const parsedCounts = useMemo(() => {
    const merged = {};
    for (const entry of errorsToParse) {
      try {
        const obj = JSON.parse(entry.details);
        for (const [k, v] of Object.entries(obj)) {
          merged[k] = (merged[k] || 0) + Number(v || 0);
        }
      } catch {}
    }
    return merged;
  }, [errorsToParse]);

  // Risk = sum of counts * 15
  const riskScore = useMemo(() => {
    const total = Object.values(parsedCounts).reduce(
      (sum, n) => sum + Number(n || 0),
      0
    );
    return total * 15;
  }, [parsedCounts]);

  // Call APIs
  useEffect(() => {
    if (!userId || !testId) return;
    (async () => {
      try {
        await UploadLogs(userId, testId);
      } catch (err) {
        console.error("UploadLogs failed:", err);
      }
      try {
        await SaveErrorCounts(userId, testId);
      } catch (err) {
        console.error("SaveErrorCounts failed:", err);
      }
    })();
  }, [userId, testId]);

  return (
    <div className="min-h-screen bg-[#0B132B] text-gray-100 p-8 flex flex-col items-center font-inter">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-3xl font-semibold text-blue-300 mb-2 tracking-wide">
          Final Risk Data
        </h1>

        {/* Risk Summary */}
        <div className="bg-[#1C2541] border border-[#3A506B]/50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-medium text-blue-200 mb-3">
            Risk Summary
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-300 text-sm">
                Formula: (Sum of per event counts × Based on Weight of that Voilation)
              </p>
            </div>
            <div className="text-4xl font-bold text-blue-400">
              {riskScore}
            </div>
          </div>
        </div>

        {/* Event Counts */}
        <div className="bg-[#1C2541] border border-[#3A506B]/50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-medium text-blue-200 mb-3">
            Parsed Event Counts
          </h2>
          {Object.keys(parsedCounts).length ? (
            <ul className="divide-y divide-gray-700">
              {Object.entries(parsedCounts).map(([key, val]) => (
                <li
                  key={key}
                  className="flex justify-between py-2 text-gray-300"
                >
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="text-blue-300 font-semibold">{val}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No event data available.</p>
          )}
        </div>

        {/* Logs with Duration */}
        <div className="bg-[#1C2541] border border-[#3A506B]/50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-medium text-blue-200 mb-3">
            Raw Logs (with Duration)
          </h2>
          <div className="overflow-auto max-h-96">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="text-blue-300 border-b border-[#3A506B]/40">
                <tr>
                  <th className="py-2 px-3 font-medium">Type</th>
                  <th className="py-2 px-3 font-medium">Phase</th>
                  <th className="py-2 px-3 font-medium">Timestamp</th>
                  <th className="py-2 px-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {logsToShow.map((log, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#3A506B]/10 transition-colors border-b border-[#3A506B]/20"
                  >
                    <td className="py-2 px-3 text-gray-200">
                      {log.type || "—"}
                    </td>
                    <td className="py-2 px-3 text-gray-400">
                      {log.phase || "—"}
                    </td>
                    <td className="py-2 px-3 text-gray-400">
                      {new Date(log.ts).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-blue-300 font-medium">
                      {log.duration !== null && log.duration !== undefined
                        ? log.duration
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          Data synced with{" "}
          <span className="text-blue-400">UploadLogs</span> &{" "}
          <span className="text-blue-400">SaveErrorCounts</span> APIs.
        </div>
      </div>
    </div>
  );
}
