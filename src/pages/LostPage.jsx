import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LostForm from "../components/Lostform";
import MatchResults from "../components/MatchResults";
import { matchItems } from "../ai/match";
import { getOpenFound } from "../firebase/getOpenFound";
import { addLostItem } from "../firebase/lost";
import { resolveCase } from "../firebase/resolveCase";
// 1. Auth import karein
import { auth } from "../firebase/config";

export default function LostPage({ refresh }) {
  const [matches, setMatches] = useState([]);
  const [activeData, setActiveData] = useState(null);
  const navigate = useNavigate();

  const handleCheck = async (data) => {
    // 2. Login check lagao
    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ Bhai, pehle Google Login toh kar lo! Bina login ke data add nahi hoga.");
      return;
    }

    const foundList = await getOpenFound();
    const aiMatches = matchItems(data, foundList);
    setActiveData(data);
    setMatches(aiMatches);
  };

  const confirmMatch = async (matchedItem) => {
    try {
      // Safety check double confirm karne ke liye
      if (!auth.currentUser) return alert("Session expired. Please login again.");

      const { imageFile, ...dataWithoutFile } = activeData;
      const saved = await addLostItem(dataWithoutFile, imageFile);
      await resolveCase(saved.id, matchedItem.id);
      alert("🎉 Case Solved successfully!");
      refresh();
      navigate("/");
    } catch (e) {
      alert("Error resolving match.");
    }
  };

  const finalSubmit = async () => {
    if (!auth.currentUser) return alert("Please login first.");

    const { imageFile, ...dataWithoutFile } = activeData;
    await addLostItem(dataWithoutFile, imageFile);
    alert("Added to Pending Lost Reports.");
    refresh();
    navigate("/");
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <div className="form-page-container">
          <h2 className="page-title">Report Lost Item</h2>

          {/* Form ko check karne se pehle dikhao, par submit par alert aayega */}
          <LostForm onSubmit={handleCheck} />

          {activeData && (
            <div className="ai-suggestion-area">
              <MatchResults
                matches={matches}
                onConfirm={confirmMatch}
                onNoUser={finalSubmit}
                type="LOST"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}