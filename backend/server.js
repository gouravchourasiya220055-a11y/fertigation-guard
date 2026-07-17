import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import connectDB from './config/db.js';
import initializeSocket from './config/socket.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import farmRoutes from './routes/farm.routes.js';
import sensorRoutes from './routes/sensor.routes.js';
import automationRoutes from './routes/automation.routes.js';
import alertRoutes from './routes/alert.routes.js';
import reportRoutes from './routes/report.routes.js';
import deviceRoutes from './routes/device.routes.js';
import relayRoutes from './routes/relay.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Connect to Database
connectDB();

// Initialize Socket.io
initializeSocket(httpServer);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Global Request Logger
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl} - Body: ${JSON.stringify(req.body)}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/device', deviceRoutes); 
app.use('/api/sensors', sensorRoutes); 
app.use('/api/automation', automationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/relays', relayRoutes);

app.get('/', (req, res) => {
  res.send('Fertigation Guard API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

httpServer.listen(PORT, HOST, () => {
  logger.info("==========================================");
  logger.info(`🚀 Fertigation Guard Backend Started`);
  logger.info(`📡 Server Address : http://${HOST}:${PORT}`);
  logger.info(`💻 Local URL      : http://localhost:${PORT}`);
  logger.info(`🌐 Network URL    : http://10.109.2.187:${PORT}`);
  logger.info("==========================================");
});
