import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, LogOut, User, Wifi, WifiOff, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { socket, connectSocket } from '../pages/config';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [connected, setConnected] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  useEffect(() => {
    connectSocket();
    const onConnect    = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    setConnected(socket.connected);
    return () => { socket.off('connect', onConnect); socket.off('disconnect', onDisconnect); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={styles.shell}>
      {/* Ambient background blobs */}
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}><BookOpen size={20} /></div>
            <span className={styles.logoText}>Veera<em>Ops Books</em></span>
          </Link>

          {/* Desktop nav links */}
          <div className={styles.navLinks}>
            <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>
              Library
            </Link>
            {user && (
              <Link to="/add" className={`${styles.navLink} ${location.pathname === '/add' ? styles.active : ''}`}>
                Add Book
              </Link>
            )}
          </div>

          {/* Right controls */}
          <div className={styles.navRight}>
            {/* Live indicator */}
            <div className={`${styles.liveChip} ${connected ? styles.liveOn : styles.liveOff}`} title={connected ? 'Live updates active' : 'Offline'}>
              {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{connected ? 'Live' : 'Offline'}</span>
            </div>

            {user ? (
              <>
                <div className={styles.userChip}>
                  <User size={14} />
                  <span>{user.username}</span>
                  {user.role === 'admin' && <span className={styles.adminBadge}>Admin</span>}
                </div>
                <button className={styles.iconBtn} onClick={handleLogout} title="Logout">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link to="/login" className={styles.loginBtn}>
                <LogIn size={15} /> Sign in
              </Link>
            )}

            {/* Mobile hamburger */}
            <button className={styles.hamburger} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <Link to="/" className={styles.mobileLink}>Library</Link>
            {user && <Link to="/add" className={styles.mobileLink}>+ Add Book</Link>}
            {user
              ? <button className={styles.mobileLink} onClick={handleLogout}>Sign out</button>
              : <Link to="/login" className={styles.mobileLink}>Sign in</Link>
            }
          </div>
        )}
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>BookShelf Pro &copy; {new Date().getFullYear()} &nbsp;·&nbsp; Built with ♥ for readers</p>
      </footer>
    </div>
  );
}
