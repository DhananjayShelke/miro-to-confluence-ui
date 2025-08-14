import React, { useState } from "react";

export default function MiroToConfluence() {
  const [boardId, setBoardId] = useState("");
  const [frameId, setFrameId] = useState("");
  const [pageTitle, setPageTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (!boardId) {
      alert("Please enter Miro Board ID");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/miro-to-confluence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId, frameId,pageTitle }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setMessage(`✅ Page created: ${data.confluencePageUrl}`);
    } catch (err) {
      setMessage(`❌ Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
        <h2>Miro → Confluence Page Generator</h2>
        <label>Miro Board ID:</label>
        <input
            type="text"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            placeholder="Enter Miro Board ID"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <label>Frame ID (optional):</label>
        <input
            type="text"
            value={frameId}
            onChange={(e) => setFrameId(e.target.value)}
            placeholder="Enter Frame ID"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <label>Confluence page title:</label>
        <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Enter confluence page title"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
        >
          {loading ? "Generating..." : "Generate Confluence Page"}
        </button>

        {message && <p style={{ marginTop: "20px" }}>{message}</p>}
      </div>
  );
}