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
          scope: 'openid email profile'
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
      // Nur Login-Token speichern (keine Calendar-Token mehr)
      return token;
    },
    async session({ session, token }) {
      // Nur Standard-Session-Daten (keine Calendar-Token mehr)
      return session;
    }
  }
});
