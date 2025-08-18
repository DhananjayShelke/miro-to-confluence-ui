import React, { useState } from "react";

export default function MiroToConfluence() {
  const [boardUrl, setBoardUrl] = useState("");
  const [boardId, setBoardId] = useState("");
  const [frameTitles, setFrameTitles] = useState([]);
  const [frameId, setFrameId] = useState("");
  const [pageTitle, setPageTitle] = useState("");


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (!boardUrl) {
      alert("Please enter Miro Board ID");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const res = await fetch("http://localhost:8000/api/miro-to-confluence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({boardId,frameId,pageTitle})
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setMessage(`✅ Page created: ${data.pageUrl}`);
    } catch (err) {
      setMessage(`❌ Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  function extractBoardId(url) {
    const match = url.match(/board\/([^/]+)/);
    return match ? match[1] : null;
  }

  const handleUrl = (url) => {
      console.log(url)
      setBoardUrl(url)
      getAllFrames(url)
  };

  const getAllFrames = async (url) => {
     const boardNumber =  extractBoardId(url)
     setBoardId(boardNumber)
     const frameUrl =`https://api.miro.com/v2/boards/${boardId}/items?type=frame&limit=50`
     console.log(frameUrl)

  const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    authorization: 'Bearer eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_YrswjSzjrhRu5SJzQSvfaAPn8pk'
    }
  };


  fetch(frameUrl, options)
    .then(res => res.json())
    .then(res => setFrame(res.data))
    .catch(err => setMessage(`❌ Failed: ${err.message}`));
     
  }

  const setFrame = (data) => {
      let frameTitles = []
      for(const item of data){
          frameTitles.push({id: item.id, title:item.data.title})
      }
      console.log(frameTitles)
      setFrameTitles(frameTitles)
  }

  return (
      <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
        <h2>Miro → Confluence Page Generator</h2>
        <label>Miro URL:</label>
        <input
            type="text"
            value={boardUrl}
            onChange={(e) => handleUrl(e.target.value)}
            placeholder="Enter Miro Board URL"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <label>Frame ID (optional):</label>
        <select
                value={frameId}
                onChange={(e) => setFrameId(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              >
                <option value="">-- Choose a frame --</option>
                {frameTitles.map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.title}
                  </option>
                ))}
        </select>
        <label>Confluence Title :</label>
        <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="Enter Title for confluence page"
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