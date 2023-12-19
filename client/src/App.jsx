// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { logo } from './assets';
import Home from './Home'; // Import the Home component
import Form from './form';
import Batch from './Batch';
import './index.css'; // Import the CSS file

const App = () => (
  <Router>
    <header className="w-full flex justify-between items-center bg-gray-700 sm:px-8 px-4 py-4 border-b rounded-md">
      <Link to="/">
        <img src={logo} alt="logo" className="w-28 object-contain" />
      </Link>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/form" className="button">
              Admission Form
            </Link>
          </li>
          <li>
            <Link to="/batch/6-7AM" className="button">
              6-7AM Batch
            </Link>
          </li>
          <li>
            <Link to="/batch/7-8AM" className="button">
              7-8AM Batch
            </Link>
          </li>
          <li>
            <Link to="/batch/8-9AM" className="button">
              8-9AM Batch
            </Link>
          </li>
          <li>
            <Link to="/batch/5-6PM" className="button">
              5-6PM Batch
            </Link>
          </li>
        </ul>
      </nav>
    </header>

    <main className="container mx-auto mt-8">
      <Routes>
        <Route path="/" element={<Home />} /> {/* Use the Home component for the home route */}
        <Route path="/form" element={<Form />} />
        <Route path="/batch/:batchName" element={<Batch />} />
      </Routes>
    </main>

    {/* Footer Section */}
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          {/* Footer content here */}
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023 <a href="https://www.linkedin.com/in/sagar-bagwe-8b353a205/" className="hover:underline">
            Linkedin
          </a>
          . All Rights Reserved Sagar bagwe.
        </span>
      </div>
    </footer>
  </Router>
);

export default App;
