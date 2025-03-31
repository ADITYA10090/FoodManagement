import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';

function MyListing() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      toast.error('User not logged in. Please sign in to view your listings.');
      return;
    }
    
    const fetchListings = async () => {
      setLoading(true);
      try {
        const donationsRef = collection(db, 'donations');
        const q = query(donationsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        setListings(results);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error('Failed to fetch your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [currentUser]);

  const handleDelete = async (listingId) => {
    try {
      await deleteDoc(doc(db, 'donations', listingId));
      setListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
      toast.success('Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Listings</h2>
      
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500 py-8">You haven't made any listings yet.</p>
      ) : (
        <div className="space-y-4">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800">{listing.foodType}</h3>
              <p className="text-gray-600">Quantity: {listing.quantity}</p>
              <p className="text-gray-600">Location: {listing.pickupAddress}</p>
              <p className="text-gray-600">Expires: {new Date(listing.expiryDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Pickup Time: {listing.pickupTime}</p>
              {listing.organization && (
                <p className="text-gray-600 mt-2">Organization: {listing.organization}</p>
              )}
              {listing.description && (
                <p className="text-gray-600 mt-2">{listing.description}</p>
              )}
              <button
                onClick={() => handleDelete(listing.id)}
                className="mt-2 inline-block bg-red-600 text-white text-sm font-medium py-1 px-3 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListing;
