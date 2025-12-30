export default function MatchResults({ matches, onConfirm, onNoUser, type }) {
  return (
    <div className="match-box">
      <h2>🤖 Top AI Suggestions</h2>

      {matches.length > 0 ? (
        <div className="match-grid">
          {matches.map((m, i) => (
            <div key={i} className="match-card">
              <div className="match-header">
                <span className="percentage">{m.score}% Match</span>
              </div>

              {m.imageURL && (
                <div className="match-image">
                  <img src={m.imageURL} alt={m.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />
                </div>
              )}

              <h4>{m.title}</h4>
              <p>📍 {m.location}</p>

              {/* Yahan Name aur Phone add kiya hai */}
              <div className="contact-preview">
                <p><b>Name:</b> {type === "LOST" ? m.finderName : m.ownerName}</p>
                <p><b>Phone:</b> {m.phone}</p>
              </div>

              <button onClick={() => onConfirm(m)}>
                {type === "LOST" ? "Confirm Founder" : "Confirm Owner"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-match-text">No matches found in our database.</p>
      )}

      <div className="final-action">
        <p>Not what you're looking for?</p>
        <button className="primary-btn" onClick={onNoUser}>
          Submit as New {type} Report
        </button>
      </div>
    </div>
  );
}