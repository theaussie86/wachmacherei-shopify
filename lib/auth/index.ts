import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope:
            'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Email-Validierung für erlaubte Benutzer
      const { email } = user;
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',');

      if (!allowedEmails || !email) return false;

      return allowedEmails.includes(email);
    },
    async jwt({ token, account, user }) {
      // Speichere sowohl Login- als auch Calendar-Token
      if (account?.provider === 'google') {
        token.calendarAccessToken = account.access_token;
        token.calendarRefreshToken = account.refresh_token;
        token.calendarExpiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Füge Calendar-Token zur Session hinzu
      if (token.calendarAccessToken) {
        session.calendarAccessToken = token.calendarAccessToken as string;
        session.calendarRefreshToken = token.calendarRefreshToken as string;
        session.calendarExpiresAt = token.calendarExpiresAt as number;
      }
      return session;
    }
  }
});
