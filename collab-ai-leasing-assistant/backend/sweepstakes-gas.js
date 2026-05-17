/**
 * COLLAB AI LEASING ASSISTANT — Sweepstakes Form Backend
 * Google Apps Script Web App
 *
 * SETUP INSTRUCTIONS:
 * ==================
 * 1. Open the Google Sheet:
 *    https://docs.google.com/spreadsheets/d/11Mvf9TpL618kNBSDf_Zfn_1R4ejpY9OoYmaXKpnyuoU/edit
 *
 * 2. Click Extensions → Apps Script
 *
 * 3. Delete any existing code. Paste this entire file.
 *
 * 4. Click Deploy → New Deployment
 *    - Type: Web app
 *    - Execute as: Me (atria.collab@collabhome.io)
 *    - Who has access: Anyone
 *    - Click Deploy → Authorize → Allow
 *
 * 5. Copy the Web App URL (looks like: https://script.google.com/macros/s/AKfycb.../exec)
 *
 * 6. Send the URL to the AI assistant — it will update the form endpoint automatically.
 *
 * WHAT IT DOES:
 * - Appends each submission as a new row in the Google Sheet
 * - Sends notification email to leasing@collabhome.io
 * - Sends confirmation email to the submitter
 * - Returns JSON so the form shows the inline success screen
 */

var SHEET_ID = '11Mvf9TpL618kNBSDf_Zfn_1R4ejpY9OoYmaXKpnyuoU';
var NOTIFY_EMAIL = 'leasing@collabhome.io';
var SHEET_NAME = 'Sweepstakes'; // will be created if it doesn't exist

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // Parse incoming JSON
    var data = JSON.parse(e.postData.contents);

    var name      = data.name      || '';
    var email     = data.email     || '';
    var phone     = data.phone     || '';
    var city      = data.city      || '';
    var housing   = data.housing   || '';
    var timestamp = data.timestamp || new Date().toISOString();

    // ── 1. Write to Google Sheet ──────────────────────────────────────────────
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'City', 'Housing Status', 'Source']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }

    sheet.appendRow([timestamp, name, email, phone, city, housing, 'Sweepstakes Form']);

    // ── 2. Notify leasing team ───────────────────────────────────────────────
    var housingLabel = {
      'yes':  'Yes, actively searching',
      'soon': 'Planning to search soon',
      'no':   'Not currently searching'
    }[housing] || housing;

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: '🎉 New Sweepstakes Entry: ' + name,
      htmlBody:
        '<h2 style="color:#6c63ff">New Sweepstakes Entry</h2>' +
        '<table style="border-collapse:collapse;width:100%;max-width:500px">' +
        row('Name',           name) +
        row('Email',          '<a href="mailto:' + email + '">' + email + '</a>') +
        row('Phone',          phone || '—') +
        row('City',           city) +
        row('Housing Status', housingLabel) +
        row('Submitted',      timestamp) +
        '</table>' +
        '<p style="margin-top:24px"><a href="https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit" ' +
        'style="background:#6c63ff;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">' +
        'View Google Sheet →</a></p>'
    });

    // ── 3. Confirm to submitter ──────────────────────────────────────────────
    if (email) {
      MailApp.sendEmail({
        to: email,
        replyTo: NOTIFY_EMAIL,
        subject: "You're entered! Collab AI Leasing Assistant Sweepstakes 🎉",
        htmlBody:
          '<div style="font-family:sans-serif;max-width:560px;margin:0 auto">' +
          '<h2 style="color:#6c63ff">You\'re In, ' + name.split(' ')[0] + '! 🎉</h2>' +
          '<p>Thank you for entering the <strong>Collab AI Leasing Assistant Sweepstakes</strong>.</p>' +
          '<p>The first 200 winners will get <strong>3 months of Collab AI for $1</strong> — ' +
          'full access to all 12 stages of the renter journey.</p>' +
          '<p>We\'ll be in touch with results soon. In the meantime, explore the platform:</p>' +
          '<p><a href="https://ai-leasing-assistant.collabhome.io/collab-ai-leasing-assistant/" ' +
          'style="background:#6c63ff;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">' +
          'Learn More →</a></p>' +
          '<hr style="margin:32px 0;border:none;border-top:1px solid #eee">' +
          '<p style="font-size:12px;color:#888">Questions? Reply to this email or contact us at ' +
          '<a href="mailto:' + NOTIFY_EMAIL + '">' + NOTIFY_EMAIL + '</a></p>' +
          '</div>'
      });
    }

    output.setContent(JSON.stringify({ success: true, message: 'Entry recorded.' }));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, message: err.toString() }));
  }

  return output;
}

// CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Collab AI Sweepstakes endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function row(label, value) {
  return '<tr>' +
    '<td style="padding:8px 12px;border:1px solid #eee;font-weight:bold;background:#f9f9f9;width:140px">' + label + '</td>' +
    '<td style="padding:8px 12px;border:1px solid #eee">' + value + '</td>' +
    '</tr>';
}
