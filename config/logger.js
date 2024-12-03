import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

// Define a log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info', 
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'logs/api.log' }) // Log to a file
  ],
});

export default logger;
