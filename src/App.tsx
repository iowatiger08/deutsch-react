import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { StoreProvider, useStore } from './store/StoreContext';
import AppHeader from './components/AppHeader';
import Search from './routes/Search';
import Vokabeln from './routes/Vokabeln';
import Quiz from './routes/Quiz';
import Grammar from './routes/Grammar';
import Wetter from './routes/Wetter';
import About from './routes/About';
import Terms from './routes/Terms';
import Placeholder from './routes/Placeholder';

function Shell() {
  const { loading } = useStore();
  return (
    <>
      <AppHeader />
      {loading ? (
        <main className="wrap">
          <p className="result-meta">Loading vocabulary…</p>
        </main>
      ) : (
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/vokabeln" element={<Vokabeln />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/wetter" element={<Wetter />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Placeholder title="Not found" />} />
        </Routes>
      )}
      <footer className="wrap">
        <nav className="footer-links" aria-label="Footer">
          <a href="https://tigersndragons.com/" target="_blank" rel="noopener noreferrer">
            Main site
          </a>
          <Link to="/about">About</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <p>
          <button
            type="button"
            className="to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑ Nach oben
          </button>
        </p>
        <p>
          Data extracted from <code>germanTableList.pdf</code> · served from the API, cached in your
          browser for offline use
        </p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </BrowserRouter>
  );
}
