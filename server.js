const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = require('./app');
const winston = require('winston');


const logger = winston.createLogger({
  level: 'info', // Set the logging level
  format: winston.format.json(), // JSON format for logs
  defaultMeta: { service: 'your-service-name' }, // Optionally add metadata
  transports: [
    // Add transports for logging to files or other destinations
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'error.log', level: 'error' }) // Log errors to a file
  ],
});

// Connect to MongoD
// const DB="mongodb+srv://Rishu2421:Rishu2421@cluster0.lm2gsfi.mongodb.net/meatgram?retryWrites=true&w=majority"
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log(`connection succesfull `);
//   })
//   .catch((err) => {
//     console.log(err);
//   });



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/metagram', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsConnection = mongoose.connection;
itemsConnection.on('connected', () => {
  console.log('Connected to MongoDB Items database');
});

itemsConnection.on('error', (error) => {
  console.error('Error connecting to MongoDB Items database:', error);
});




// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/metagram', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const itemsConnection = mongoose.connection;
// itemsConnection.on('connected', () => {
//   console.log('Connected to MongoDB Items database');
// });

// itemsConnection.on('error', (error) => {
//   console.error('Error connecting to MongoDB Items database:', error);
// });




  // Set up routes and middleware here

  // Serve the static files from the build directory
app.use(express.static(path.join(__dirname, '../build')));
app.use('/public/uploads', express.static(__dirname+'/public/uploads/'));
// Your other routes and middleware go here

// Serve the index.html for all other requests
app.get('*', (req, res) => {
  logger.info('Handling a request');
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Handle CORS

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

process.on('uncaughtException', (error) => {
  logger.error(`Unhandled Exception: ${error.message}`);
  // Additional logging and cleanup as needed
  process.exit(1); // Exit the process with a non-zero status code
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`);
  // Additional logging and cleanup as needed
  process.exit(1); // Exit the process with a non-zero status code
});

// Your existing code to start the server

  
  // Passport middleware
  // app.use(passport.initialize());
  // app.use(passport.session());
  
  // Routes
  // app.use('/auth', authRoutes);
  // app.use('/api/otp', otpRoutes);



// Serve the static files from the React app


// Start the server
app.listen(3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
