import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'],
  tryonApiKey: (process.env.TRYON_API_KEY || '').trim(),
  supabaseUrl: (process.env.SUPABASE_URL || '').trim(),
  supabaseAnonKey: (process.env.SUPABASE_ANON_KEY || '').trim(),
  supabaseServiceKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '60', 10) * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '50', 10),
};
