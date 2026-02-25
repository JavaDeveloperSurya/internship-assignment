const express = require('express');
const corsConfig = require('./configs/cors-config');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const connectDb=require('./configs/mongoDb-config');
const endpointRatelimit = require('./middlewares/rate-limiter');
const errorHandler = require('./middlewares/error-handler');

const userAuthRoutes = require('./routers/user-auth-routes');
const adminAuthRouter = require('./routers/admin-auth-router');
const bookRouter = require('./routers/books-router');


const app = express();
const PORT = process.env.PORT || 3000;

// db connection
connectDb();

// middlewares
app.use(corsConfig());
app.use(express.json());
app.use(cookieParser());

// global error handler 
app.use(errorHandler);

// health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is healthy'
    });
});

// user authentication routes
app.use('/api/auth',endpointRatelimit,userAuthRoutes);

// admin authentication routes
app.use('/api/admin',endpointRatelimit,adminAuthRouter);

// book routes
app.use('/api/books',bookRouter);

// server listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});