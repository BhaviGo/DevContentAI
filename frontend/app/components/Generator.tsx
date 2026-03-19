"use client";

import { useState } from "react";
import axios from "axios";

export default function Generator() {
  const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!");
};

  // ✅ 1. STATE (ADD HERE - TOP)
  const [url, setUrl] = useState("");
  const [thread, setThread] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [activeTab, setActiveTab] = useState("thread");
  const [loading, setLoading] = useState(false);

  // ✅ ADD THESE (checkbox states)
  const [threadSelected, setThreadSelected] = useState(true);
  const [linkedinSelected, setLinkedinSelected] = useState(true);

  // ✅ 2. GENERATE FUNCTION (MODIFY THIS)
  const generate = async () => {

    // ✅ Prevent empty selection
    if (!threadSelected && !linkedinSelected) {
      alert("Please select at least one option");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/generate-content`,
        null,
        {
          params: {
            url,
            generate_thread_flag: threadSelected,
            generate_linkedin_flag: linkedinSelected,
          },
        }
      );

      // ✅ Update outputs
      setThread(res.data.thread || "");
      setLinkedin(res.data.linkedin || "");

    } catch {
      setThread("Error generating content");
    }

    setLoading(false);
  };

  return (
    <div className="mt-10 max-w-2xl mx-auto p-6">

      {/* ✅ INPUT CARD */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-2xl">

        {/* URL INPUT */}
        <input
          className="w-full p-4 rounded-lg bg-gray-800 mb-4 outline-none"
          placeholder="Paste YouTube link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* ✅ 3. ADD CHECKBOXES HERE (BELOW INPUT) */}
        <div className="flex gap-4 mb-4">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={threadSelected}
              onChange={() => setThreadSelected(!threadSelected)}
            />
            Twitter Thread
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={linkedinSelected}
              onChange={() => setLinkedinSelected(!linkedinSelected)}
            />
            LinkedIn Post
          </label>

        </div>

        {/* GENERATE BUTTON */}
        <button
          disabled={!url || loading}
          onClick={generate}
          className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>

      </div>
    {(thread || linkedin) && (
  <div className="flex gap-4 mt-6 justify-center">

    <button
      onClick={() => setActiveTab("thread")}
      className={`px-4 py-2 rounded-lg ${
        activeTab === "thread" ? "bg-blue-600" : "bg-gray-700"
      }`}
    >
      Thread
    </button>

    <button
      onClick={() => setActiveTab("linkedin")}
      className={`px-4 py-2 rounded-lg ${
        activeTab === "linkedin" ? "bg-blue-600" : "bg-gray-700"
      }`}
    >
      LinkedIn
    </button>

  </div>
)}
      {/* ✅ 4. OUTPUT SECTIONS (ADD BELOW) */}

      {/* THREAD VIEW */}
{activeTab === "thread" && thread && (
  <div className="bg-white/5 backdrop-blur-lg p-6 mt-6 rounded-2xl whitespace-pre-line shadow-[0_0_40px_rgba(59,130,246,0.2)]">

    <h2 className="text-lg font-bold mb-4">Twitter Thread</h2>

    <p>{thread}</p>

    <div className="flex gap-3 mt-4">

      <button
        onClick={() => copyToClipboard(thread)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
      >
        Copy Thread
      </button>

      <button
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(thread)}`
          )
        }
        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
      >
        Open in X
      </button>

    </div>

  </div>
)}

{/* LINKEDIN VIEW */}
{activeTab === "linkedin" && linkedin && (
  <div className="bg-white/5 backdrop-blur-lg p-6 mt-6 rounded-2xl whitespace-pre-line shadow-[0_0_40px_rgba(59,130,246,0.2)]">

    <h2 className="text-lg font-bold mb-4">LinkedIn Post</h2>

    <p>{linkedin}</p>

    <div className="flex gap-3 mt-4">

      <button
        onClick={() => copyToClipboard(linkedin)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
      >
        Copy LinkedIn
      </button>

      <button
        onClick={() => window.open("https://www.linkedin.com/feed/")}
        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
      >
        Open LinkedIn
      </button>

    </div>

  </div>
)}
    </div>
  );
}