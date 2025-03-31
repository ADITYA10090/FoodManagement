import { useState } from 'react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('donations');

  const donations = [];
  const requests = [];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'donations'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              onClick={() => setActiveTab('donations')}
            >
              Donations
            </button>
            <button
              className={`${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'donations' ? (
        <div className="space-y-4">
          {donations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No donations found</p>
          ) : (
            donations.map((donation) => (
              <div key={donation.id} className="bg-white p-4 rounded-lg shadow">
                {/* Donation details */}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No requests found</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg shadow">
                {/* Request details */}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;