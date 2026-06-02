import { HashRouter as BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { SlidesPage } from './pages/SlidesPage';
import { SlideDetailPage } from './pages/SlideDetailPage';
import { QuizPage } from './pages/QuizPage';
import { WeakPage } from './pages/WeakPage';
import { GlossaryPage } from './pages/GlossaryPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/slides" element={<SlidesPage />} />
          <Route path="/slides/:slideId" element={<SlideDetailPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/weak" element={<WeakPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
