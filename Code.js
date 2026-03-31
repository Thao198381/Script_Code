// --- FILE TỔNG TRÊN GITHUB ---

function mainDoGet(e) {
return ContentService.createTextOutput("GAS is running").setMimeType(ContentService.MimeType.TEXT);
}
  
function mainDoPost(e) {
// 1. Parse toàn bộ nội dung gửi lên
  const contents = JSON.parse(e.postData.contents || "{}");

  // 2. Lấy action
  const action = (contents.action || e.parameter.action || "").toString();

  // 3. ĐÂY LÀ CHÌA KHÓA: 
  // Nếu React gửi { action, data: {...} } thì ta lấy data bên trong.
  // Nếu React gửi kiểu phẳng { action, idgv, ... } thì lấy chính nó.
  const data = contents.data || contents;  
  if (action === "registerTeacher") {
    var sheet = ssAdmin.getSheetByName("idgv");
    if (!sheet) throw new Error("Không tìm thấy sheet idgv");
    
    // 1. Kiểm tra dữ liệu đầu vào cơ bản
    if (!data || !data.idgv) throw new Error("Dữ liệu gửi lên bị trống");

    // 2. Lấy toàn bộ cột ID (Cột A) để kiểm tra trùng
    // getValues() trả về mảng 2 chiều [[id1], [id2], ...]
    var values = sheet.getRange("A:A").getValues();
    
    // Sử dụng some() để kiểm tra nhanh xem ID đã tồn tại chưa
    // Lưu ý: data.idgv từ React gửi lên thường là string, so sánh với giá trị trong sheet
    var isExisting = values.some(function(row) {
      return row[0].toString() === data.idgv.toString();
    });

    if (isExisting) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        message: "Mã giáo viên (idgv) này đã tồn tại trên hệ thống!" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Nếu chưa tồn tại thì mới thêm hàng mới
    sheet.appendRow(["'" + data.idgv, data.fullname, data.pass, data.subject]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
                         .setMimeType(ContentService.MimeType.JSON);
}
  
  if (action === "loginTeacher") {
    var sheet = ss.getSheetByName("idgv");
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] == data.idgv && values[i][2] == data.pass) {
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          user: { idgv: values[i][0], fullname: values[i][1], subject: values[i][3] } 
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Sai tài khoản hoặc mật khẩu" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "loginStudent") {
    var sheet = ss.getSheetByName("danhsach");
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] == data.sbd && values[i][5] == data.idgv) {
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          student: { sbd: values[i][0], name: values[i][1], class: values[i][2], idgv: values[i][5] } 
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Sai SBD hoặc IDGV" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "uploadStudents") {
    var sheet = ss.getSheetByName("danhsach");
    data.students.forEach(function(student) {
      sheet.appendRow([student.sbd, student.name, student.class, student.limit, student.limittab, student.idgv, student.taikhoanapp]);
    });
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "deleteStudent") {
    var sheet = ss.getSheetByName("danhsach");
    var values = sheet.getDataRange().getValues();
    for (var i = values.length - 1; i >= 1; i--) {
      if (values[i][0] == data.sbd && values[i][5] == data.idgv) {
        sheet.deleteRow(i + 1);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "changePassword") {
    var sheet = ss.getSheetByName("idgv");
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] == data.idgv) {
        sheet.getRange(i + 1, 3).setValue(data.newPass);
        return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(ContentService.MimeType.JSON);
  }
}
// #09 CÁC HÀM PHỤ TRỢ (Để hết vào đây)
