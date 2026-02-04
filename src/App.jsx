import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ArticlesList from './Pages/ArticlesList.jsx';
import ArticlePage from './Pages/ArticlePage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticlesList />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;