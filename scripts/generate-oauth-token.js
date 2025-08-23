#!/usr/bin/env node

/**
 * Hilfsskript zum Generieren des initialen OAuth2-Tokens
 *
 * Führe dieses Skript einmal aus, um den Refresh Token zu erhalten:
 * node scripts/generate-oauth-token.js
 */

// Lade .env.local Datei
require('dotenv').config({ path: '.env.local' });

const { google } = require('googleapis');
const readline = require('readline');

// Überprüfe, ob alle erforderlichen Umgebungsvariablen gesetzt sind
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ Fehlende Umgebungsvariablen!');
  console.error('');
  console.error('Stelle sicher, dass diese Variablen in deiner .env.local Datei gesetzt sind:');
  console.error('- GOOGLE_CLIENT_ID');
  console.error('- GOOGLE_CLIENT_SECRET');
  console.error('');
  console.error(
    'Falls du sie noch nicht hast, erstelle zuerst einen OAuth2 Client in der Google Cloud Console.'
  );
  process.exit(1);
}

// OAuth2 Client konfigurieren
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback'
);

// Scopes für Google Calendar
const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events'
];

// URL für die Autorisierung generieren
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent' // Wichtig: Erzwingt die Generierung eines Refresh Tokens
});

console.log('🔐 Google OAuth2 Autorisierung erforderlich');
console.log('');
console.log('✅ Umgebungsvariablen gefunden:');
console.log(`   Client ID: ${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...`);
console.log(
  `   Redirect URI: ${process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback'}`
);
console.log('');
console.log('1. Öffne diese URL in deinem Browser:');
console.log(authUrl);
console.log('');
console.log('2. Melde dich mit dem Google-Konto an, das den Kalender verwaltet');
console.log('3. Erlaube den Zugriff auf den Kalender');
console.log('4. Kopiere den Authorization Code aus der URL');
console.log('');

// Interaktive Eingabe des Authorization Codes
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Gib den Authorization Code ein: ', async (code) => {
  try {
    // Authorization Code gegen Access Token und Refresh Token eintauschen
    const { tokens } = await oauth2Client.getToken(code);

    console.log('');
    console.log('✅ OAuth2-Tokens erfolgreich generiert!');
    console.log('');
    console.log('Füge diese Umgebungsvariable zu deiner .env.local Datei hinzu:');
    console.log('');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('');
    console.log(
      '⚠️  WICHTIG: Der Refresh Token läuft nie ab und kann immer wieder verwendet werden.'
    );
    console.log('   Bewahre ihn sicher auf und teile ihn nicht mit anderen.');
  } catch (error) {
    console.error('❌ Fehler beim Generieren der Tokens:', error.message);
  } finally {
    rl.close();
  }
});
