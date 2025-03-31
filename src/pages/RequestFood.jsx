import { useState } from 'react';
import { toast } from 'react-hot-toast';

function RequestFood() {
  const [formData, setFormData] = useState({
    organizationType: '',
    organization: '', // added organization field
    contactName: '',
    phone: '',
    email: '',
    address: '',
    foodTypes: '',
    servingsNeeded: '',
    urgency: 'normal'
  });
  
  // State to hold submitted data for display
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement Supabase integration
      toast.success('Food request submitted successfully!');
      
      // Save the submitted data so we can display it
      setSubmittedData(formData);
      
      // Optionally, reset the form
      setFormData({
        organizationType: '',
        organization: '',
        contactName: '',
        phone: '',
        email: '',
        address: '',
        foodTypes: '',
        servingsNeeded: '',
        urgency: 'normal'
      });
    } catch (error) {
      toast.error('Failed to submit request');
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Request Food</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Organization Type</label>
          <select
            name="organizationType"
            value={formData.organizationType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="foodBank">Food Bank</option>
            <option value="shelter">Shelter</option>
            <option value="ngo">NGO</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* New Organization field */}
        <div>
          <label className="block text-gray-700 mb-2">Organization</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Organization Name"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Contact Name</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Food Types Needed</label>
          <input
            type="text"
            name="foodTypes"
            value={formData.foodTypes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Servings Needed</label>
          <input
            type="number"
            name="servingsNeeded"
            value={formData.servingsNeeded}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Urgency</label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit Request
        </button>
      </form>

      {submittedData && (
        <div className="mt-8 p-4 border rounded bg-gray-100">
          <h3 className="text-2xl font-bold mb-4">Submitted Request</h3>
          <p><strong>Organization Type:</strong> {submittedData.organizationType}</p>
          <p><strong>Organization:</strong> {submittedData.organization}</p>
          <p><strong>Contact Name:</strong> {submittedData.contactName}</p>
          <p><strong>Phone:</strong> {submittedData.phone}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Address:</strong> {submittedData.address}</p>
          <p><strong>Food Types Needed:</strong> {submittedData.foodTypes}</p>
          <p><strong>Servings Needed:</strong> {submittedData.servingsNeeded}</p>
          <p><strong>Urgency:</strong> {submittedData.urgency}</p>
        </div>
      )}
    </div>
  );
}

export default RequestFood;
