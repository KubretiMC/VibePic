import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartScreen from './pages/StartScreen/screen/StartScreen';
import HomeScreen from './pages/HomeScreen/screen/HomeScreen';
import GroupScreen from './pages/GroupScreen/screen/GroupScreen';
import ProfileScreen from './pages/ProfileScreen/screen/ProfileScreen';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="/groups/:groupName" element={<ProtectedRoute><GroupScreen /></ProtectedRoute>} />
    </Routes>
  </Router>
);

export default AppRoutes;
