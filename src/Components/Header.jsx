import { Link } from 'react-router-dom';
import { FaPen, FaCog, FaUser } from 'react-icons/fa';
import useAuthStore from '../Store/AuthStore';

function Header() {
  const user = useAuthStore((s) => s.user);
  const isAuth = useAuthStore((s) => s.isAuth);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">Realworld Blog</Link>

        <nav className="nav">
          <Link to="/">Home</Link>

          <Link to={isAuth ? "/new-article" : "/sign-up"}>
            <FaPen />New Post
          </Link>

          <Link to={isAuth ? "/settings" : "/sign-up"}>
            <FaCog />Settings
          </Link>

          <Link to={isAuth ? "/" : "/sign-in"}>
            <FaUser />
            {isAuth && user ? user.username : 'Account'}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;