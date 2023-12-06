import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export default new GoogleSpreadsheet(
  process.env.GOOGLE_SHEET_ID,
  serviceAccountAuth,
);