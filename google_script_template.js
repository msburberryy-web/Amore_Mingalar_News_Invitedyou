// 1. Open your Google Sheet (the one you want RSVPs written into)
// 2. Copy the Sheet ID out of its URL:
//    https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
// 3. From that SAME Sheet, go to Extensions > Apps Script
//    (opening it this way matters less now since we target by ID below,
//    but always open it from the Sheet itself, never a separate blank
//    script project)
// 4. Paste this entire code there, replacing SHEET_ID below with the ID
//    you copied in step 2
// 5. Click Deploy > New Deployment > Select type: Web App
// 6. Set 'Execute as' to 'Me' and 'Who has access' to 'Anyone' -> Deploy
// 7. If prompted, click through the authorization screen
//    (Advanced > Go to project (unsafe) is expected/normal for your own script)
// 8. Copy the Web App URL (ends in /exec) and paste it into wedding-data_*.json
//    as "googleScriptUrl"
//
// After ANY future edit to this code, you must redeploy for changes to take
// effect: Deploy > Manage deployments > pencil icon > New version > Deploy.
// Saving the script alone does NOT update the live URL.
//
// To sanity-check a deployment without submitting the form, just open the
// /exec URL directly in a browser — you should see "RSVP endpoint is live."

const SHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = ''; // leave blank to use the first tab, or set an exact tab name

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];

    // Create headers if they don't exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Attendance",
        "Full Name",
        "Email",
        "Phone",
        "Guests",
        "Guest Info",
        "Message"
      ]);
    }

    // Extract data from the request
    var p = e.parameter;

    sheet.appendRow([
      new Date(),
      p.attendance || '',   // 'attend' or 'decline'
      p.full_name || '',
      p.email || '',
      p.phone || '',
      p.guests || '',
      p.guest_info || '',
      p.message || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Logged in Apps Script's "Executions" tab even though the website
    // can't see it (it submits with mode: 'no-cors').
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you confirm the deployment is live by just opening the URL in a browser.
function doGet(e) {
  return ContentService.createTextOutput('RSVP endpoint is live.');
}
