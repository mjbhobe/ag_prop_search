import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <FiHome size={28} />
          <span className="logo-text">PropertyHub</span>
        </Link>
        
        <nav className="nav">
          <Link to="/?type=rent" className="nav-link">Rent</Link>
          <Link to="/?type=buy" className="nav-link">Buy</Link>
        </nav>
        
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
