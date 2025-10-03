import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    calendarAccessToken?: string;
    calendarRefreshToken?: string;
    calendarExpiresAt?: number;
  }

  interface JWT {
    calendarAccessToken?: string;
    calendarRefreshToken?: string;
    calendarExpiresAt?: number;
  }
}
