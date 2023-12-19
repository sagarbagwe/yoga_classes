const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

require('dotenv').config(); // Load environment variables from .env file

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === 'true',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT, 10) || 0,
});

// ... (rest of your code remains the same)


// Validate MySQL connection
async function validateMySQLConnection() {
  try {
    await pool.execute('SELECT 1'); // Simple query to test the connection
    console.log('MySQL connection established successfully.');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    process.exit(1); // Exit the process if the connection fails
  }
}

// Function to validate user data on the server side
function validateUserData(data) {
  // Implement server-side validation logic here
  // You can check if the name, age, and other fields meet your requirements
  return data.name !== '' && data.age !== '' && data.selectedBatch !== '' && data.selectedMonth !== '';
}

// Use the cors middleware
app.use(cors());
app.use(bodyParser.json());

// Validate MySQL connection before starting the server
validateMySQLConnection()
  .then(() => {
    // Continue setting up the server

    // Endpoint to handle form submissions
    app.post('/submit', async (req, res) => {
      const userData = req.body;

      // Basic server-side validation
      if (validateUserData(userData)) {
        try {
          const [results] = await pool.execute('INSERT INTO users (name, age, selectedBatch, selectedMonth) VALUES (?, ?, ?, ?)', [
            userData.name,
            userData.age,
            userData.selectedBatch,
            userData.selectedMonth,
          ]);

          // Assume payment is successful using a mock function
          const paymentResponse = completePayment(userData);

          // Return response to the front-end based on the payment response
          if (paymentResponse) {
            res.json({
              success: true,
              message: 'Form submitted successfully and payment processed.',
              userId: results.insertId,
            });
          } else {
            res.json({ success: false, message: 'Payment processing failed.' });
          }
        } catch (error) {
          console.error('Error saving data to MySQL:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
      } else {
        res.status(400).json({ success: false, message: 'Invalid form data.' });
      }
    });

    // Endpoint to fetch users based on the selected batch
    app.get('/users/:batch', async (req, res) => {
      const batch = req.params.batch;

      try {
        const [users] = await pool.execute('SELECT * FROM users WHERE selectedBatch = ?', [batch]);
        res.json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Endpoint to update the user's batch and month for the next month
    app.put('/users/updateBatch/:userId', async (req, res) => {
      const userId = req.params.userId;
      const { newBatch } = req.body;

      try {
        // Get the current user data
        const [currentUser] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);

        if (currentUser.length === 0) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const currentBatch = currentUser[0].selectedBatch;
        const currentMonth = currentUser[0].selectedMonth;

        // Validate that users in the same month are in the same batch
        const [usersInSameMonth] = await pool.execute('SELECT * FROM users WHERE selectedMonth = ?', [currentMonth]);

        const usersInSameBatch = usersInSameMonth.filter(user => user.selectedBatch === currentBatch);

        if (usersInSameBatch.length === 1) {
          // Update the batch and month for the next month
          const nextMonth = getNextMonth(currentMonth);

          await pool.execute('UPDATE users SET selectedBatch = ?, selectedMonth = ? WHERE id = ?', [newBatch, nextMonth, userId]);

          res.json({ success: true, message: 'Batch and month updated successfully for the next month.' });
        } else {
          res.status(400).json({ success: false, message: 'Users in the same month must be in the same batch.' });
        }
      } catch (error) {
        console.error('Error updating batch and month:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    });

    // Mock function for payment (not implemented in this example)
    function completePayment(user) {
      console.log('Payment completed for:', user);
      return true;
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error validating MySQL connection:', error);
  });

// Function to get the next month
function getNextMonth(currentMonth) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentIndex = months.indexOf(currentMonth);

  if (currentIndex !== -1 && currentIndex < months.length - 1) {
    return months[currentIndex + 1];
  }

  return currentMonth; // Return the same month if the current month is December
}
