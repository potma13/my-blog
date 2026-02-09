import { Link } from 'react-router-dom';
import { FaPen, FaCog, FaUser } from 'react-icons/fa';

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">Realworld Blog</Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <span><FaPen />New Post</span>
          <span><FaCog />Settings</span>
          <span><FaUser />Account</span>
        </nav>
      </div>
    </header>
  );
}

export default Header;