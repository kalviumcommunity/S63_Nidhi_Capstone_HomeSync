/**
 * Google OAuth configuration
 */
module.exports = {
  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'homesync-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },
  
  // Google OAuth credentials
  // These would typically come from environment variables
  oauth: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  }
};