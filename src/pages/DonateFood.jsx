// donatefood.js
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth } from 'firebase/auth';
import { foodTypes } from '../utils/foodTypes';

function DonateFood() {
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    expiryDate: '',
    pickupAddress: '',
    pickupTime: '',
    organization: '',
    description: '',
    phone: '',
    email: '',
    upiId: ''
  });

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('User not logged in. Please sign in to donate food.');
      return;
    }
    const userId = currentUser.uid;

    try {
      // Add the donation to Firestore
      const donationsRef = collection(db, 'donations');
      const donationDoc = await addDoc(donationsRef, {
        ...formData,
        userId, // uniquely identify who uploaded the donation
        createdAt: new Date().toISOString(),
        status: 'available'
      });

      toast.success('Food donation listed successfully!');

      // Automatically send the donation data to the local cloud function endpoint
      await fetch("http://localhost:3000/sendDonationEmail", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          donationId: donationDoc.id,
          ...formData
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error sending donation email");
        }
        return response.text();
      })
      .then(data => {
        console.log("Cloud function response:", data);
      })
      .catch(err => {
        console.error("Error calling cloud function:", err);
      });

      // Reset the form after successful submission
      setFormData({
        foodType: '',
        quantity: '',
        expiryDate: '',
        pickupAddress: '',
        pickupTime: '',
        organization: '',
        description: '',
        phone: '',
        email: '',
        upiId: ''
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast.error('Failed to submit donation');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Donate Food</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Food Type</label>
          <select
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Food Type</option>
            {foodTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Quantity</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Pickup Time</label>
          <input
            type="time"
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Organization</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Organization Name (if any)"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          ></textarea>
        </div>

        {/* Contact Fields */}
        <div>
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter your phone number"
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
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">UPI ID</label>
          <input
            type="text"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter your UPI ID"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
}

export default DonateFood;
