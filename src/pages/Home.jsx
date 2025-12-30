import { Link } from "react-router-dom";
import { googleLogin } from "../firebase/auth";
import { auth } from "../firebase/config"; // Auth check ke liye import kiya
import PendingReports from "../components/PendingReports";

export default function Home({ pendingLost, pendingFound, onDelete, onClear }) {
  // Current user ki state check karein
  const user = auth.currentUser;

  return (
    <div className="app-card">
      <header className="home-header">
        <h1>Neural Knights</h1>
        {user ? (
          <div className="user-profile">
            <span className="user-name">Welcome, {user.displayName.split(' ')[0]}!</span>
            {/* Logout button ya profile photo yahan add kar sakte ho */}
          </div>
        ) : (
          <button className="google-btn" onClick={googleLogin}>Login with Google</button>
        )}
      </header>

      {/* Conditional Rendering: Agar login hai toh cards dikhao, warna login message */}
      <div className="action-grid">
        {user ? (
          <>
            <Link to="/report-lost" className="nav-card lost-btn">
              <h2>🔴 Report Lost</h2>
              <p>AI will search for matches</p>
            </Link>
            <Link to="/report-found" className="nav-card found-btn">
              <h2>🟢 Report Found</h2>
              <p>Help someone find their item</p>
            </Link>
          </>
        ) : (
          <div className="login-warning-card">
            <h2>🔒 Restricted Access</h2>
            <p>Please login with Google to report items or view AI suggestions.</p>
            <button className="primary-btn" onClick={googleLogin} style={{marginTop: '15px'}}>
              Login Now
            </button>
          </div>
        )}
      </div>

      <div className="section">
        {/* Pending LOST Column */}
        <div className="pending-column">
          <div className="list-header">
            <h3>Pending LOST</h3>
            {user && pendingLost.length > 0 && (
              <button className="btn-clear" onClick={() => onClear("LOST")}>
                Clear All
              </button>
            )}
          </div>
          <PendingReports 
            items={pendingLost} 
            tag="LOST" 
            onDelete={(id) => onDelete(id, "LOST")} 
          />
        </div>

        {/* Pending FOUND Column */}
        <div className="pending-column">
          <div className="list-header">
            <h3>Pending FOUND</h3>
            {user && pendingFound.length > 0 && (
              <button className="btn-clear" onClick={() => onClear("FOUND")}>
                Clear All
              </button>
            )}
          </div>
          <PendingReports 
            items={pendingFound} 
            tag="FOUND" 
            onDelete={(id) => onDelete(id, "FOUND")} 
          />
        </div>
      </div>
    </div>
  );
}