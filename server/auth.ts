import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from './storage';

export const setupAuth = () => {
  // Configure Passport to use Google OAuth
  // Get URL from environment or determine dynamically
  const appUrl = process.env.APP_URL || 
    (process.env.REPL_SLUG && process.env.REPL_OWNER 
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : 'http://localhost:5000');
  
  const callbackURL = new URL('/api/auth/google/callback', appUrl).toString();
  console.log(`Using callback URL: ${callbackURL}`);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL,
        scope: ['profile', 'email'],
        // Allow only users from the workspace domain if specified
        ...(process.env.GOOGLE_WORKSPACE_DOMAIN && { hd: process.env.GOOGLE_WORKSPACE_DOMAIN }),
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user already exists
          let user = await storage.getUserByGoogleId(profile.id);

          if (!user) {
            // Create a new user if they don't exist
            const email = profile.emails?.[0]?.value || '';
            const name = profile.displayName || '';
            const picture = profile.photos?.[0]?.value || '';

            if (!email) {
              return done(new Error('No email provided from Google'), null);
            }

            user = await storage.createUser({
              email,
              name,
              picture,
              googleId: profile.id,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user ID to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session ID
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  return passport;
};

// Middleware to check if user is authenticated
export const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};
