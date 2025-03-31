import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DonateFood from './pages/DonateFood';
import SearchFood from './pages/SearchFood';
import MyListing from './pages/MyListing'; // Import the MyListing component
import Dashboard from './pages/Dashboard';
import Auth from './firebase/Auth'; // This is your auth.jsx component

// Layout that includes the Navbar
function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

// Layout without the Navbar (used for Auth pages)
function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth route as the landing page */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Auth />} />
        </Route>
        {/* Routes that need the Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/donate" element={<DonateFood />} />
          <Route path="/search" element={<SearchFood />} />
          <Route path="/mylistings" element={<MyListing />} /> {/* New route for MyListing */}
        </Route>
        {/* Other routes without Navbar */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
