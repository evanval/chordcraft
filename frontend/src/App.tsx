import React, { useState } from "react";
import "./App.css";

const ChordCraft = () => {
  const [mood, setMood] = useState("happy");
  const [genre, setGenre] = useState("pop");
  const [key, setKey] = useState("");
  const [tempo, setTempo] = useState("");
  const [progression, setProgression] = useState<string[]>([]);
  const [theory, setTheory] = useState("");

  const moods = ["happy", "melancholic", "intense"];
  const genres = ["pop", "jazz", "classical"];
  const keys = ["C Major", "G Major", "A Minor", "None"];

  const generateProgression = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          genre,
          key: key || "None",
          tempo: tempo || "120",
        }),
      });
      const data = await response.json();
      setProgression(data.chords);
      setTheory(data.theory);
    } catch (error) {
      console.error("Error fetching progression:", error);
      setTheory("Failed to generate progression. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ChordCraft</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {moods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Key (Optional)
          </label>
          <select
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {keys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Tempo (Optional, BPM)
          </label>
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            placeholder="e.g., 120"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={generateProgression}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
        >
          Generate Progression
        </button>
        {progression.length > 0 && (
          <div>
            <p className="mb-2">Progression: {progression.join(" -> ")}</p>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Theory Explanation</h2>
              <p className="text-sm">{theory}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordCraft;
