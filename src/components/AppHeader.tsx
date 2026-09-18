/** Shared header + nav. Ports the `site-header` block from the Thymeleaf templates,
 *  minus the "⏻ Beenden" shutdown button (there is no server to stop). */
import { NavLink } from 'react-router-dom';
import { useStore } from '../store/StoreContext';

const NAV = [
  { to: '/vokabeln', label: 'Vokabeln' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/wetter', label: 'Wetter & Nachrichten' },
  { to: '/grammar', label: 'Grammatik' },
  { to: '/about', label: 'ℹ️ Über' },
];

export default function AppHeader() {
  const { entries } = useStore();
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <NavLink to="/">
          <img className="flag" src="/german-flag.svg" alt="Flag of Germany" />
        </NavLink>
        <div>
          <h1>
            Deutsch <span className="accent">Study Reference</span>
          </h1>
          <p className="tagline">
            Searchable German&nbsp;&harr;&nbsp;English vocabulary ({entries.length} entries).
          </p>
        </div>
        <nav className="nav-links">
          {NAV.map((n) => (
            <NavLink key={n.to} className="nav-link" to={n.to}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
