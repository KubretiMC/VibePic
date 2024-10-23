import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartScreen from './pages/StartScreen/StartScreen';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<StartScreen />} />
    </Routes>
  </Router>
);

export default AppRoutes;
