import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Café Employee Manager</h1>
        <nav className="header-nav">
          <Link
            to="/cafes"
            className={`nav-link ${isActive('/cafes') ? 'active' : ''}`}
          >
            Cafés
          </Link>
          <Link
            to="/employees"
            className={`nav-link ${isActive('/employees') ? 'active' : ''}`}
          >
            Employees
          </Link>
        </nav>
      </div>
    </header>
  );
}
