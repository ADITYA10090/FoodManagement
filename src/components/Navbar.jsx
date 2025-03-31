import { Link } from 'react-router-dom';
import { FaHome, FaDonate, FaSearch, FaChartBar } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="flex items-center space-x-2">
            <FaHome className="text-2xl" />
            <span className="font-bold text-xl">FoodShare</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/donate" className="flex items-center space-x-1 hover:text-green-200">
              <FaDonate />
              <span>Donate</span>
            </Link>
            <Link to="/search" className="flex items-center space-x-1 hover:text-green-200">
              <FaSearch />
              <span>Search</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-1 hover:text-green-200">
              <FaChartBar />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;