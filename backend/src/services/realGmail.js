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
        format: 'metadata',
        metadataHeaders: ['Subject', 'From', 'Date']
      });

      const headers = msgRes.data.payload.headers;
      const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

      return {
        gmailId: msg.id,
        subject: getHeader('Subject') || '(no subject)',
        sender: getHeader('From'),
        snippet: msgRes.data.snippet,
        date: new Date(getHeader('Date')),
        isRead: !msgRes.data.labelIds?.includes('UNREAD')
      };
    })
  );

  return emails;
}
