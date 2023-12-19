// Form.jsx
import React, { useState } from 'react';
import './index.css';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    selectedBatch: '',
    selectedMonth: '',
  });

  const [notification, setNotification] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation logic based on conditions
    if (validateFormData(formData)) {
      try {
        const response = await fetch('http://localhost:3001/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        // Log the response from the server
        console.log(result);

        // Check if submission is successful
        if (result.success) {
          // Check if the user is already registered
          if (result.duplicate) {
            setNotification({
              type: 'warning',
              message: 'User is already registered with the provided information.',
            });
          } else {
            // Show success notification with payment complete message
            setNotification({
              type: 'success',
              message: 'Form submitted successfully. Payment is complete.',
            });
          }
        } else {
          // Show error notification
          setNotification({
            type: 'error',
            message: 'Payment processing failed.',
          });
        }

        // You can perform further actions based on the response
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    } else {
      console.log('Invalid form data');
    }
  };

  const validateFormData = (data) => {
    // Add your validation logic based on conditions
    const age = parseInt(data.age, 10);
    const isValidAge = !isNaN(age) && age >= 18 && age <= 65;
    const isValidBatch = ['6-7AM', '7-8AM', '8-9AM', '5-6PM'].includes(data.selectedBatch);
    const isValidMonth = months.includes(data.selectedMonth);

    return data.name !== '' && isValidAge && isValidBatch && isValidMonth;
  };

  const closeNotification = () => {
    // Close the notification by setting it to null
    setNotification(null);
  };

  return (
    <div className="container mx-auto mt-8 bg-gray-200">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 border border-gray-300 shadow-card hover:shadow-cardhover rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Yoga Admission Form</h2>

        {/* Notification */}
        {notification && (
          <div className={`mb-4 bg-${notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'yellow' : 'red'}-200 p-2 rounded-md`}>
            <p>{notification.message}</p>
            <button onClick={closeNotification} className="text-xs font-semibold">Close</button>
          </div>
        )}

        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="age">
            Age (18-65)
          </label>
          <input
            type="number"
            id="age"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            min="18"
            max="65"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="selectedBatch">
            Select Batch
          </label>
          <select
            id="selectedBatch"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={formData.selectedBatch}
            onChange={(e) => setFormData({ ...formData, selectedBatch: e.target.value })}
          >
            <option value="">Select Batch</option>
            <option value="6-7AM">6-7AM</option>
            <option value="7-8AM">7-8AM</option>
            <option value="8-9AM">8-9AM</option>
            <option value="5-6PM">5-6PM</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="selectedMonth">
            Select Month for Admission
          </label>
          <select
            id="selectedMonth"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={formData.selectedMonth}
            onChange={(e) => setFormData({ ...formData, selectedMonth: e.target.value })}
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
