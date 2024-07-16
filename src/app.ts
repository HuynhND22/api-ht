// Import packages onto app
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";


const pool = require('./database')


// Setup .env variables for app usage
dotenv.config();

// Import routes from the ./routes
import userRouter from "./routes/users";
import uploadRouter from "./routes/upload";
import postsRouter from "./routes/posts";
import categoriesRouter from "./routes/categories";
import booksRouter from "./routes/books";
import authRouter from "./routes/authentications";

import { AppDataSource } from './database';
// Setup constant variables
const PORT = process.env.PORT || 5000;
const RATE_TIME_LIMIT = Number(process.env.RATE_TIME_LIMIT) || 15;
const RATE_REQUEST_LIMIT = Number(process.env.RATE_REQUEST_LIMIT) || 100;

// Init express app
const app = express();

AppDataSource.initialize().then(async () => {
  console.log('Data source was initialized');

	// Body parser
	app.use(express.json());

	// Detailed server logging
	app.use(morgan("dev"));

	// Limit rate of requests
	// Alternatively, you can pass through specific routes for different limits based on route
	app.use(
	  rateLimit({
	    windowMs: RATE_TIME_LIMIT * 60 * 1000,
	    max: RATE_REQUEST_LIMIT,
	  }),
	);

	// Enable CORS
	app.use(cors({
	  origin: '*',
	  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	  allowedHeaders: ['Content-Type', 'Authorization']
	}));

	// Security Headers
	app.use(helmet());

	// Secure against param pollutions
	app.use(hpp());

	// Setup routing
	
	app.use('/categories', categoriesRouter);
	app.use('/auth', authRouter); 
	app.use('/uploads', uploadRouter); 
	app.use('/users', userRouter);
	app.use('/posts', postsRouter);
	app.use('/books', booksRouter);

	// Listen to specified port in .env or default 5000
	app.listen(PORT, () => {
	  console.log(`Server is listening on: ${PORT}`);
	});
})