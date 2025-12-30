export default function PendingReports({ items, tag, onDelete }) {
  if (!items || items.length === 0) return <p className="empty-text">No pending reports</p>;

  return (
    <div className="pending-list">
      {items.map((item) => (
        <div key={item.id} className={`pending-card ${tag.toLowerCase()}`}>
          <div className="card-content">
            {item.imageURL && (
              <img src={item.imageURL} alt={item.title} className="item-thumbnail" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
            )}
            <h4>{item.title}</h4>
            <p>📍 {item.location}</p>
          </div>
          <button className="delete-icon-btn" onClick={() => onDelete(item.id)}>
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}