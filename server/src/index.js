import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.config.js';
import tryonRoutes from './routes/tryon.routes.js';
import healthRoutes from './routes/health.routes.js';
import historyRoutes from './routes/history.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const isAllowedExplicit = !origin || config.corsOrigins.includes(origin);
      const isDevLocalhost =
        config.nodeEnv === 'development' &&
        typeof origin === 'string' &&
        /^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin);

      if (isAllowedExplicit || isDevLocalhost) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing for JSON and URL-encoded requests
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static uploaded & cached try-on result images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TryNFit TryOn-API Virtual Try-On API',
    endpoints: {
      health: 'GET /api/health',
      tryon: 'POST /api/tryon/generate',
      history: 'GET /api/history',
    },
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/tryon', tryonRoutes);
app.use('/api/history', historyRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  const hasApiKey = Boolean(config.tryonApiKey && config.tryonApiKey.length > 5);
  console.log('\n======================================================');
  console.log(`🚀 TryNFit Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`✨ API Provider: TryOn-API (tryon-api.com)`);
  console.log(`🔑 TRYON_API_KEY Status: ${hasApiKey ? 'DETECTED & CONFIGURED' : 'MISSING'}`);
  console.log('======================================================\n');
});

export default app;
