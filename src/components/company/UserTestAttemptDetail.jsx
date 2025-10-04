// src/pages/UserTestAttemptDetail.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./ProctoringResults.css";

/* =========================
   Helper utilities
   ========================= */
function toReadableTime(numOrStr) {
  const s = String(numOrStr ?? "");
  if (s.length < 12) return s || "—";
  const y = +s.slice(0,4), m = +s.slice(4,6)-1, d = +s.slice(6,8), hh = +s.slice(8,10), mm = +s.slice(10,12);
  const dt = new Date(Date.UTC(y,m,d,hh,mm));
  return dt.toLocaleString(undefined, { year:"numeric", month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit" });
}
function severity(score) {
  if (score >= 70) return { label: "HIGH", cls: "bad" };
  if (score >= 30) return { label: "MEDIUM", cls: "warn" };
  return { label: "LOW", cls: "ok" };
}
function percent(value, max) { const p = Math.max(0, Math.min(100, Math.round((value/max)*100))); return p; }
function readStatus(val, key="status", fallback="—") {
  if (val == null) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val[key] != null) return String(val[key]);
    if (val.message != null) return String(val.message);
    if (val.gaze_status != null) return String(val.gaze_status);
    if (val.liveness_status != null) return String(val.liveness_status);
  }
  return fallback;
}
function readNumber(val, key, fallback=0) {
  if (val == null) return fallback;
  if (typeof val === "number") return val;
  if (typeof val === "object" && typeof val[key] === "number") return val[key];
  return fallback;
}
function flattenDeviceDetection(node) {
  if (!node) return [];
  const inner = node.device_detection ?? node;
  if (Array.isArray(inner)) return inner;
  if (typeof inner === "string") return [inner];
  if (typeof inner === "object") {
    return Object.entries(inner).map(([k,v]) => `${k}: ${v}`);
  }
  return [];
}
function uniqBy(arr, key) {
  const seen = new Set(); const out = [];
  for (const it of arr || []) {
    const v = it?.[key];
    if (v == null) continue;
    if (seen.has(v)) continue;
    seen.add(v); out.push(it);
  }
  return out;
}
function toPct(x) { return `${Math.round((x ?? 0) * 100)}%`; }

function getImagePairs(rec) {
  const list = Array.isArray(rec?.images) ? rec.images : [];
  const out = [];
  if (list.length) {
    list.forEach((it, idx) => {
      if (!it?.image) return;
      out.push({
        isPhone: !!it.isPhone,
        src: `data:image/jpeg;base64,${it.image}`,
        filename: `record-${rec?.time ?? "t"}-${it.isPhone ? "phone" : "laptop"}-${idx+1}.jpg`,
      });
    });
  } else {
    if (rec?.phone?.image) {
      out.push({ isPhone: true, src: `data:image/jpeg;base64,${rec.phone.image}`, filename: `record-${rec?.time ?? "t"}-phone.jpg` });
    }
    if (rec?.laptop?.image) {
      out.push({ isPhone: false, src: `data:image/jpeg;base64,${rec.laptop.image}`, filename: `record-${rec?.time ?? "t"}-laptop.jpg` });
    }
  }
  return out;
}
function downloadDataUrl(dataUrl, filename="image.jpg") {
  try {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.remove();
  } catch {}
}

/* =========================
   Small components
   ========================= */
function Badge({ tone="default", children, title }) {
  return <span title={title} className={`badge ${tone}`}>{children}</span>;
}
function Pill({ tone="default", children }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
function Chip({ tone, children }) {
  return <span className={`chip ${tone || ""}`}>{children}</span>;
}
function Progress({ value }) {
  return (
    <div className="progress" aria-label="Average risk meter">
      <span style={{ width: `${percent(value, 100)}%` }} />
    </div>
  );
}
function Skeleton({ lines=3 }) {
  return (
    <div className="skeleton">
      {Array.from({ length: lines }).map((_,i)=><div key={i} className="skeleton-line" />)}
    </div>
  );
}
function Toggle({ checked, onChange, label, id }) {
  return (
    <label className="switch" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span className="slider" />
      <span className="switch-label">{label}</span>
    </label>
  );
}

/* =========================
   Lightbox for images
   ========================= */
function Lightbox({ open, src, alt, onClose, filename }) {
  const ref = useRef(null);
  useEffect(() => {
    function onKey(e){ if (e.key === "Escape") onClose?.(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal" onClick={e=>e.stopPropagation()} ref={ref}>
        <div className="modal-head">
          <div className="modal-title">{filename || alt || "Image"}</div>
          <div className="modal-actions">
            {src && <a href={src} className="button subtle" target="_blank" rel="noreferrer">Open</a>}
            {src && <button className="button" onClick={()=>downloadDataUrl(src, filename || "image.jpg")}>Download</button>}
            <button className="icon-close" aria-label="Close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="modal-body">
          <img className="lightbox-img" src={src} alt={alt || ""} />
        </div>
      </div>
    </div>
  );
}

/* =========================
   Main - merged into Page2 route
   ========================= */
export default function UserTestAttemptDetail() {
  const params = useParams();
  // seed initial userId/testId from route params if present (strings) — allow editing
  const seedUserId = params?.userId ? Number(params.userId) : 5;
  const seedTestId = params?.testId ? Number(params.testId) : 6;

  const [userId, setUserId] = useState(seedUserId);
  const [testId, setTestId] = useState(seedTestId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null);

  const [riskFilter, setRiskFilter] = useState(0);
  const [showOnlyViolations, setShowOnlyViolations] = useState(false);
  const [sortKey, setSortKey] = useState("time_desc");

  const [lightbox, setLightbox] = useState({ open:false, src:"", alt:"", filename:"" });

  const totalRisk = payload?.total_risk_score ?? 0;
  const count = payload?.data?.length ?? 0;
  const avgRisk = count ? Math.round(totalRisk / count) : 0;
  const sev = severity(avgRisk);

  async function fetchData(e) {
    e?.preventDefault?.();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/process-matched-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId), test_id: Number(testId) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && data.data && typeof data.data === "string") {
        try { data.data = JSON.parse(data.data); } catch {}
      }

      setPayload(data);
    } catch (err) {
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const violationTally = useMemo(() => {
    const v = { violations: 0, devices: 0, multiFace: 0 };
    if (!payload?.data) return v;
    payload.data.forEach(r => {
      const hasPersonViolation = r?.phone?.person?.status === "violation";
      const hasDeviceViolation = r?.laptop?.electronic_devices?.status === "violation";
      const hasMultiFaceViolation = r?.laptop?.multiple_faces?.multiple_faces !== "One Face Detected" && r?.laptop?.multiple_faces?.multiple_faces !== "—";
      
      if (r?.violation || hasPersonViolation || hasDeviceViolation || hasMultiFaceViolation) {
        v.violations++;
      }
      
      if (hasPersonViolation) v.multiFace++;
      if (hasMultiFaceViolation) v.multiFace++;
      if (hasDeviceViolation) v.devices++;
    });
    return v;
  }, [payload]);

  const records = useMemo(() => {
    let list = Array.isArray(payload?.data) ? [...payload.data] : [];
    list = list.filter(rec => {
      const rs = Number(rec?.overall_risk_score ?? 0);
      if (rs < riskFilter) return false;
      if (showOnlyViolations && !rec?.violation) return false;
      return true;
    });
    list.sort((a,b) => {
      if (sortKey === "risk_desc") return (Number(b?.overall_risk_score ?? 0) - Number(a?.overall_risk_score ?? 0));
      if (sortKey === "risk_asc") return (Number(a?.overall_risk_score ?? 0) - Number(b?.overall_risk_score ?? 0));
      const ta = +(a?.time ?? 0), tb = +(b?.time ?? 0);
      return tb - ta;
    });
    return list;
  }, [payload, riskFilter, showOnlyViolations, sortKey]);

  const toastRef = useRef(null);
  useEffect(() => {
    if (error) toastRef.current?.focus?.();
  }, [error]);

  return (
    <div className="proctoring">
      <div className="card header">
        <div className="header-row">
          <div>
            <div className="h1">Proctoring Risk Dashboard</div>
            <div className="meta">Fetch and review matched laptop/phone records with image context.</div>
          </div>
          <form className="form" onSubmit={fetchData}>
            <input className="input" type="number" min="1" value={userId} onChange={e=>setUserId(e.target.value)} placeholder="User ID" aria-label="User ID" />
            <input className="input" type="number" min="1" value={testId} onChange={e=>setTestId(e.target.value)} placeholder="Test ID" aria-label="Test ID" />
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Processing…" : "Process Data"}
            </button>
          </form>
        </div>

        <div className="grid">
          <div className="card summary">
            <div className={`badge ${sev.cls}`}>
              <span>Average Risk: {avgRisk}</span>
              <span className="pill small">Level: {sev.label}</span>
            </div>
            <Progress value={avgRisk} />
            <div className="kv">
              <div className="item">
                <div className="label">Records</div>
                <div className="value">{count}</div>
              </div>
              <div className="item">
                <div className="label">Total Risk Score</div>
                <div className="value">{totalRisk}</div>
              </div>
              <div className="item" title={payload?.message || "-"}>
                <div className="label">Message</div>
                <div className="value ellipsis">
                  {payload?.message || "-"}
                </div>
              </div>
              <div className="item">
                <div className="label">Violations</div>
                <div className="value">
                  {violationTally.violations}{" "}
                  <span className="small">({violationTally.multiFace} multi-face, {violationTally.devices} devices)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card summary">
            <div className="section-title">Controls</div>
            <div className="toolbar">
              <div className="toolbar-group">
                <label className="label" htmlFor="riskRange">Min Risk</label>
                <input id="riskRange" className="range" type="range" min="0" max="100" value={riskFilter} onChange={e=>setRiskFilter(Number(e.target.value))} />
                <div className="range-value">{riskFilter}</div>
              </div>
              <div className="toolbar-group">
                <label className="label" htmlFor="sort">Sort</label>
                <select id="sort" className="input" value={sortKey} onChange={e=>setSortKey(e.target.value)}>
                  <option value="time_desc">Newest first</option>
                  <option value="risk_desc">Risk: high → low</option>
                  <option value="risk_asc">Risk: low → high</option>
                </select>
              </div>
              <Toggle id="onlyViolations" checked={showOnlyViolations} onChange={setShowOnlyViolations} label="Only violations" />
            </div>

            <div className="section-title">API Status</div>
            <div className="tags" style={{marginBottom:8}}>
              <Badge tone={payload?.result ? "ok" : payload ? "warn" : ""}>
                Result: {String(payload?.result ?? "—")}
              </Badge>
              {payload?.error && <Badge tone="bad">Error: {String(payload.error)}</Badge>}
              {!payload && !loading && <Badge>Idle</Badge>}
            </div>
            <div className="section-title">Tips</div>
            <ul className="small ul">
              <li>Backend now returns <code>electronic_devices.others[{`{label, score, label_id}`}]</code> and <code>detections[{`{bbox, label, score}`}]</code>. The UI maps <strong>label_id → label</strong> below.</li>
              <li>Click any frame to open a zoomed viewer. Use the Open/Download buttons for evidence export.</li>
            </ul>
          </div>
        </div>
      </div>

      {loading && (
        <div className="card loader">
          <Skeleton lines={4} />
          <div className="small">Processing matched data…</div>
        </div>
      )}

      {error && (
        <div className="toast bad" role="alert" tabIndex={-1} ref={toastRef}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (!payload || !Array.isArray(payload?.data) || payload.data.length === 0) && (
        <div className="card empty" style={{ marginTop: 16 }}>
          Submit the form above to process matched data. Results will appear here.
        </div>
      )}

      {records.length > 0 && (
        <div className="card" style={{ marginTop: 16, padding: 16 }}>
          <div className="rec-head">
            <div className="section-title">Matched Records</div>
            <div className="small muted">{records.length} shown {records.length !== count ? `(filtered from ${count})` : ""}</div>
          </div>

          <div className="rec-list">
            {records.map((rec, idx) => {
              const others = Array.isArray(rec?.laptop?.electronic_devices?.others) ? rec.laptop.electronic_devices.others : [];
              const labelLegend = uniqBy(others, "label_id").map(o => ({ id: o.label_id, label: o.label }));
              const detections = Array.isArray(rec?.laptop?.electronic_devices?.detections) ? rec.laptop.electronic_devices.detections : [];
              const sevRec = severity(Number(rec?.overall_risk_score ?? 0));
              const frames = getImagePairs(rec);

              const deviceCounts = { ...(rec?.laptop?.electronic_devices?.counts ?? {}) };
              if (rec?.phone?.person?.status === "violation") {
                  deviceCounts["Multi-Person (Phone)"] = 1; 
              }

              return (
                <div className="rec" key={idx}>
                  <div className="thumb-col">
                    {frames.length ? (
                      <div className="gallery">
                        {frames.map((f, fi) => (
                          <button
                            type="button"
                            className="thumb"
                            key={fi}
                            onClick={() => setLightbox({ open:true, src:f.src, alt:`${f.isPhone ? "Phone" : "Laptop"} frame ${idx+1}-${fi+1}`, filename:f.filename })}
                            aria-label={`Open ${f.isPhone ? "phone" : "laptop"} frame ${fi+1}`}
                          >
                            <img className="thumb-img" src={f.src} alt={`${f.isPhone ? "Phone" : "Laptop"} frame ${idx+1}-${fi+1}`} loading="lazy" />
                            <div className={`label-tape ${f.isPhone ? "label-phone" : "label-laptop"}`}>
                              {f.isPhone ? "PHONE" : "LAPTOP"}
                            </div>
                            <div className="overlay">
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={(e)=>{ e.stopPropagation(); downloadDataUrl(f.src, f.filename); }}
                              >
                                Download
                              </button>
                              <a
                                className="icon-btn"
                                href={f.src}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e)=>e.stopPropagation()}
                              >
                                Open
                              </a>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="thumb empty-thumb"><div className="small">No image</div></div>
                    )}
                  </div>

                  <div className="rec-details-content">
                    <div className="header-row rec-header">
                      <div className="rec-badges">
                        <Badge tone={sevRec.cls}>Risk: {rec?.overall_risk_score ?? 0}</Badge>
                        {rec?.violation ? <Pill tone="bad">Violation</Pill> : <Pill tone="ok">Clear</Pill>}
                        <Pill tone="warn">Task #{rec?.task_id ?? "-"}</Pill>
                        <Pill>{toReadableTime(rec?.time)}</Pill>
                      </div>
                      <div className="small">User #{rec?.userId ?? "-"}</div>
                    </div>

                    <div className="device-details-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginTop: '10px',
                    }}>
                      
                      <div className="device-card phone-data" style={{border: '1px solid #ddd', padding: '10px', borderRadius: '4px'}}>
                        <div className="section-title">📱 Phone Data (Person & Activity)</div>
                        <div className="tags" style={{marginBottom:10}}>
                          <Chip tone={rec?.phone?.person?.status === "violation" ? "bad" : ""}>
                            Person Status: {rec?.phone?.person?.message ?? rec?.phone?.person?.status ?? "—"}
                          </Chip>
                          <Chip>Liveness: {readStatus(rec?.phone?.liveness_detection, "liveness_status")}</Chip>
                        </div>

                        <div className="section-title small">Activity Inference</div>
                        <table className="table" role="grid" aria-label="Phone Activity inference">
                          <thead>
                            <tr><th>Activity</th><th>Status</th><th>Confidence</th></tr>
                          </thead>
                          <tbody>
                            <tr><td>Sitting</td><td>{String(!!rec?.phone?.activity?.sitting)}</td><td>{rec?.phone?.activity?.sitting_confidence ?? 0}%</td></tr>
                            <tr><td>Standing</td><td>{String(!!rec?.phone?.activity?.standing)}</td><td>{rec?.phone?.activity?.standing_confidence ?? 0}%</td></tr>
                            <tr><td>Writing/Typing</td><td>{String(!!rec?.phone?.activity?.writing_typing)}</td><td>{rec?.phone?.activity?.writing_typing_confidence ?? 0}%</td></tr>
                            <tr><td>Looking at Screen</td><td>{String(!!rec?.phone?.activity?.looking_at_screen)}</td><td>{rec?.phone?.activity?.looking_at_screen_confidence ?? 0}%</td></tr>
                            <tr><td>Other Action</td><td>{String(!!rec?.phone?.activity?.other_action)}</td><td>{rec?.phone?.activity?.other_action_confidence ?? 0}%</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="device-card laptop-data" style={{border: '1px solid #ddd', padding: '10px', borderRadius: '4px'}}>
                        <div className="section-title">💻 Laptop Data (Detection & Identity)</div>
                        <div className="tags" style={{marginBottom:10}}>
                          <Chip tone={rec?.laptop?.multiple_faces?.multiple_faces !== "One Face Detected" && rec?.laptop?.multiple_faces?.multiple_faces !== "—" ? "bad" : ""}>
                            Multi-Face: {rec?.laptop?.multiple_faces?.multiple_faces ?? "—"}
                          </Chip>
                          <Chip>Face: {readStatus(rec?.laptop?.face_detection)}</Chip>
                          <Chip>Gaze: {readStatus(rec?.laptop?.gaze_detection, "gaze_status")}</Chip>
                          <Chip>Identity: {readStatus(rec?.laptop?.identity_verification, "identity_status")} ({toPct(readNumber(rec?.laptop?.identity_verification, "similarity", 0))})</Chip>
                          <Chip tone={rec?.laptop?.electronic_devices?.status === "violation" ? "bad" : ""}>
                            Devices: {rec?.laptop?.electronic_devices?.message ?? rec?.laptop?.electronic_devices?.status ?? "—"}
                          </Chip>
                        </div>

                        {(() => {
                          const devs = flattenDeviceDetection(rec?.laptop?.device_detection);
                          if (devs.length === 0) return null;
                          return (
                            <>
                              <hr className="hr" />
                              <div className="section-title small">Device Detection (raw)</div>
                              <div className="tags">
                                {devs.map((d,i) => (<span key={i} className="chip">{String(d)}</span>))}
                              </div>
                            </>
                          );
                        })()}
                        
                        {(() => {
                          if (labelLegend.length === 0) return null;
                          return (
                            <>
                              <hr className="hr" />
                              <div className="section-title small">Label Legend (Mappings)</div>
                              <div className="legend" style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                                {labelLegend.map((o) => (
                                  <div key={o.id} className="legend-item" style={{border: '1px dotted #ccc', padding: '5px', borderRadius: '3px', fontSize: '0.8em'}}>
                                    <div><strong>ID:</strong> {o.id}</div>
                                    <div><strong>Label:</strong> {o.label}</div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}

                        {detections.length > 0 && (
                          <>
                            <hr className="hr" />
                            <div className="section-title small">Detected Objects (Analysis)</div>
                            <table className="table" role="grid" aria-label="Detected objects">
                              <thead>
                                <tr><th>#</th><th>Label</th><th>Confidence</th><th>Bounding Box</th></tr>
                              </thead>
                              <tbody>
                                {detections.map((d, i) => (
                                  <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{d?.label ?? "—"}</td>
                                    <td>{toPct(d?.score ?? 0)}</td>
                                    <td className="small">{Array.isArray(d?.bbox) ? d.bbox.map(n=>Math.round(n)).join(", ") : "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {(Object.keys(deviceCounts).length > 0) && (
                              <div className="tags" style={{marginTop:8}}>
                                <div className="section-title small">Detection Counts (incl. Phone Person)</div>
                                {Object.entries(deviceCounts).map(([k,v]) => (
                                  <span key={k} className="chip">{k}: {v}</span>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Lightbox
        open={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        filename={lightbox.filename}
        onClose={() => setLightbox({ open:false, src:"", alt:"", filename:"" })}
      />
    </div>
  );
}
