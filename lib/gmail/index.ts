import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const GMAIL_ADRESS = 'wachmacherei@gmail.com';
const CONTACT_ADRESS = 'kaffee@wachmacherei.de';

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  'use server';
  const auth = new google.auth.OAuth2({
    clientId: process.env.GAPI_CLIENT_ID,
    clientSecret: process.env.GAPI_CLIENT_SECRET,
    redirectUri: 'https://developers.google.com/oauthplayground'
  });
  auth.setCredentials({
    refresh_token: process.env.GAPI_REFRESH_TOKEN
  });

  return auth;
}

export async function sendEmail(
  auth: OAuth2Client,
  data: { name: string; email: string; message: string }
) {
  const gmail = google.gmail({ version: 'v1', auth });

  const messageParts = [
    `From: ${data.name} <${GMAIL_ADRESS}>`,
    `To: Wachmacherei <${CONTACT_ADRESS}>`,
    `Reply-To: ${data.name} <${data.email}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: Kontaktanfrage von ${data.name}`
  ];

  // Email body in HTML format
  const htmlBody = `
      <html>
        <body>
          Hallo Bernd,<br>
          du hast eine neue Kontaktanfrage von deiner Website erhalten:</p>
          <p>Nachricht:<br>
          ${data.message}</p>
          <p>Von:<br>
             ${data.name}<br>
             <a href="mailto:${data.email}">${data.email}</a>
          </p>
        </body>
      </html>`;

  // Combine headers and body
  const message = `${messageParts.join('\n')}\n\n${htmlBody}`;
  // const message = messageParts.join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage
    }
  });
}
