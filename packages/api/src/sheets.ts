import fs from 'fs';
import { AuthClient, GoogleAuth } from 'google-auth-library';
import { Compute } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google } from 'googleapis';

let auth: any, authClient: any;

const googleSheetsInstance = google.sheets({ version: 'v4', auth: authClient });
const SPREADSHEET_ID = '1oea4kZDbMp4iObTgSYH6BbQnLu7Psl_t1ro-4xQjQRc';

export async function authorizeGoogleSheets() {
  auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  authClient = await auth.getClient();
}

export async function getSheetData() {
  if (!authClient) return;

  const res = await googleSheetsInstance.spreadsheets.values.get({
    auth, //auth object
    spreadsheetId: SPREADSHEET_ID, // spreadsheet id
    range: 'Sheet1!A2:Z', //range of cells to read from.
  });

  return res.data.values;
}

export async function claimSpot(name: string, spot: number, licensePlate: string) {
  if (!authClient) return;

  const values = [[name, spot, licensePlate]];

  await googleSheetsInstance.spreadsheets.values.append({
    auth, //auth object
    spreadsheetId: SPREADSHEET_ID, // spreadsheet id
    range: 'Sheet1!A2:Z', //range of cells to read from.
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: values,
    },
  });
}

export async function getClaimedSpots() {
  const data = await getSheetData();
  return data?.map((r) => parseInt(r[1])).filter((n) => !isNaN(n));
}
