import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PresentationEdit from './pages/PresentationEdit';
import PreviewPage from './pages/PreviewPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/presentation/:id" element={<PresentationEdit />} />
        <Route path="/preview/:id" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App
