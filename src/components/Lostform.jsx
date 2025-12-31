import { useState } from "react";

import { analyzeImage } from "../ai/vision";

export default function LostForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "", description: "", location: "",
    ownerName: "", phone: ""
  });
  const [file, setFile] = useState(null);
  const [aiTags, setAiTags] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsAnalyzing(true);

      const img = document.createElement('img');
      img.src = URL.createObjectURL(selectedFile);
      img.onload = async () => {
        try {
          const tags = await analyzeImage(img);
          setAiTags(tags);
        } catch (err) {
          console.error("Analysis Error", err);
          setAiTags([]);
        } finally {
          setIsAnalyzing(false);
        }
      };
      img.onerror = () => setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some(v => !v)) {
      alert("Please fill all fields");
      return;
    }
    onSubmit({ ...form, imageFile: file, aiTags });
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      {Object.keys(form).map(k => (
        <input key={k}
          placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
          value={form[k]}
          onChange={e => setForm({ ...form, [k]: e.target.value })}
        />
      ))}

      <div className="file-input-container">
        <label>Upload Photo (Optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {isAnalyzing && <p className="analyzing-text">🤖 AI is analyzing image...</p>}
        {!isAnalyzing && aiTags.length > 0 && <p className="ai-tags">Detected: {aiTags.join(", ")}</p>}
        {!isAnalyzing && file && aiTags.length === 0 && <p className="no-tags-text">⚠️ AI couldn't identify the object clearly.</p>}
      </div>

      <button type="submit" className="btn-check-ai" disabled={isAnalyzing}>
        {isAnalyzing ? "Analyzing..." : "🔍 Check AI Suggestions"}
      </button>
    </form>
  );
}