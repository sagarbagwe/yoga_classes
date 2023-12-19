// Batch.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Batch = () => {
  const { batchName } = useParams();
  const [batchData, setBatchData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newBatch, setNewBatch] = useState('');

  useEffect(() => {
    // Fetch data for the selected batch
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${batchName}`);
        const data = await response.json();
        setBatchData(data);
      } catch (error) {
        console.error('Error fetching batch data:', error);
      }
    };

    fetchData();
  }, [batchName]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setNewBatch(''); // Reset the newBatch state when selecting a new user
  };

  const handleBatchChange = async () => {
    if (newBatch === '') {
      alert('Please select a batch to update.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/updateBatch/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newBatch }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the local state or refetch the data to reflect the changes
        const updatedBatchData = batchData.map((user) =>
          user.id === selectedUser.id ? { ...user, selectedBatch: newBatch } : user
        );
        setBatchData(updatedBatchData);
        // Optional: You can also update the selected user's batch in the state
        setSelectedUser({ ...selectedUser, selectedBatch: newBatch });
        alert('Batch updated successfully for the next month.');
      } else {
        alert(`Error updating batch: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating batch:', error);
      alert('Error updating batch. Please try again.');
    }
  };

  return (
    <div className="flex container mx-auto mt-8 bg-gray-200">
      <div className="flex-1 max-w-md bg-white p-8 border border-black shadow-card hover:shadow-cardhover rounded-md">
        <h2 className="text-2xl font-semibold mb-4">{`${batchName} Batch`}</h2>
        <ul className="divide-y divide-black">
          {batchData.map((user) => (
            <li
              key={user.id}
              className={`flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-md ${
                selectedUser && selectedUser.id === user.id ? 'bg-blue-200' : ''
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div className="flex flex-col gap-0 min-h-[2rem] items-start justify-center flex-1 overflow-hidden">
                <h4 className="w-full text-base truncate">{user.name}</h4>
              </div>
              <a
                href="#"
                className="flex items-center justify-center w-6 h-6 text-xs transition-colors text-black hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 0100 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
                <span className="sr-only">user options</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div className="flex-1 max-w-md bg-white p-8 border border-black shadow-card hover:shadow-cardhover rounded-md ml-4">
          <h3 className="text-xl font-semibold mb-2">Selected User: {selectedUser.name}</h3>
          <p>Age: {selectedUser.age}</p>
          <p>Selected Batch: {selectedUser.selectedBatch}</p>
          <p>Month joined: {selectedUser.selectedMonth}</p>
          {/* Option to change batch for the next month */}
          <div className="mt-4">
            <label htmlFor="newBatch" className="block text-gray-700 text-sm font-medium mb-2">
              Change Batch for Next Month
            </label>
            <select
              id="newBatch"
              className="w-full border border-gray-300 p-2 rounded-md"
              onChange={(e) => setNewBatch(e.target.value)}
              value={newBatch}
            >
              <option value="">Select Batch</option>
              <option value="6-7AM">6-7AM</option>
              <option value="7-8AM">7-8AM</option>
              <option value="8-9AM">8-9AM</option>
              <option value="5-6PM">5-6PM</option>
            </select>
          </div>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleBatchChange}
          >
            Update Batch
          </button>
        </div>
      )}
    </div>
  );
};

export default Batch;
