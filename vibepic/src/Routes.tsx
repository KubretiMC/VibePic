import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartScreen from './pages/StartScreen/screen/StartScreen';
import HomeScreen from './pages/HomeScreen/screen/HomeScreen';
import GroupScreen from './pages/GroupScreen/screen/GroupScreen';
import ProfileScreen from './pages/ProfileScreen/ProfileScreen';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/groups/:groupName" element={<GroupScreen />} />
    </Routes>
  </Router>
);

export default AppRoutes;
