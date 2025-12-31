import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FoundForm from "../components/Foundform";
import MatchResults from "../components/MatchResults";
import { matchItems } from "../ai/match";
import { getOpenLost } from "../firebase/getOpenLost";
import { addFoundItem } from "../firebase/found";
import { resolveCase } from "../firebase/resolveCase";
// 1. Auth import zaroori hai
import { auth } from "../firebase/config";

export default function FoundPage({ refresh }) {
  const [matches, setMatches] = useState([]);
  const [activeData, setActiveData] = useState(null);
  const navigate = useNavigate();

  const handleCheck = async (data) => {
    // 2. Login Check: Bina login ke AI suggestions nahi dikhenge
    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ Bhai, help karne ke liye pehle login toh banta hai! Login with Google first.");
      return;
    }

    const lostList = await getOpenLost();
    console.log("Fetched Lost List:", lostList); // Debugging Log
    const aiMatches = matchItems(data, lostList);
    setActiveData(data);
    setMatches(aiMatches);
  };

  const confirmMatch = async (matchedItem) => {
    try {
      // Safety Guard
      if (!auth.currentUser) return alert("Please login again.");

      const { imageFile, ...dataWithoutFile } = activeData;
      const saved = await addFoundItem(dataWithoutFile, imageFile);
      await resolveCase(matchedItem.id, saved.id); // LostId pehle, FoundId baad mein
      alert("🎉 Thanks for helping! Match Confirmed.");
      refresh();
      navigate("/");
    } catch (e) {
      alert("Error resolving match.");
    }
  };

  const finalSubmit = async () => {
    // Safety Guard
    if (!auth.currentUser) return alert("Authentication required.");

    try {
      const { imageFile, ...dataWithoutFile } = activeData;
      await addFoundItem(dataWithoutFile, imageFile);
      alert("Added to Pending Found Reports.");
      refresh();
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("Failed to submit report: " + e.message);
    }
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <div className="form-page-container">
          <h2 className="page-title">Report Found Item</h2>

          <FoundForm onSubmit={handleCheck} />

          {activeData && (
            <div className="ai-suggestion-area">
              {activeData.aiTags && activeData.aiTags.length > 0 && (
                <p className="search-status">🤖 Searching matches for: <b>{activeData.aiTags.join(", ")}</b></p>
              )}
              <MatchResults
                matches={matches}
                onConfirm={confirmMatch}
                onNoUser={finalSubmit}
                type="FOUND"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}