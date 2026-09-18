import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider, useStore } from './store/StoreContext';
import AppHeader from './components/AppHeader';
import Search from './routes/Search';
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
          <Route path="/vokabeln" element={<Placeholder title="Vokabeln" />} />
          <Route path="/quiz" element={<Placeholder title="Quiz" />} />
          <Route path="/grammar" element={<Placeholder title="Grammatik" />} />
          <Route path="/wetter" element={<Placeholder title="Wetter & Nachrichten" />} />
          <Route path="/about" element={<Placeholder title="Über" />} />
          <Route path="*" element={<Placeholder title="Not found" />} />
        </Routes>
      )}
      <footer className="wrap">
        <p>
          Data extracted from <code>germanTableList.pdf</code> · stored locally in your browser
          (IndexedDB)
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
