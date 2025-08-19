const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://skygoal-henna.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(helmet());

const userRoutes = require('./routes/userRoutes');
require('./resetCron');
const otpRoutes = require('./routes/otpRoutes');
const apiLimiter = require('./middleware/rateLimiter');


const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI)
    .then(() => { console.log('Connected to MongoDB'); })
    .catch((err) => { console.error('Error connecting to MongoDB:', err); });


app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use("/api", apiLimiter);
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/otp', otpRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});