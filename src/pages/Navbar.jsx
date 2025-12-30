import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">GDG TechSprint</Link>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/report-lost">Lost</Link>
        <Link to="/report-found">Found</Link>
      </div>
    </nav>
  );
}