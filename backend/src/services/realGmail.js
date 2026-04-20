import { google } from 'googleapis';

function getOAuthClient(accessToken, refreshToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  return oauth2Client;
}

export async function fetchRealEmails(accessToken, refreshToken) {
  const auth = getOAuthClient(accessToken, refreshToken);
  const gmail = google.gmail({ version: 'v1', auth });

  // List last 20 messages from inbox
  const listRes = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 20,
    labelIds: ['INBOX']
  });

  if (!listRes.data.messages) return [];

  // Fetch each message in full
  const emails = await Promise.all(
    listRes.data.messages.map(async (msg) => {
      const msgRes = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full'
      });

      const payload = msgRes.data.payload;
      const headers = payload.headers;
      const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

      // Body extraction helper
      const getBody = (payload) => {
        let body = '';
        if (payload.parts) {
          // Look for text/plain first, then text/html
          const textPart = payload.parts.find(p => p.mimeType === 'text/plain');
          const htmlPart = payload.parts.find(p => p.mimeType === 'text/html');
          
          if (textPart && textPart.body.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString('utf8');
          } else if (htmlPart && htmlPart.body.data) {
            body = Buffer.from(htmlPart.body.data, 'base64').toString('utf8');
          } else {
            // Recursive check for nested parts
            for (const part of payload.parts) {
              const nestedBody = getBody(part);
              if (nestedBody) return nestedBody;
            }
          }
        } else if (payload.body && payload.body.data) {
          body = Buffer.from(payload.body.data, 'base64').toString('utf8');
        }
        return body;
      };

      return {
        gmailId: msg.id,
        subject: getHeader('Subject') || '(no subject)',
        sender: getHeader('From'),
        snippet: msgRes.data.snippet,
        body: getBody(payload),
        date: new Date(getHeader('Date')),
        isRead: !msgRes.data.labelIds?.includes('UNREAD')
      };
    })
  );

  return emails;
}
