// const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
// const problemRoutes = require('./routes/problemRoutes'); // Adjust the path if needed

// // Initialize dotenv
// dotenv.config();

// // Initialize Express app
// const app = express();

// // Middleware for JSON and URL-encoded form parsing
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files (e.g., uploaded images)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/problems', problemRoutes);

// // Root route
// app.get('/', (req, res) => {
//   res.send('Math Doubt Solver API is running...');
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors'); 
const problemRoutes = require('./routes/problemRoutes');

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/problems', problemRoutes);

app.get('/', (req, res) => {
  res.send('Math Doubt Solver API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
