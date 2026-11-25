// Paste into a Google Sheet: Extensions > Apps Script. Then Deploy > New deployment > Web app
// (Execute as: Me, Who has access: Anyone). Copy the Web app URL into GOOGLE_SCRIPT_URL.
const SECRET = "CHANGE_THIS_TO_A_LONG_RANDOM_TEXT"; // must equal GOOGLE_SCRIPT_SECRET
const OWNER = "vdn23022003@gmail.com";
const safe = v => /^[=+\-@]/.test(String(v || "")) ? "'" + v : String(v || ""); // blocks formula injection
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.secret !== SECRET) return out({ ok: false });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName("Enquiries") || ss.insertSheet("Enquiries");
  if (sh.getLastRow() === 0) sh.appendRow(["Time", "Name", "Email", "Phone", "Programme", "Status", "Message"]);
  sh.appendRow([new Date(), safe(d.name), safe(d.email), safe(d.phone), safe(d.programme), safe(d.status), safe(d.message)]);
  MailApp.sendEmail({ to: OWNER, replyTo: d.email, subject: "New KAIZO LABS enquiry: " + d.programme,
    body: ["Name: " + d.name, "Email: " + d.email, "Phone: " + d.phone, "Programme: " + d.programme, "Status: " + d.status, "", d.message].join("\n") });
  return out({ ok: true });
}
const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
