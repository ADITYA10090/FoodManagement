import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function OrganizationForm() {
  const [formData, setFormData] = useState({
    organizationName: '',
    phone: '',
    email: '',
    address: ''
  });

  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Check on component mount if the user is already registered as an organization
  useEffect(() => {
    const checkUserRegistration = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const orgsRef = collection(db, 'organizations');
          const q = query(orgsRef, where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            // If the user is already registered, redirect to /home with role as receiver
            navigate('/home', { state: { role: 'receiver' } });
          }
        } catch (error) {
          console.error('Error checking organization details:', error);
          toast.error('Failed to check organization details.');
        }
      }
    };

    checkUserRegistration();
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user is logged in; if not, sign in with Google
    let currentUser = auth.currentUser;
    if (!currentUser) {
      try {
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
        console.log('User signed in:', currentUser);
      } catch (error) {
        console.error('Error signing in with Google:', error);
        toast.error('Failed to sign in with Google.');
        return;
      }
    }

    // Save organization details to Firestore along with the role and other information
    try {
      const orgsRef = collection(db, 'organizations');
      await addDoc(orgsRef, {
        ...formData,
        userId: currentUser.uid,
        role: 'receiver', // Save the role as receiver
        createdAt: new Date().toISOString()
      });
      
      toast.success('Organization registered successfully!');
      // Redirect to the /home page with the role specified in the state parameter
      navigate('/home', { state: { role: 'receiver' } });
    } catch (error) {
      console.error('Error saving organization details:', error);
      toast.error('Failed to register organization');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Receiver Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Name of Organization</label>
          <input
            type="text"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter organization name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter phone number"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Enter address"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
}

export default OrganizationForm;
