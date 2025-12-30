import { useState } from "react";

export default function LostForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "", description: "", location: "",
    ownerName: "", phone: ""
  });
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some(v => !v)) {
      alert("Please fill all fields");
      return;
    }
    onSubmit({ ...form, imageFile: file });
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
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button type="submit" className="btn-check-ai">
        🔍 Check AI Suggestions
      </button>
    </form>
  );
}