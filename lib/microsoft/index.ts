'use server';

export async function getMicrosoftAccessToken() {
  try {
    console.log('Getting Microsoft access token');
    console.log('MS_CLIENT_ID:', process.env.MS_CLIENT_ID);
    console.log('MS_CLIENT_SECRET:', process.env.MS_CLIENT_SECRET);

    if (!process.env.MS_CLIENT_ID) {
      throw new Error(`MS_CLIENT_ID is not set`);
    }
    if (!process.env.MS_CLIENT_SECRET) {
      throw new Error('MICROSOFT_CLIENT_SECRET is not set');
    }
    const credentials = {
      client_id: process.env.MS_CLIENT_ID,
      client_secret: process.env.MS_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials'
    };
    const url = `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(credentials)
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Microsoft access token:', error);
    throw error;
  }
}

export async function sendMicrosoftEmail({
  token,
  from,
  subject,
  body
}: {
  token: string;
  from: string;
  subject: string;
  body: string;
}) {
  try {
    if (!process.env.MS_USER_ID) {
      throw new Error('MS_USER_ID is not set');
    }
    const url = `https://graph.microsoft.com/v1.0/users/${process.env.MS_USER_ID}/sendMail`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          subject,
          toRecipients: [
            { emailAddress: { address: process.env.MS_CONTACT_EMAIL || 'MISSING_CONTACT_EMAIL' } }
          ],
          replyTo: [{ emailAddress: { address: from } }],
          body: { contentType: 'HTML', content: body }
        },
        saveToSentItems: 'true'
      })
    });
    if (!response.ok) {
      throw new Error(
        `Microsoft email failed with status ${response.status} and body ${await response.text()}`
      );
    }
  } catch (error) {
    console.error('Error sending Microsoft email:', error);
    throw error;
  }
}

export async function sendContactEmail({
  name,
  email,
  message
}: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const token = await getMicrosoftAccessToken();
    const body = `
      <html>
        <body>
          <p>${message}</p>
          <p>From:<br>
             ${name}<br>
             <a href="mailto:${email}">${email}</a>
          </p>
        </body>
      </html>`;
    await sendMicrosoftEmail({
      token,
      from: email,
      subject: `Kontaktanfrage von ${name}`,
      body
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
}
