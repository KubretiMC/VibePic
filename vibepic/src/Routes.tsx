import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartScreen from './pages/StartScreen/screen/StartScreen';
import HomeScreen from './pages/HomeScreen/screen/HomeScreen';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/home" element={<HomeScreen />} />
    </Routes>
  </Router>
);

export default AppRoutes;
