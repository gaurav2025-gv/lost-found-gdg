import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Corrected Paths (Tumhari files 'pages' folder ke andar hain)
import Home from "./pages/Home";
import LostPage from "./pages/LostPage";
import FoundPage from "./pages/FoundPage";

// Firebase Services (Lost)
import { getOpenLost } from "./firebase/getOpenLost";
import { deleteLostItem } from "./firebase/deleteLostItem";
import { deleteAllLostItems } from "./firebase/deleteAllLostItems";

// Firebase Services (Found)
import { getOpenFound } from "./firebase/getOpenFound";
import { deleteFoundItem, deleteAllFoundItems } from "./firebase/foundActions";

import "./App.css";

export default function App() {
  const [pendingLost, setPendingLost] = useState([]);
  const [pendingFound, setPendingFound] = useState([]);

  // Initial Data Load
  useEffect(() => {
    refreshPending();
  }, []);

  const refreshPending = async () => {
    try {
      const lost = await getOpenLost();
      const found = await getOpenFound();
      setPendingLost(lost || []);
      setPendingFound(found || []);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // 🗑️ Handle Single Delete (Dustbin Icon)
  const removeSingle = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type} report?`)) {
      try {
        if (type === "LOST") {
          await deleteLostItem(id);
        } else {
          await deleteFoundItem(id); 
        }
        await refreshPending(); 
      } catch (error) {
        alert(`Delete failed: ${error.message}`);
      }
    }
  };

  // 🧹 Handle Clear All (Delete all pending)
  const clearAll = async (type) => {
    if (window.confirm(`⚠️ WARNING: This will delete ALL pending ${type} items. Continue?`)) {
      try {
        if (type === "LOST") {
          await deleteAllLostItems();
        } else {
          await deleteAllFoundItems(); 
        }
        await refreshPending(); 
        alert(`All pending ${type} items have been cleared.`);
      } catch (error) {
        alert(`Clear All failed: ${error.message}`);
      }
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Main Dashboard */}
          <Route 
            path="/" 
            element={
              <Home 
                pendingLost={pendingLost} 
                pendingFound={pendingFound} 
                onDelete={removeSingle}
                onClear={clearAll}
              />
            } 
          />

          {/* Report Lost Page */}
          <Route 
            path="/report-lost" 
            element={<LostPage refresh={refreshPending} />} 
          />

          {/* Report Found Page */}
          <Route 
            path="/report-found" 
            element={<FoundPage refresh={refreshPending} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}