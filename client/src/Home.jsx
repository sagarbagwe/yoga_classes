// Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [clickedButton, setClickedButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setClickedButton(buttonName);
  };

  return (
    <div className="container mx-auto mt-8 flex flex-col items-center bg-gray-200 p-8">
      <h1 className="text-3xl font-semibold mb-6">Welcome to the Yoga classes</h1>

      <div className="flex flex-col items-center gap-4">
        <Link
          to="/form"
          className={`button ${clickedButton === 'Admission Form' && 'active'}`}
          onClick={() => handleButtonClick('Admission Form')}
        >
          Admission Form
        </Link>

        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold mb-2">Batch Schedule</span>

          <Link
            to="/batch/6-7AM"
            className={`button ${clickedButton === '6-7AM Batch' && 'active'}`}
            onClick={() => handleButtonClick('6-7AM Batch')}
          >
            6-7AM Batch
          </Link>

          <Link
            to="/batch/7-8AM"
            className={`button ${clickedButton === '7-8AM Batch' && 'active'}`}
            onClick={() => handleButtonClick('7-8AM Batch')}
          >
            7-8AM Batch
          </Link>

          <Link
            to="/batch/8-9AM"
            className={`button ${clickedButton === '8-9AM Batch' && 'active'}`}
            onClick={() => handleButtonClick('8-9AM Batch')}
          >
            8-9AM Batch
          </Link>

          <Link
            to="/batch/5-6PM"
            className={`button ${clickedButton === '5-6PM Batch' && 'active'}`}
            onClick={() => handleButtonClick('5-6PM Batch')}
          >
            5-6PM Batch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
