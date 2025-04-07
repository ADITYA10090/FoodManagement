import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaDonate, FaSearch, FaChartBar, FaList } from 'react-icons/fa';

function Navbar() {
  const location = useLocation();
  // Access the role from the state, defaulting to "donor" if not provided.
  const role = location.state?.role || 'donor';

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Pass the role state to the home link */}
          <Link to="/home" state={{ role }} className="flex items-center space-x-2">
            <FaHome className="text-2xl" />
            <span className="font-bold text-xl">FoodShare</span>
          </Link>
          
          <div className="flex space-x-6">
            {role === 'donor' && (
              <>
                <Link
                  to="/donate"
                  state={{ role }}
                  className="flex items-center space-x-1 hover:text-green-200"
                >
                  <FaDonate />
                  <span>Donate</span>
                </Link>
                <Link
                  to="/mylistings"
                  state={{ role }}
                  className="flex items-center space-x-1 hover:text-green-200"
                >
                  <FaList />
                  <span>My Listings</span>
                </Link>
              </>
            )}

            {role === 'receiver' && (
              <>
                <Link
                  to="/search"
                  state={{ role }}
                  className="flex items-center space-x-1 hover:text-green-200"
                >
                  <FaSearch />
                  <span>Search</span>
                </Link>
                <Link
                  to="/dashboard"
                  state={{ role }}
                  className="flex items-center space-x-1 hover:text-green-200"
                >
                  <FaChartBar />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
