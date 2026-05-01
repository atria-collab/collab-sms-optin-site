/**
 * COLLAB AI LEASING ASSISTANT — Google Apps Script Backend
 * 
 * Handles:
 * 1. POST: Form submissions → stored in Google Sheet
 * 2. GET?verify=TOKEN: Email verification flow
 * 3. Weekly trigger: Sends lead report to leasing@collabhome.io
 * 
 * Deploy as: Web App > Execute as: Me > Who has access: Anyone
 */

// ============================================================
// CONFIG
// ============================================================
var CONFIG = {
  SPREADSHEET_NAME: 'Collab AI Leasing — Lead Database',
  SHEET_NAME: 'Submissions',
  REPORT_EMAIL: 'leasing@collabhome.io',
  FROM_EMAIL: 'atria.collab@collabhome.io',
  FROM_NAME: 'Collab AI Leasing Assistant',
  SITE_URL: 'https://atria-collab.github.io/collab-sms-optin-site/collab-ai-leasing-assistant/',
  PRODUCT_NAME: 'Collab AI Leasing Assistant'
};

// ============================================================
// SHEET COLUMNS
// ============================================================
var COLS = {
  TIMESTAMP: 1,
  NAME: 2,
  EMAIL: 3,
  PHONE: 4,
  CITY: 5,
  HOUSING: 6,
  TOKEN: 7,
  STATUS: 8,       // pending / verified
  VERIFIED_AT: 9,
  TC_ACCEPTED: 10,
  PRIVACY_ACCEPTED: 11,
  EMAIL_CONSENT: 12,
  SOURCE: 13
};

// ============================================================
// HANDLE POST (Form submission)
// ============================================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();
    
    // Check for duplicate email
    var existing = findRowByEmail(sheet, data.email);
    if (existing > 0) {
      return jsonResponse({ success: false, error: 'duplicate_email' });
    }
    
    // Generate unique verification token
    var token = Utilities.getUuid();
    
    // Append row
    sheet.appendRow([
      new Date(),                          // Timestamp
      data.name || '',                     // Name
      (data.email || '').toLowerCase(),    // Email
      data.phone || '',                    // Phone
      data.city || '',                     // City
      data.housing || '',                  // Housing status
      token,                               // Verification token
      'pending',                           // Status
      '',                                  // Verified at
      data.tc_accepted ? 'Yes' : 'No',    // T&C accepted
      data.privacy_accepted ? 'Yes' : 'No', // Privacy accepted
      data.email_consent ? 'Yes' : 'No',  // Email consent
      data.source || 'website'            // Source
    ]);
    
    // Send verification email
    sendVerificationEmail(data.name, data.email, token);
    
    return jsonResponse({ success: true, message: 'Submission received. Check your email to verify.' });
    
  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ============================================================
// HANDLE GET (Email verification)
// ============================================================
function doGet(e) {
  var token = e.parameter.verify;
  
  if (!token) {
    return HtmlService.createHtmlOutput('<p>Invalid request.</p>');
  }
  
  try {
    var sheet = getOrCreateSheet();
    var result = verifyToken(sheet, token);
    
    if (result.success) {
      // Send welcome confirmation email
      sendWelcomeEmail(result.name, result.email);
      
      // Redirect to site with verified=1 param
      return HtmlService.createHtmlOutput(
        '<html><head><meta http-equiv="refresh" content="0;url=' + CONFIG.SITE_URL + '?verified=1"></head>' +
        '<body>Email verified! Redirecting...</body></html>'
      );
    } else {
      return HtmlService.createHtmlOutput(
        '<html><body style="font-family:Arial;text-align:center;padding:60px;">' +
        '<h2>❌ Invalid or expired verification link.</h2>' +
        '<p>This link may have already been used or has expired.</p>' +
        '<a href="' + CONFIG.SITE_URL + '">Return to website</a></body></html>'
      );
    }
  } catch (err) {
    Logger.log('doGet error: ' + err.toString());
    return HtmlService.createHtmlOutput('<p>An error occurred. Please try again.</p>');
  }
}

// ============================================================
// VERIFY TOKEN
// ============================================================
function verifyToken(sheet, token) {
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    var rowToken = data[i][COLS.TOKEN - 1];
    var rowStatus = data[i][COLS.STATUS - 1];
    
    if (rowToken === token && rowStatus === 'pending') {
      // Mark as verified
      sheet.getRange(i + 1, COLS.STATUS).setValue('verified');
      sheet.getRange(i + 1, COLS.VERIFIED_AT).setValue(new Date());
      
      return {
        success: true,
        name: data[i][COLS.NAME - 1],
        email: data[i][COLS.EMAIL - 1]
      };
    }
    
    // Already verified
    if (rowToken === token && rowStatus === 'verified') {
      return {
        success: true,
        name: data[i][COLS.NAME - 1],
        email: data[i][COLS.EMAIL - 1],
        alreadyVerified: true
      };
    }
  }
  
  return { success: false };
}

// ============================================================
// SEND VERIFICATION EMAIL
// ============================================================
function sendVerificationEmail(name, email, token) {
  var scriptUrl = ScriptApp.getService().getUrl();
  var verifyUrl = scriptUrl + '?verify=' + token;
  var firstName = name ? name.split(' ')[0] : 'there';
  
  var subject = 'Verify your email — ' + CONFIG.PRODUCT_NAME + ' Sweepstakes';
  
  var htmlBody = 
    '<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">' +
    '<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">' +
    '<div style="background:linear-gradient(135deg,#0d1117,#1a2a2a);padding:32px 40px;text-align:center;">' +
    '<div style="font-size:36px;margin-bottom:12px;">🏡</div>' +
    '<h1 style="color:#fff;font-size:22px;margin:0;font-weight:700;">' + CONFIG.PRODUCT_NAME + '</h1>' +
    '<p style="color:#00BFA5;font-size:14px;margin:8px 0 0;">Sweepstakes Entry Confirmation</p>' +
    '</div>' +
    '<div style="padding:36px 40px;">' +
    '<h2 style="font-size:20px;color:#1a1a1a;margin:0 0 16px;">Hi ' + firstName + '! 👋</h2>' +
    '<p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">Thank you for entering the <strong>Collab AI Leasing Assistant Sweepstakes</strong>! You\'re one step away from completing your entry.</p>' +
    '<p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 28px;"><strong>Please verify your email address</strong> to complete your sweepstakes registration. Only verified entries will be included in the official sweepstakes list.</p>' +
    '<div style="text-align:center;margin:32px 0;">' +
    '<a href="' + verifyUrl + '" style="display:inline-block;background:#00BFA5;color:#fff;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">✓ Verify My Email</a>' +
    '</div>' +
    '<p style="color:#888;font-size:13px;line-height:1.6;margin:0 0 8px;">Or copy and paste this link into your browser:</p>' +
    '<p style="color:#00BFA5;font-size:12px;word-break:break-all;margin:0 0 28px;">' + verifyUrl + '</p>' +
    '<hr style="border:none;border-top:1px solid #eee;margin:28px 0;">' +
    '<div style="background:#f8f9fa;border-radius:8px;padding:20px;margin-bottom:20px;">' +
    '<p style="font-size:13px;color:#555;margin:0 0 8px;font-weight:700;">🎉 What you could win:</p>' +
    '<p style="font-size:14px;color:#333;margin:0;">First 200 winners receive <strong>3 months of Collab AI Leasing Assistant for $1</strong> — including AI Lease Review, Roommate Matching, and Deposit Return Guidance.</p>' +
    '</div>' +
    '<p style="color:#999;font-size:12px;line-height:1.6;margin:0;">Questions? Contact us at <a href="mailto:atria.collab@collabhome.io" style="color:#00BFA5;">atria.collab@collabhome.io</a></p>' +
    '</div>' +
    '<div style="background:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;">' +
    '<p style="color:#aaa;font-size:11px;margin:0;">&copy; 2025 Collab Home. Your privacy is protected — we never sell your data.</p>' +
    '</div>' +
    '</div></body></html>';
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: CONFIG.FROM_NAME,
    replyTo: CONFIG.FROM_EMAIL
  });
}

// ============================================================
// SEND WELCOME EMAIL (after verification)
// ============================================================
function sendWelcomeEmail(name, email) {
  var firstName = name ? name.split(' ')[0] : 'there';
  var subject = '🎉 You\'re in! — ' + CONFIG.PRODUCT_NAME + ' Sweepstakes';
  
  var htmlBody = 
    '<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">' +
    '<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">' +
    '<div style="background:linear-gradient(135deg,#0d1117,#1a2a2a);padding:32px 40px;text-align:center;">' +
    '<div style="font-size:42px;margin-bottom:12px;">🎉</div>' +
    '<h1 style="color:#fff;font-size:22px;margin:0;font-weight:700;">You\'re Verified!</h1>' +
    '<p style="color:#00BFA5;font-size:14px;margin:8px 0 0;">' + CONFIG.PRODUCT_NAME + ' Sweepstakes</p>' +
    '</div>' +
    '<div style="padding:36px 40px;">' +
    '<h2 style="font-size:20px;color:#1a1a1a;margin:0 0 16px;">Congratulations, ' + firstName + '! 🏡</h2>' +
    '<p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">Your email has been verified and your sweepstakes entry is now <strong style="color:#00BFA5;">officially registered</strong>. You\'re in the running!</p>' +
    '<div style="background:linear-gradient(135deg,rgba(0,191,165,0.08),rgba(37,211,102,0.05));border:1px solid rgba(0,191,165,0.3);border-radius:10px;padding:24px;margin:24px 0;">' +
    '<p style="font-size:14px;font-weight:700;color:#00BFA5;margin:0 0 12px;">🏆 Prize Details</p>' +
    '<p style="font-size:15px;color:#333;margin:0 0 10px;">First <strong>200 winners</strong> will receive:</p>' +
    '<ul style="font-size:14px;color:#555;line-height:1.8;margin:0;padding-left:20px;">' +
    '<li>3 months of Collab AI Leasing Assistant for <strong>$1</strong></li>' +
    '<li>Full access to all 12 stages of the renter journey</li>' +
    '<li>AI-powered Lease Review (normally our highest-value feature)</li>' +
    '<li>Roommate Matching & Deposit Return Guidance</li>' +
    '</ul>' +
    '</div>' +
    '<p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 12px;">We\'ll notify you as the launch gets closer. In the meantime, <a href="' + CONFIG.SITE_URL + '" style="color:#00BFA5;font-weight:700;">explore how Collab AI works</a>.</p>' +
    '<p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 28px;"><strong>One more friend in your WhatsApp. The one who knows everything about renting. 🏡</strong></p>' +
    '<hr style="border:none;border-top:1px solid #eee;margin:28px 0;">' +
    '<p style="color:#999;font-size:12px;line-height:1.6;margin:0;">Questions? Contact us at <a href="mailto:atria.collab@collabhome.io" style="color:#00BFA5;">atria.collab@collabhome.io</a></p>' +
    '</div>' +
    '<div style="background:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;">' +
    '<p style="color:#aaa;font-size:11px;margin:0;">&copy; 2025 Collab Home. Your privacy is protected — we never sell your data. | <a href="' + CONFIG.SITE_URL + 'privacy.html" style="color:#aaa;">Privacy Policy</a></p>' +
    '</div>' +
    '</div></body></html>';
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: CONFIG.FROM_NAME,
    replyTo: CONFIG.FROM_EMAIL
  });
}

// ============================================================
// WEEKLY REPORT (triggered every Monday)
// ============================================================
function sendWeeklyReport() {
  var sheet = getOrCreateSheet();
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No submissions to report.');
    return;
  }
  
  var headers = data[0];
  var rows = data.slice(1);
  
  var totalSubmissions = rows.length;
  var verifiedCount = rows.filter(function(r) { return r[COLS.STATUS - 1] === 'verified'; }).length;
  var pendingCount = totalSubmissions - verifiedCount;
  
  // Build HTML table
  var tableRows = rows.map(function(row) {
    var status = row[COLS.STATUS - 1];
    var statusColor = status === 'verified' ? '#00BFA5' : '#ffa500';
    return '<tr style="border-bottom:1px solid #eee;">' +
      '<td style="padding:10px 12px;font-size:13px;">' + row[COLS.NAME - 1] + '</td>' +
      '<td style="padding:10px 12px;font-size:13px;">' + row[COLS.EMAIL - 1] + '</td>' +
      '<td style="padding:10px 12px;font-size:13px;">' + (row[COLS.PHONE - 1] || '—') + '</td>' +
      '<td style="padding:10px 12px;font-size:13px;">' + row[COLS.CITY - 1] + '</td>' +
      '<td style="padding:10px 12px;font-size:13px;">' + row[COLS.HOUSING - 1] + '</td>' +
      '<td style="padding:10px 12px;font-size:13px;">' + new Date(row[COLS.TIMESTAMP - 1]).toLocaleDateString() + '</td>' +
      '<td style="padding:10px 12px;font-size:13px;color:' + statusColor + ';font-weight:700;">' + status + '</td>' +
      '</tr>';
  }).join('');
  
  var htmlBody = 
    '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;padding:20px;">' +
    '<h2 style="color:#00BFA5;">📊 Collab AI Leasing Assistant — Weekly Lead Report</h2>' +
    '<p style="color:#555;">Generated: ' + new Date().toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'}) + '</p>' +
    '<div style="display:flex;gap:20px;margin:20px 0;">' +
    '<div style="background:#f0faf8;border:1px solid #00BFA5;border-radius:8px;padding:16px 24px;text-align:center;">' +
    '<div style="font-size:28px;font-weight:800;color:#00BFA5;">' + totalSubmissions + '</div>' +
    '<div style="font-size:12px;color:#555;">Total Entries</div>' +
    '</div>' +
    '<div style="background:#f0faf8;border:1px solid #25D366;border-radius:8px;padding:16px 24px;text-align:center;">' +
    '<div style="font-size:28px;font-weight:800;color:#25D366;">' + verifiedCount + '</div>' +
    '<div style="font-size:12px;color:#555;">Verified ✓</div>' +
    '</div>' +
    '<div style="background:#fff8f0;border:1px solid #ffa500;border-radius:8px;padding:16px 24px;text-align:center;">' +
    '<div style="font-size:28px;font-weight:800;color:#ffa500;">' + pendingCount + '</div>' +
    '<div style="font-size:12px;color:#555;">Pending Verification</div>' +
    '</div>' +
    '</div>' +
    '<table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;">' +
    '<thead>' +
    '<tr style="background:#0d1117;color:#fff;">' +
    '<th style="padding:12px;text-align:left;font-size:12px;">Name</th>' +
    '<th style="padding:12px;text-align:left;font-size:12px;">Email</th>' +
    '<th style="padding:12px;text-align:left;font-size:12px;">Phone</th>' +
    '<th style="padding:12px;text-align:left;font-size:12px;">Market</th>' +
    '<th style="padding:12px;text-align:left;font-size:12px;">Housing</th>' +
    '<th style="padding:12px;text-align:left;font-size:12px;">Submitted</th>' +
    '<th style="padding:12px;text-align:left;font-size:12px;">Status</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' + tableRows + '</tbody>' +
    '</table>' +
    '<p style="color:#aaa;font-size:12px;margin-top:24px;">Sent automatically every Monday. View the full sheet in Google Drive.</p>' +
    '</body></html>';
  
  MailApp.sendEmail({
    to: CONFIG.REPORT_EMAIL,
    subject: '📊 Weekly Lead Report — Collab AI Leasing Assistant (' + totalSubmissions + ' entries, ' + verifiedCount + ' verified)',
    htmlBody: htmlBody,
    name: CONFIG.FROM_NAME,
    replyTo: CONFIG.FROM_EMAIL
  });
  
  Logger.log('Weekly report sent to ' + CONFIG.REPORT_EMAIL);
}

// ============================================================
// SETUP WEEKLY TRIGGER (run once manually)
// ============================================================
function setupWeeklyTrigger() {
  // Delete existing triggers first
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendWeeklyReport') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Create weekly trigger (every Monday 8am)
  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();
  
  Logger.log('Weekly trigger set up for every Monday at 8am.');
}

// ============================================================
// HELPERS
// ============================================================
function getOrCreateSheet() {
  var files = DriveApp.getFilesByName(CONFIG.SPREADSHEET_NAME);
  var ss;
  
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    // Create new spreadsheet
    ss = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    var sheet = ss.getActiveSheet();
    sheet.setName(CONFIG.SHEET_NAME);
    
    // Add headers
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Phone', 'City', 'Housing Status',
      'Verification Token', 'Status', 'Verified At',
      'T&C Accepted', 'Privacy Accepted', 'Email Consent', 'Source'
    ]);
    
    // Style headers
    sheet.getRange(1, 1, 1, 13).setBackground('#0d1117').setFontColor('#00BFA5').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(7, 250); // Token column
    
    Logger.log('Created new spreadsheet: ' + CONFIG.SPREADSHEET_NAME);
  }
  
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  return sheet;
}

function findRowByEmail(sheet, email) {
  var data = sheet.getDataRange().getValues();
  var emailLower = (email || '').toLowerCase();
  for (var i = 1; i < data.length; i++) {
    if ((data[i][COLS.EMAIL - 1] || '').toLowerCase() === emailLower) {
      return i + 1; // 1-indexed row number
    }
  }
  return -1;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// TEST FUNCTIONS (run manually to test)
// ============================================================
function testPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '415-555-0123',
        city: 'San Francisco',
        housing: 'yes',
        tc_accepted: true,
        privacy_accepted: true,
        email_consent: true
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}

function testWeeklyReport() {
  sendWeeklyReport();
}

// ============================================================
// GMAIL TRIGGER: Auto-reply to sweepstakes submitters
// ============================================================
// Run this on a time-driven trigger (every 5-10 minutes).
// Watches leasing@collabhome.io for FormSubmit submission emails,
// sends an ack email to the submitter, then labels/archives.
// No web app access required — runs entirely internally.

function processNewSubmissions() {
  var label = getOrCreateLabel_('FormSubmit/Processed');
  var threads = GmailApp.search(
    'from:submissions@formsubmit.co subject:"New Sweepstakes Entry" -label:FormSubmit/Processed',
    0, 20
  );

  threads.forEach(function(thread) {
    var msgs = thread.getMessages();
    var body = msgs[0].getPlainBody();

    // Parse name and email from the table FormSubmit sends
    var name  = extractField_(body, 'name')  || 'there';
    var email = extractField_(body, 'email') || '';

    if (!email || !email.includes('@')) {
      Logger.log('Could not parse email from submission, skipping');
      thread.addLabel(label);
      return;
    }

    // Send ack email
    MailApp.sendEmail({
      to: email,
      replyTo: CONFIG.REPORT_EMAIL,
      name: CONFIG.FROM_NAME,
      subject: 'You\'re entered! Collab AI Leasing Assistant Sweepstakes 🎉',
      body: [
        'Hi ' + name + ',',
        '',
        'Thank you for entering the Collab AI Leasing Assistant sweepstakes! 🎉',
        '',
        'Your entry has been confirmed. We\'ll announce the winner soon.',
        '',
        'In the meantime, learn more about how Collab AI guides renters through every',
        'step of their rental journey — from search to deposit return:',
        CONFIG.SITE_URL,
        '',
        'Best,',
        'Collab AI Leasing Team',
        'leasing@collabhome.io'
      ].join('\n')
    });

    Logger.log('Sent ack to: ' + email + ' (' + name + ')');

    // Label as processed so we don't send twice
    thread.addLabel(label);
  });
}

// Helper: parse a field value from FormSubmit's table-style email body
// FormSubmit sends: "Name\tValue\nname\tQian Wang\nemail\t..."
// Must be case-SENSITIVE so lowercase "name" doesn't match header row "Name → Value"
function extractField_(body, fieldName) {
  var patterns = [
    new RegExp('\\b' + fieldName + '\\t([^\\n]+)'),          // tab-separated (no 'i' flag)
    new RegExp('\\b' + fieldName + '\\s{2,}([^\\n\\t]+)')    // 2+ space-separated
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = body.match(patterns[i]);
    if (m && m[1] && m[1].trim()) return m[1].trim();
  }
  return '';
}

// Helper: get or create a Gmail label
function getOrCreateLabel_(labelName) {
  var label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
  }
  return label;
}

// One-time setup: create the trigger that runs processNewSubmissions every 10 min
function setupAckTrigger() {
  // Remove existing ack triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'processNewSubmissions') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('processNewSubmissions')
    .timeBased()
    .everyMinutes(10)
    .create();
  Logger.log('Ack trigger created: processNewSubmissions every 10 min');
}
