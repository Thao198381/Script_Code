// 1. LINK CODE TỔNG (Dùng link Raw để lấy code thuần túy)
const GITHUB_URL = "https://raw.githubusercontent.com/Thao198381/Script_Code/main/code.js";

// =====================ADMIN =======================================================
const SPREADSHEET_ID_ADMIN = "1d9vgkQBSfJR8Hhi74MEwiMHcQKFkSZRUyC4663qThtw";
const ssAdmin = SpreadsheetApp.openById(SPREADSHEET_ID_ADMIN);
const ss = SpreadsheetApp.openById(SPREADSHEET_ID_ADMIN);

const idadmin = "admin";
const passAdmin = "H11111@";
// =================================================================================
/**
 * GOOGLE APPS SCRIPT (GAS) BACKEND CODE
 * 
 * Instructions:
 * 1. Open Google Sheets.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any existing code and paste this.
 * 4. Create two sheets: "idgv" and "danhsach".
 * 5. "idgv" columns: idgv, Fullname, Pass, Môn
 * 6. "danhsach" columns: sbd, name, class, limit, limittab, idgv, taikhoanapp
 * 7. Click "Deploy" > "New Deployment".
 * 8. Select "Web app", set "Execute as" to "Me", and "Who has access" to "Anyone".
 * 9. Copy the Web App URL and paste it into the React app's GAS_URL variable.
 */

function loadAndExecute(fnName, e) {
  try {
    const timestamp = new Date().getTime();
    const response = UrlFetchApp.fetch(GITHUB_URL + "?t=" + timestamp);
    const code = response.getContentText();

    eval(code);

    if (fnName === "mainDoGet" && typeof mainDoGet === "function") {
      return mainDoGet(e);
    }

    if (fnName === "mainDoPost" && typeof mainDoPost === "function") {
      return mainDoPost(e);
    }

    throw new Error("Không tìm thấy hàm " + fnName);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return loadAndExecute("mainDoGet", e);
}

function doPost(e) {
  return loadAndExecute("mainDoPost", e);
}



