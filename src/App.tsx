import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { SlidesPage } from './pages/SlidesPage';
import { SlideDetailPage } from './pages/SlideDetailPage';
import { QuizPage } from './pages/QuizPage';
import { RecordsPage } from './pages/RecordsPage';
import { GlossaryPage } from './pages/GlossaryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/slides" element={<SlidesPage />} />
          <Route path="/slides/:slideId" element={<SlideDetailPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
