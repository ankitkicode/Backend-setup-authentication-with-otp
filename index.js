import dotenv from "dotenv";
dotenv.config();
import express from "express";
import dbConnection from "./database/dbConnection.js";
import userRouter from "./routes/user.route.js";
import logger from "./config/logger.js";

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
dbConnection(process.env.DB_URI);

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// Middleware to log all incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Define your routes BEFORE the incorrect route middleware
app.use('/user', userRouter);

app.get("/", (req, res) => {
  res.send("Hello, server is running....");
});

// Middleware to handle incorrect routes
app.use((req, res) => {
  logger.error(`Incorrect route: ${req.method} ${req.url}`);
  console.error(`Incorrect route: ${req.method} ${req.url}`);
  res.status(404).send("URL not found!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  console.error(err.message);
  res.status(500).send("Something went wrong");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
