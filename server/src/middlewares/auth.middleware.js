import { getSupabaseAdminClient, isSupabaseConfigured } from '../config/supabase.config.js';

/**
 * Optional authentication middleware: Extracts user from Supabase JWT if present
 */
export const optionalAuth = async (req, res, next) => {
  req.user = null;
  req.userId = null;
  req.authToken = null;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1]?.trim();
  if (!token) return next();

  req.authToken = token;

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          req.user = user;
          req.userId = user.id;
        }
      } catch (err) {
        // Token expired or invalid, continue as unauthenticated
        console.warn('Supabase token verification notice:', err.message);
      }
    }
  }

  next();
};

/**
 * Required authentication middleware: Returns 401 if user is not authenticated
 */
export const requireAuth = async (req, res, next) => {
  await optionalAuth(req, res, () => {
    if (!req.user || !req.userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in.',
        code: 'UNAUTHORIZED',
      });
    }
    next();
  });
};
