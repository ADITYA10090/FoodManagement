import { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-hot-toast';

function SearchFood() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    expiryDate: '',
    foodType: '',
    distance: '10'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const donationsRef = collection(db, 'donations');
      let q = query(donationsRef, where('status', '==', 'available'));

      if (filters.foodType) {
        q = query(q, where('foodType', '==', filters.foodType));
      }

      if (filters.expiryDate) {
        q = query(q, where('expiryDate', '>=', filters.expiryDate));
      }

      const querySnapshot = await getDocs(q);
      const results = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        // Filter by search term if provided
        if (
          !searchTerm || 
          data.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          results.push({
            id: docSnapshot.id,
            ...data
          });
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to "lock" the food donation by deleting it and sending an acceptance email
  const handleLockFood = async (donation) => {
    if (!window.confirm("Are you sure you want to lock this food donation? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete the donation entry from Firestore
      await deleteDoc(doc(db, 'donations', donation.id));
      toast.success("Food donation locked successfully!");

      // Send an acceptance email to the donor via your cloud function endpoint
      await fetch("http://localhost:3000/sendAcceptanceEmail", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: donation.email, // donor's email from the donation entry
          donationDetails: {
            foodType: donation.foodType,
            quantity: donation.quantity,
            expiryDate: donation.expiryDate,
            pickupAddress: donation.pickupAddress,
            pickupTime: donation.pickupTime,
            description: donation.description,
            organization: donation.organization
          }
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error sending acceptance email");
        }
        return response.text();
      })
      .then(data => {
        console.log("Acceptance email sent:", data);
      })
      .catch(err => {
        console.error("Error calling acceptance email endpoint:", err);
      });

      // Remove the locked donation from the local search results list
      setSearchResults(prev => prev.filter(item => item.id !== donation.id));
    } catch (error) {
      console.error("Error locking food donation:", error);
      toast.error("Failed to lock food donation");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Find Available Food</h2>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for available food..."
              className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 border rounded-lg hover:bg-gray-50"
          >
            <FaFilter className={showFilters ? 'text-green-600' : 'text-gray-600'} />
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={filters.expiryDate}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
              <select
                name="foodType"
                value={filters.foodType}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Types</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="prepared">Prepared Food</option>
                <option value="canned">Canned Food</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
              <select
                name="distance"
                value={filters.distance}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
                <option value="50">Within 50 km</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading results...</p>
        ) : searchResults.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No results found. Try adjusting your search criteria.</p>
        ) : (
          searchResults.map(result => (
            <div key={result.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{result.foodType}</h3>
                  <p className="text-gray-600">Quantity: {result.quantity}</p>
                  <p className="text-gray-600">Location: {result.pickupAddress}</p>
                  <p className="text-gray-600">Expires: {new Date(result.expiryDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Pickup Time: {result.pickupTime}</p>
                  {result.description && (
                    <p className="text-gray-600 mt-2">{result.description}</p>
                  )}
                  {result.organization && (
                    <p className="text-gray-600 mt-2">Organization: {result.organization}</p>
                  )}
                  {result.userId && (
                    <p className="text-gray-600 mt-2">User ID: {result.userId}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleLockFood(result)}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Lock Food
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchFood;
