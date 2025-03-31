import { Link } from 'react-router-dom';
import { FaDonate, FaHandHoldingHeart, FaList } from 'react-icons/fa';

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Connecting Surplus Food with Those in Need
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Join our mission to reduce food waste and fight hunger by connecting food donors
        with those who need it most.
      </p>
      
      <div className="flex justify-center space-x-8">
        <Link
          to="/donate"
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FaDonate className="mr-2" />
          Donate Food
        </Link>
        <Link
          to="/request"
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaHandHoldingHeart className="mr-2" />
          Request Food
        </Link>
        <Link
          to="/mylistings"
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <FaList className="mr-2" />
          My Listings
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">For Donors</h3>
          <p className="text-gray-600">
            Easily donate surplus food from your restaurant, store, or event.
            Track your contributions and make a difference.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">For Recipients</h3>
          <p className="text-gray-600">
            Find available food donations in your area. Get notifications
            when new donations match your needs.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Impact</h3>
          <p className="text-gray-600">
            Join our community in reducing food waste and helping those
            in need. Every donation makes a difference.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
