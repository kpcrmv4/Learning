-- =====================================================
-- Seed: Google Apps Script Course
-- =====================================================

-- Course
INSERT INTO courses (id, title, slug, description, long_description, price, category, difficulty, is_published, sort_order, total_duration_minutes)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Google Apps Script ตั้งแต่เริ่มต้น จนสร้าง Web App ได้',
  'google-apps-script-beginner',
  'เรียนรู้ Google Apps Script ตั้งแต่ศูนย์ สร้าง Web App จริง ใช้ AI ช่วยเขียนโค้ด พร้อมโปรเจค Antigravity',
  'คอร์สนี้ออกแบบมาสำหรับคนที่ไม่เคยเขียนโค้ดมาก่อนเลย

เริ่มจากพื้นฐานจริงๆ ว่า Apps Script คืออะไร ใช้ทำอะไรได้บ้าง แล้วค่อยๆ ไล่ไปจนสร้างหน้าเว็บได้ ใช้ AI ช่วยเขียนโค้ดเป็น จบคอร์สด้วยโปรเจคจริงที่ใช้งานได้

สิ่งที่จะได้เรียน:
- พื้นฐาน Apps Script แบบเข้าใจง่าย
- Debug โค้ด ดู Log แก้ปัญหาที่เจอบ่อย
- สร้างหน้าเว็บใน Apps Script
- ใช้ AI ช่วยเขียนโค้ดและแก้ปัญหา
- โปรเจค Antigravity ลงมือทำจริง

ไม่ต้องมีพื้นฐานเขียนโค้ดมาก่อน แค่ใช้ Google Sheets เป็นก็พอ!',
  0,
  'google-apps-script',
  'beginner',
  true,
  1,
  180
) ON CONFLICT (id) DO NOTHING;
-- Part 1: Lesson 1
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Apps Script คืออะไร & สร้างตัวแรก',
  'Google Apps Script คืออะไร?

พูดง่ายๆ มันคือ "โค้ดที่สั่งงาน Google ได้" เช่น สั่งให้ Sheets ดึงข้อมูล, สั่งให้ส่งอีเมลอัตโนมัติ, หรือสร้างหน้าเว็บได้เลย โดยไม่ต้องเช่า server อะไรทั้งนั้น

ภาษาที่ใช้คือ JavaScript — ถ้าไม่เคยเขียนก็ไม่ต้องกลัว เราจะสอนไปพร้อมกัน


ประเภทของ Apps Script

1. Container-bound — ผูกกับ Google Sheets / Docs / Forms
   เปิดจาก: Extensions > Apps Script
   เหมาะกับ: ทำระบบอัตโนมัติให้ไฟล์นั้นๆ

2. Standalone — สร้างจาก script.google.com โดยตรง
   เหมาะกับ: โปรเจคที่ไม่ผูกกับไฟล์ใดไฟล์หนึ่ง

3. Web App — Deploy เป็นเว็บไซต์ได้
   เหมาะกับ: ทำหน้าเว็บ, ฟอร์ม, dashboard

[IMAGE: apps-script-types-comparison.png]


มาสร้าง Script ตัวแรกกัน

วิธีที่ 1: เปิดจาก Google Sheets
1. เปิด Google Sheets ขึ้นมา
2. ไปที่ Extensions > Apps Script
3. จะเจอหน้า Editor พร้อมไฟล์ Code.gs

[IMAGE: open-apps-script-from-sheets.png]

วิธีที่ 2: เปิดจาก script.google.com
1. เข้า script.google.com
2. กด New Project
3. จะได้โปรเจคเปล่าๆ พร้อมเขียน

[IMAGE: script-google-com-new-project.png]


ลองเขียนโค้ดแรก

พิมพ์โค้ดนี้ลงไปใน Code.gs:

function myFirstScript() {
  Logger.log("สวัสดี Apps Script!");
}

แล้วกดปุ่ม Run (รูปสามเหลี่ยม ▶)
ครั้งแรกจะขอ permission — กด Allow ได้เลย

[IMAGE: first-run-permission.png]

พอรันเสร็จ ไปดูผลที่ Execution log ด้านล่าง จะเห็นข้อความ "สวัสดี Apps Script!"

[IMAGE: execution-log-result.png]


โครงสร้างไฟล์ใน Apps Script

- Code.gs — ไฟล์โค้ดหลัก (สร้างเพิ่มได้)
- appsscript.json — ไฟล์ตั้งค่าโปรเจค (ปกติซ่อนอยู่)

ถ้าอยากเห็น appsscript.json ให้ไปที่ Project Settings > Show "appsscript.json" manifest file

[IMAGE: project-settings-manifest.png]


สรุปบทนี้
- Apps Script = JavaScript ที่สั่งงาน Google ได้
- มี 3 แบบ: Container-bound, Standalone, Web App
- สร้างได้จาก Extensions > Apps Script หรือ script.google.com
- ลองรัน function แรกด้วย Logger.log() สำเร็จแล้ว!',
  1, true, 15
) ON CONFLICT (id) DO NOTHING;
-- Part 1: Lesson 2
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'อ่าน/เขียนข้อมูล & Debug',
  'บทนี้จะเรียนเรื่องที่ใช้บ่อยที่สุด — อ่านข้อมูลจาก Sheet, เขียนข้อมูลกลับ, แล้วก็วิธี Debug โค้ด


getActiveSpreadsheet vs getSheetByName

มี 2 วิธีหลักในการเข้าถึง Sheet:

วิธีที่ 1: getActiveSpreadsheet()
var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

ใช้ได้ตอน: รันจาก Editor โดยตรง หรือใช้กับ onEdit/onOpen
ข้อจำกัด: ใช้ไม่ได้ตอน Deploy เป็น Web App (เพราะไม่มี "active" sheet)

วิธีที่ 2: openById() + getSheetByName()
var ss = SpreadsheetApp.openById("SHEET_ID_ตรงนี้");
var sheet = ss.getSheetByName("Sheet1");

ใช้ได้ทุกกรณี: ทั้งรันจาก Editor และ Deploy เป็น Web App
แนะนำ: ใช้วิธีนี้เป็นหลัก เพราะปลอดภัยกว่า

[IMAGE: get-sheet-id-from-url.png]

เอา SHEET_ID จากไหน?
เปิด Google Sheets แล้วดู URL:
https://docs.google.com/spreadsheets/d/SHEET_ID_อยู่ตรงนี้/edit
คัดลอกส่วนระหว่าง /d/ กับ /edit มาใส่


อ่านข้อมูลจาก Sheet

function readData() {
  var ss = SpreadsheetApp.openById("ใส่_SHEET_ID");
  var sheet = ss.getSheetByName("Sheet1");

  // อ่านค่าจากช่อง A1
  var value = sheet.getRange("A1").getValue();
  Logger.log(value);

  // อ่านค่าทั้งหมดในช่วง A1:C10
  var data = sheet.getRange("A1:C10").getValues();
  Logger.log(data);
}


เขียนข้อมูลลง Sheet

function writeData() {
  var ss = SpreadsheetApp.openById("ใส่_SHEET_ID");
  var sheet = ss.getSheetByName("Sheet1");

  // เขียนค่าลงช่อง A1
  sheet.getRange("A1").setValue("สวัสดี");

  // เขียนหลายช่องพร้อมกัน
  sheet.getRange("A2:C2").setValues([["ชื่อ", "อายุ", "แผนก"]]);
}


Debug — Logger.log vs console.log

Logger.log("ข้อความ")
- ดูผลได้ที่: Execution log ในหน้า Apps Script Editor
- เหมาะกับ: Debug โค้ดฝั่ง server (.gs)

[IMAGE: logger-log-execution-log.png]

console.log("ข้อความ")
- ดูผลได้ที่: กด F12 ในเบราว์เซอร์ > แท็บ Console
- เหมาะกับ: Debug โค้ดฝั่ง client (HTML/JavaScript ในหน้าเว็บ)

[IMAGE: f12-console-log.png]

เคล็ดลับ: ถ้าไม่รู้ว่าตัวแปรมีค่าอะไร ให้ Logger.log() ออกมาดูก่อนเสมอ


เก็บ Config ไว้ใน Sheet แทน Hardcode

แทนที่จะเขียนค่าตายตัวในโค้ด เช่น:
var email = "boss@company.com";  // ❌ hardcode

ให้สร้าง Sheet ชื่อ "Config" แล้วเก็บค่าไว้:
| Key          | Value              |
| admin_email  | boss@company.com   |
| sheet_name   | Data               |
| max_rows     | 100                |

แล้วอ่านค่ามาใช้:
function getConfig(key) {
  var ss = SpreadsheetApp.openById("ใส่_SHEET_ID");
  var sheet = ss.getSheetByName("Config");
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }
  return null;
}

// ใช้งาน
var email = getConfig("admin_email");

ข้อดี: แก้ค่าได้จาก Sheet โดยไม่ต้องแตะโค้ดเลย เหมาะมากเวลาส่งงานให้คนอื่นใช้


สรุปบทนี้
- ใช้ openById() + getSheetByName() ปลอดภัยกว่า getActiveSheet()
- อ่านข้อมูลด้วย getValue() / getValues()
- เขียนข้อมูลด้วย setValue() / setValues()
- Debug ฝั่ง server ใช้ Logger.log() ดูใน Execution log
- Debug ฝั่ง client ใช้ console.log() ดูใน F12 Console
- เก็บ config ไว้ใน Sheet แยก แทน hardcode ในโค้ด',
  2, false, 20
) ON CONFLICT (id) DO NOTHING;
-- Part 1: Lesson 3
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'ปัญหาที่เจอบ่อย — เลข 0 หาย & วันที่',
  'บทนี้รวมปัญหาที่มือใหม่เจอบ่อยมากๆ สองเรื่อง: เลข 0 หน้าหายไป กับ วันที่แสดงผลแปลกๆ


ปัญหา: เลข 0 หน้าหาย (Leading Zero)

เคยใส่เบอร์โทร 0812345678 ใน Sheet แล้วมันกลายเป็น 812345678 ไหม?
หรือรหัสบัตรประชาชนที่ขึ้นต้นด้วย 0 แล้ว 0 หายไป?

นั่นเพราะ Google Sheets ตีความว่ามันเป็น "ตัวเลข" แล้วตัด 0 หน้าทิ้ง

วิธีแก้มี 3 แบบ:

แบบที่ 1: Format เป็น Plain Text ก่อนใส่ข้อมูล
เลือกคอลัมน์ > Format > Number > Plain Text
แล้วค่อยใส่ข้อมูล เลข 0 จะไม่หาย

[IMAGE: format-plain-text.png]

แบบที่ 2: ใช้โค้ด setNumberFormat
function fixLeadingZero() {
  var ss = SpreadsheetApp.openById("ใส่_SHEET_ID");
  var sheet = ss.getSheetByName("Sheet1");

  // format คอลัมน์ B ทั้งคอลัมน์เป็น Plain Text
  sheet.getRange("B:B").setNumberFormat("@");

  // เขียนเบอร์โทรลงไป — 0 จะไม่หาย
  sheet.getRange("B2").setValue("0812345678");
}

เคล็ดลับ: "@" หมายถึง Plain Text — ต้อง setNumberFormat ก่อน setValue เสมอ!

แบบที่ 3: เติม '' (apostrophe) นำหน้า
พิมพ์ในช่อง: ''0812345678
Sheets จะเก็บเป็นข้อความ ไม่ตัด 0 ทิ้ง
(เครื่องหมาย '' จะไม่แสดงในช่อง)


ปัญหา: วันที่ (Date) แสดงผลแปลกๆ

ถ้า Logger.log() วันที่ออกมา อาจเจอแบบนี้:
  Thu Jan 01 2026 00:00:00 GMT+0700

อ่านยากมาก! แปลงให้สวยด้วย Utilities.formatDate()

function formatDateExample() {
  var now = new Date();

  // แปลงเป็นรูปแบบ วัน/เดือน/ปี
  var formatted = Utilities.formatDate(now, "Asia/Bangkok", "dd/MM/yyyy");
  Logger.log(formatted);  // 06/04/2026

  // แปลงเป็นรูปแบบ วัน/เดือน/ปี เวลา
  var withTime = Utilities.formatDate(now, "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss");
  Logger.log(withTime);  // 06/04/2026 14:30:00
}

สำคัญ: ต้องระบุ "Asia/Bangkok" เสมอ ไม่งั้นเวลาจะเพี้ยน!


รูปแบบวันที่ที่ใช้บ่อย

dd    = วันที่ (06)
MM    = เดือน (04)
yyyy  = ปี (2026)
HH    = ชั่วโมง 24 ชม. (14)
mm    = นาที (30)
ss    = วินาที (00)
E     = ชื่อวัน (Thu)


แปลง String เป็น Date

ถ้าอ่านค่าจาก Sheet มาเป็นข้อความ แล้วอยากแปลงเป็น Date:

function stringToDate() {
  var dateStr = "2026-04-06";
  var date = new Date(dateStr);
  Logger.log(date);
}

ระวัง! ถ้ารูปแบบเป็น dd/MM/yyyy (06/04/2026) ต้องแยก parse เอง:

function parseDateTH(str) {
  var parts = str.split("/");
  // parts[0]=วัน parts[1]=เดือน parts[2]=ปี
  return new Date(parts[2], parts[1] - 1, parts[0]);
}


เปรียบเทียบวันที่

function compareDates() {
  var date1 = new Date("2026-04-01");
  var date2 = new Date("2026-04-06");

  if (date1 < date2) {
    Logger.log("date1 มาก่อน date2");
  }

  // เช็คว่าเป็นวันเดียวกันไหม
  if (date1.getTime() === date2.getTime()) {
    Logger.log("วันเดียวกัน");
  }
}

เคล็ดลับ: ใช้ .getTime() เปรียบเทียบจะแม่นที่สุด


สรุปบทนี้
- เลข 0 หน้าหาย → format เป็น Plain Text หรือใช้ setNumberFormat("@")
- แปลงวันที่ด้วย Utilities.formatDate() + timezone "Asia/Bangkok"
- ระวังรูปแบบวันที่ไทย dd/MM/yyyy ต้อง parse เอง
- เปรียบเทียบวันที่ใช้ .getTime()',
  3, false, 15
) ON CONFLICT (id) DO NOTHING;
-- Part 1: Lesson 4
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000001',
  '/exec, /dev & Deploy',
  'ก่อนจะ Deploy ให้คนอื่นใช้ ต้องทดสอบก่อนเสมอ บทนี้จะสอนวิธีทดสอบและ Deploy


/exec — ทดสอบ function แบบเร็ว

ใช้รันทดสอบ function โดยไม่ต้อง Deploy ก่อน

วิธีใช้:
1. เขียน function ใน Code.gs
2. เลือก function ที่อยากรันจาก dropdown ด้านบน
3. กดปุ่ม Run (▶)

[IMAGE: select-function-and-run.png]

ผลลัพธ์จะแสดงใน Execution log ด้านล่าง
ถ้ามี error ก็จะแสดงตรงนี้เลย — แก้แล้วรันใหม่ได้ทันที


/dev — ทดสอบ Web App แบบ Draft

ถ้าสร้าง Web App อยู่ จะอยากดูหน้าเว็บก่อน Deploy จริง

วิธีใช้:
1. กด Deploy > Test deployments
2. จะได้ URL สำหรับทดสอบ (มีคำว่า /dev ต่อท้าย)
3. เปิด URL นั้นดู — จะเห็นหน้าเว็บล่าสุดเสมอ

[IMAGE: test-deployment-dev-url.png]

ข้อดีของ /dev:
- เห็นโค้ดล่าสุดทันที ไม่ต้อง Deploy version ใหม่ทุกครั้ง
- ไม่กระทบ URL ที่แจกคนอื่นไปแล้ว
- ใช้ทดสอบหน้าเว็บ, ดู layout, เช็คว่า function ทำงานถูก

ข้อจำกัด: ใช้ได้แค่เจ้าของ script เท่านั้น คนอื่นเปิดไม่ได้


Workflow ที่แนะนำ

  แก้โค้ด
     ↓
  ทดสอบ function ด้วย Run (▶)
     ↓
  ทดสอบหน้าเว็บด้วย Test deployments (/dev)
     ↓
  พอโอเคแล้ว → Deploy version ใหม่


Deploy as Web App

1. กด Deploy > New deployment
2. เลือก Type: Web app

[IMAGE: deploy-new-deployment.png]

3. ตั้งค่า:
   - Description: ใส่ชื่อ version เช่น "v1.0"
   - Execute as: Me (ใช้สิทธิ์ของเรา)
   - Who has access:
     - Only myself = เฉพาะตัวเอง
     - Anyone = ใครก็เปิดได้ (ไม่ต้อง login)
     - Anyone with Google account = ต้อง login Google ก่อน

4. กด Deploy > ได้ URL สำหรับแจกจ่าย

[IMAGE: deploy-web-app-url.png]


อัปเดต Version

ทุกครั้งที่แก้โค้ดแล้วอยาก Deploy ใหม่:
1. กด Deploy > Manage deployments
2. กดรูปดินสอ (แก้ไข)
3. เลือก Version: New version
4. กด Deploy

[IMAGE: manage-deployments-new-version.png]

สำคัญ: URL จะเป็นตัวเดิม — คนที่มี URL อยู่แล้วจะเห็นเวอร์ชันใหม่อัตโนมัติ


Trigger — ตั้งเวลาให้รันอัตโนมัติ

นอกจากรันมือ ยังตั้งให้รันเองได้:

1. ไปที่เมนู Triggers (รูปนาฬิกาทางซ้าย)
2. กด + Add Trigger

[IMAGE: add-trigger.png]

ประเภท Trigger:
- onOpen — รันเมื่อเปิด Sheet
- onEdit — รันเมื่อแก้ไขช่อง
- Time-driven — ตั้งเวลา เช่น ทุก 1 ชม., ทุกวันตอน 8 โมง

ตัวอย่าง: ส่งรายงานทุกเช้า 8 โมง
function sendDailyReport() {
  var data = getReportData();
  MailApp.sendEmail("boss@company.com", "รายงานประจำวัน", data);
}
แล้วตั้ง Time-driven trigger: Day timer > 8am to 9am


ทำสำเนา Script & Deploy ใหม่

อยากใช้ระบบเดิมแต่ทำอีก instance? เช่น ระบบเดียวกันแต่คนละแผนก

1. เปิดโปรเจค Apps Script
2. ไปที่ Overview > กดรูป Copy (Make a copy)

[IMAGE: make-a-copy.png]

3. จะได้โปรเจคใหม่ — แก้ config ให้ชี้ Sheet ใหม่
4. Deploy ใหม่ → ได้ URL ใหม่แยกกัน

เคล็ดลับ: ถ้าเก็บ config ไว้ใน Sheet (จากบทที่ 2) จะแก้ง่ายมาก แค่เปลี่ยน SHEET_ID


สรุปบทนี้
- Run (▶) = ทดสอบ function เร็วๆ
- Test deployments (/dev) = ดู Web App แบบ draft ไม่กระทบ version จริง
- Deploy > New deployment = ปล่อย version ใหม่
- Trigger ตั้งให้รันอัตโนมัติได้
- ทำสำเนา script ด้วย Make a copy แล้ว Deploy ใหม่เป็น URL แยก',
  4, false, 20
) ON CONFLICT (id) DO NOTHING;
-- Part 2: Lesson 5
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000005',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'HTML Service & จัดหน้าเว็บ',
  'บทนี้เริ่มทำหน้าเว็บใน Apps Script กันแล้ว!


สร้างหน้าเว็บด้วย HTML Service

Apps Script สร้างหน้าเว็บได้ด้วย HtmlService โดยเขียน HTML แยกไฟล์

ขั้นตอน:
1. ในโปรเจค กด + > HTML เพื่อสร้างไฟล์ HTML
2. ตั้งชื่อว่า index (จะได้ index.html)

[IMAGE: create-html-file.png]

3. เขียนโค้ดฝั่ง server ใน Code.gs:

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("เว็บของฉัน")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

4. เขียน HTML ใน index.html:

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>เว็บของฉัน</title>
</head>
<body>
  <h1>สวัสดี!</h1>
  <p>นี่คือหน้าเว็บจาก Apps Script</p>
</body>
</html>

5. ทดสอบด้วย Test deployments แล้วเปิด URL ดู

[IMAGE: first-html-page-result.png]


CSS vs Bootstrap vs Tailwind CSS

ตอนจัดหน้าเว็บ มี 3 ทางเลือกหลัก:

1. เขียน CSS เอง
   ข้อดี: ควบคุมได้ 100%
   ข้อเสีย: ช้า ต้องเขียนเยอะ

2. Bootstrap (แนะนำสำหรับมือใหม่)
   ข้อดี: มี component สำเร็จรูป (ปุ่ม, ตาราง, card, modal)
   ใช้ CDN ได้เลย ไม่ต้องติดตั้งอะไร
   ข้อเสีย: หน้าตาอาจดูเหมือนเว็บอื่น

3. Tailwind CSS
   ข้อดี: เขียนเร็ว ยืดหยุ่นสูง
   ข้อเสีย: ต้องเข้าใจ concept ก่อน ไม่เหมาะมือใหม่จริงๆ

สำหรับคอร์สนี้ เราจะใช้ Bootstrap เพราะใส่ CDN แล้วใช้ได้เลย


เพิ่ม Bootstrap ใน Apps Script

แก้ index.html เป็น:

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>เว็บของฉัน</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-4">
    <h1 class="text-primary">สวัสดี!</h1>
    <p class="lead">นี่คือหน้าเว็บจาก Apps Script + Bootstrap</p>
    <button class="btn btn-primary">กดฉัน</button>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

[IMAGE: bootstrap-first-page.png]

แค่เพิ่ม 2 บรรทัด (link CSS + script JS) ก็ได้หน้าเว็บสวยขึ้นทันที


เปลี่ยนฟอนต์ด้วย Google Fonts

ฟอนต์ไทยที่แนะนำ:
- Sarabun — อ่านง่าย เหมาะกับเนื้อหาทั่วไป
- Noto Sans Thai — ดูทันสมัย
- Prompt — สวย เหมาะทำ dashboard

วิธีเพิ่ม: ใส่ใน <head>

<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  body { font-family: "Sarabun", sans-serif; }
</style>

[IMAGE: google-fonts-sarabun.png]

หรือจะใช้ @import ใน CSS ก็ได้:
<style>
  @import url("https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;700&display=swap");
  body { font-family: "Prompt", sans-serif; }
</style>


สรุปบทนี้
- สร้างหน้าเว็บด้วย HtmlService.createHtmlOutputFromFile()
- doGet() คือ function ที่ทำงานเมื่อมีคนเปิดหน้าเว็บ
- Bootstrap ใช้ CDN ได้เลย เหมาะมือใหม่
- เปลี่ยนฟอนต์ด้วย Google Fonts แค่เพิ่ม link ใน head',
  5, false, 15
) ON CONFLICT (id) DO NOTHING;
-- Part 2: Lesson 6
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000006',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Responsive & SPA ด้วย Alpine.js',
  'บทนี้จะทำให้หน้าเว็บใช้ได้ดีทั้งมือถือและคอม แล้วก็ทำ SPA (ไม่ต้อง reload หน้า)


ทำให้หน้าเว็บ Responsive

Responsive = หน้าเว็บปรับตัวตามขนาดหน้าจอ ดูดีทั้งมือถือ แท็บเล็ต คอม

สิ่งที่ต้องมีเสมอ — viewport meta tag:
<meta name="viewport" content="width=device-width, initial-scale=1">

ถ้าไม่ใส่บรรทัดนี้ หน้าเว็บจะแสดงผลเหมือนเปิดบนคอมจอใหญ่ แล้วย่อลงมา ตัวหนังสือจิ๋วมาก

[IMAGE: with-vs-without-viewport.png]


Bootstrap Grid System

Bootstrap แบ่งหน้าจอเป็น 12 คอลัมน์ ใช้ class row + col:

<div class="container">
  <div class="row">
    <div class="col-md-6">ซ้าย (ครึ่งจอบนคอม)</div>
    <div class="col-md-6">ขวา (ครึ่งจอบนคอม)</div>
  </div>
</div>

col-md-6 หมายถึง: บนจอ medium ขึ้นไป ใช้ 6/12 = ครึ่งจอ
บนมือถือจะเรียงเป็นแนวตั้งอัตโนมัติ

ขนาดจอ:
- col-    = ทุกขนาด
- col-sm- = มือถือแนวนอน (576px+)
- col-md- = แท็บเล็ต (768px+)
- col-lg- = คอม (992px+)

[IMAGE: bootstrap-grid-responsive.png]


ทดสอบ Responsive ด้วย F12

1. เปิดหน้าเว็บ
2. กด F12 เปิด DevTools
3. กดรูปมือถือ (Toggle Device Toolbar) หรือกด Ctrl+Shift+M
4. เลือกขนาดหน้าจอต่างๆ ดู

[IMAGE: f12-device-toolbar.png]


Alpine.js — ทำ SPA แบบง่าย

ปัญหา: ถ้ามีหลายหน้า (เช่น หน้าแรก, หน้ากรอกข้อมูล, หน้าดูรายงาน) ทุกครั้งที่เปลี่ยนหน้าจะ reload ทั้งหน้า ทำให้ช้าและกระตุก

Alpine.js แก้ปัญหานี้ได้ — เปลี่ยนหน้าโดยไม่ reload

ทำไมใช้ Alpine.js?
- เบามาก (~15kb)
- ใช้ CDN ได้เลย ไม่ต้อง build
- เขียนง่าย เหมาะกับ Apps Script มาก
- ไม่ต้องเรียน React/Vue ที่ซับซ้อนกว่า

เพิ่ม Alpine.js ใน HTML:
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js" defer></script>


ตัวอย่าง SPA ด้วย Alpine.js

<body x-data="{ page: ''home'' }">

  <!-- เมนู -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <span class="navbar-brand">ระบบของฉัน</span>
      <div class="navbar-nav">
        <a class="nav-link" :class="{ ''active'': page===''home'' }"
           @click="page=''home''" style="cursor:pointer">หน้าแรก</a>
        <a class="nav-link" :class="{ ''active'': page===''form'' }"
           @click="page=''form''" style="cursor:pointer">กรอกข้อมูล</a>
        <a class="nav-link" :class="{ ''active'': page===''report'' }"
           @click="page=''report''" style="cursor:pointer">รายงาน</a>
      </div>
    </div>
  </nav>

  <div class="container mt-4">
    <!-- หน้าแรก -->
    <div x-show="page===''home''">
      <h2>ยินดีต้อนรับ</h2>
      <p>เลือกเมนูด้านบนเพื่อเริ่มใช้งาน</p>
    </div>

    <!-- หน้ากรอกข้อมูล -->
    <div x-show="page===''form''">
      <h2>กรอกข้อมูล</h2>
      <form> ... </form>
    </div>

    <!-- หน้ารายงาน -->
    <div x-show="page===''report''">
      <h2>รายงาน</h2>
      <table class="table"> ... </table>
    </div>
  </div>

</body>

[IMAGE: alpine-spa-demo.png]

อธิบายสั้นๆ:
- x-data = ประกาศตัวแปร (page เริ่มต้นเป็น home)
- @click = เมื่อคลิกให้เปลี่ยนค่า page
- x-show = แสดง div เฉพาะเมื่อเงื่อนไขตรง
- ไม่มี reload เลย! เปลี่ยนหน้าทันที


สรุปบทนี้
- Responsive ต้องมี viewport meta tag เสมอ
- Bootstrap Grid แบ่งจอเป็น 12 คอลัมน์ ใช้ col-md-6 แบบนี้
- ทดสอบ Responsive ด้วย F12 > Device Toolbar
- Alpine.js ทำ SPA ได้โดยไม่ต้อง reload หน้า เหมาะกับ Apps Script มาก',
  6, false, 20
) ON CONFLICT (id) DO NOTHING;
-- Part 2: Lesson 7
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000007',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'เชื่อม Frontend กับ Backend',
  'บทนี้สำคัญมาก! จะสอนวิธีให้หน้าเว็บ (HTML) คุยกับโค้ดฝั่ง server (.gs) ได้


google.script.run คืออะไร?

มันคือ "สะพาน" ที่เชื่อมระหว่าง:
- หน้าเว็บ (HTML/JavaScript) → ฝั่ง client
- โค้ด Apps Script (.gs) → ฝั่ง server

เวลาหน้าเว็บอยากดึงข้อมูลจาก Sheet หรือบันทึกข้อมูล ต้องผ่าน google.script.run เท่านั้น!

สำคัญ: ใน Apps Script จะใช้ fetch หรือ axios ไม่ได้! ต้องใช้ google.script.run เสมอ


ตัวอย่าง: ดึงข้อมูลจาก Sheet มาแสดงหน้าเว็บ

ฝั่ง server (Code.gs):
function getData() {
  var ss = SpreadsheetApp.openById("ใส่_SHEET_ID");
  var sheet = ss.getSheetByName("Data");
  var data = sheet.getDataRange().getValues();
  return data;
}

ฝั่ง client (index.html):
<script>
  // เรียก function getData() ที่อยู่ใน Code.gs
  google.script.run
    .withSuccessHandler(function(data) {
      // data คือค่าที่ return มาจาก getData()
      console.log(data);
      // เอาไปแสดงในตารางได้เลย
    })
    .withFailureHandler(function(error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    })
    .getData();
</script>

[IMAGE: google-script-run-flow.png]

อธิบาย:
1. หน้าเว็บเรียก google.script.run.getData()
2. ระบบส่งคำสั่งไปฝั่ง server
3. function getData() ใน Code.gs ทำงาน
4. return ค่ากลับมา
5. withSuccessHandler รับค่าไปใช้ต่อ


ตัวอย่าง: บันทึกข้อมูลจากฟอร์มลง Sheet

ฝั่ง server (Code.gs):
function saveData(formData) {
  var ss = SpreadsheetApp.openById("ใส่_SHEET_ID");
  var sheet = ss.getSheetByName("Data");
  sheet.appendRow([
    formData.name,
    formData.phone,
    new Date()
  ]);
  return "บันทึกสำเร็จ";
}

ฝั่ง client (index.html):
<form id="myForm">
  <div class="mb-3">
    <label class="form-label">ชื่อ</label>
    <input type="text" class="form-control" id="name">
  </div>
  <div class="mb-3">
    <label class="form-label">เบอร์โทร</label>
    <input type="text" class="form-control" id="phone">
  </div>
  <button type="button" class="btn btn-primary" onclick="submitForm()">บันทึก</button>
</form>

<script>
  function submitForm() {
    var formData = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value
    };

    google.script.run
      .withSuccessHandler(function(result) {
        alert(result);  // "บันทึกสำเร็จ"
      })
      .withFailureHandler(function(error) {
        alert("Error: " + error.message);
      })
      .saveData(formData);
  }
</script>

[IMAGE: form-save-to-sheet.png]


ข้อควรระวัง

1. ส่งได้แค่ค่าธรรมดา
   ส่งได้: string, number, boolean, array, object ธรรมดา
   ส่งไม่ได้: Date object, function, DOM element
   ถ้าจะส่งวันที่ ให้แปลงเป็น string ก่อน

2. ไม่มี return ค่าตรงๆ
   ❌ var result = google.script.run.getData();
   ✅ ต้องใช้ withSuccessHandler เสมอ เพราะมันทำงานแบบ async

3. เรียกได้เฉพาะ function ที่อยู่ใน .gs
   function ที่เขียนใน HTML จะเรียกด้วย google.script.run ไม่ได้


ตัวอย่าง: แสดงข้อมูลเป็นตาราง

<table class="table table-striped" id="dataTable">
  <thead>
    <tr><th>ชื่อ</th><th>เบอร์โทร</th><th>วันที่</th></tr>
  </thead>
  <tbody></tbody>
</table>

<script>
  google.script.run
    .withSuccessHandler(function(data) {
      var tbody = document.querySelector("#dataTable tbody");
      // ข้ามแถวแรก (หัวตาราง)
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        tbody.innerHTML += "<tr><td>" + row[0] + "</td><td>" + row[1] + "</td><td>" + row[2] + "</td></tr>";
      }
    })
    .getData();
</script>


สรุปบทนี้
- google.script.run คือทางเดียวที่หน้าเว็บจะคุยกับ Code.gs ได้
- ใช้ fetch/axios ไม่ได้ ต้องใช้ google.script.run เท่านั้น
- ต้องใช้ withSuccessHandler รับค่า return
- ส่งได้แค่ค่าธรรมดา (string, number, array, object)
- withFailureHandler ดักจับ error เสมอ',
  7, false, 20
) ON CONFLICT (id) DO NOTHING;
-- Part 3: Lesson 8
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000008',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Prompt AI ให้สร้างโค้ด Apps Script',
  'ปัจจุบัน AI ช่วยเขียนโค้ดได้เก่งมาก แต่ถ้า prompt ไม่ดี ผลลัพธ์ก็จะไม่ดี บทนี้จะสอนวิธี prompt ให้ได้โค้ดที่ใช้งานได้จริง


หลักการ: บอก AI ให้ชัดที่สุด

AI ไม่ได้อ่านใจเราได้ ยิ่งบอกรายละเอียดมาก ยิ่งได้โค้ดที่ตรงใจ


Prompt ที่แย่ vs ดี

❌ แย่:
"สร้างเว็บลงทะเบียนให้หน่อย"

AI จะไม่รู้ว่า:
- ใช้เทคโนโลยีอะไร?
- ข้อมูลเก็บไว้ที่ไหน?
- หน้าตาเป็นยังไง?

✅ ดี:
"สร้าง Google Apps Script Web App ระบบลงทะเบียน
- เก็บข้อมูลลง Google Sheets (SHEET_ID: xxx)
- Sheet ชื่อ Register มีคอลัมน์: ชื่อ, เบอร์โทร, วันที่ลงทะเบียน
- หน้าเว็บใช้ Bootstrap 5 + ฟอนต์ Sarabun
- มีฟอร์มกรอก ชื่อ + เบอร์โทร
- กดปุ่มบันทึกแล้วเขียนลง Sheet ด้วย google.script.run
- แสดง alert บันทึกสำเร็จ"


สิ่งที่ต้องระบุใน Prompt

1. ระบุว่าเป็น Google Apps Script
   "สร้างด้วย Google Apps Script" — ถ้าไม่บอก AI อาจไปใช้ Node.js หรือ Python

2. ระบุ google.script.run
   "ฝั่ง HTML ให้เรียก function ฝั่ง server ผ่าน google.script.run"
   ถ้าไม่บอก AI อาจใช้ fetch หรือ axios ซึ่งใช้ไม่ได้ใน Apps Script!

3. ระบุโครงสร้าง Sheet
   "Sheet ชื่อ Data มีคอลัมน์: A=ชื่อ, B=อายุ, C=แผนก"
   ยิ่งละเอียดยิ่งดี

4. ระบุ Library/Framework ที่ใช้
   "ใช้ Bootstrap 5 CDN" หรือ "ใช้ Alpine.js สำหรับ SPA"

5. ระบุพฤติกรรมที่ต้องการ
   "กดปุ่มแล้วโหลดข้อมูลมาแสดงในตาราง"
   "กรอกฟอร์มแล้วบันทึกลง Sheet"


ตัวอย่าง Prompt ที่ดี — ระบบดูข้อมูลพนักงาน

"สร้าง Google Apps Script Web App ระบบดูข้อมูลพนักงาน

โครงสร้าง:
- Google Sheets ID: 1ABC_xyz
- Sheet ชื่อ Employees
- คอลัมน์: A=รหัส, B=ชื่อ, C=แผนก, D=เบอร์โทร

ฝั่ง server (Code.gs):
- doGet() แสดงหน้า HTML
- getEmployees() อ่านข้อมูลจาก Sheet แล้ว return เป็น array

ฝั่ง client (index.html):
- ใช้ Bootstrap 5 CDN + Google Fonts Sarabun
- โหลดข้อมูลจาก getEmployees() ด้วย google.script.run
- แสดงเป็นตาราง Bootstrap
- มีช่องค้นหาชื่อพนักงาน (filter ฝั่ง client)"


ตัวอย่าง Prompt — ระบบ SPA หลายหน้า

"สร้าง Google Apps Script Web App ระบบจัดการสินค้า

ใช้:
- Bootstrap 5 CDN
- Alpine.js CDN สำหรับทำ SPA
- Google Fonts: Prompt

หน้า (ใช้ Alpine.js x-show เปลี่ยนหน้า):
1. หน้าแรก — แสดงจำนวนสินค้าทั้งหมด
2. หน้าเพิ่มสินค้า — ฟอร์มกรอก ชื่อ, ราคา, จำนวน
3. หน้าดูสินค้า — ตารางแสดงสินค้าทั้งหมด

ฝั่ง server:
- เก็บข้อมูลใน Sheet ชื่อ Products
- คอลัมน์: A=ชื่อ, B=ราคา, C=จำนวน, D=วันที่เพิ่ม
- function getProducts() return ข้อมูลทั้งหมด
- function addProduct(data) เพิ่มแถวใหม่

ฝั่ง client:
- เรียกทุก function ผ่าน google.script.run
- withSuccessHandler / withFailureHandler ทุกครั้ง"


เคล็ดลับเพิ่มเติม

- ถ้า AI ให้โค้ดมาแล้วใช้ fetch → บอกให้เปลี่ยนเป็น google.script.run
- ถ้าโค้ดยาว ให้สั่ง "แยกไฟล์เป็น Code.gs กับ index.html ให้ชัดเจน"
- ถ้าอยากได้ comment ภาษาไทย ให้ระบุ "comment เป็นภาษาไทย"
- ลองรันแล้ว error? ดูบทถัดไปเรื่องวิธีแก้ปัญหาด้วย AI


สรุปบทนี้
- Prompt ที่ดี = ระบุรายละเอียดให้มากที่สุด
- ต้องบอก AI ว่าใช้ Google Apps Script
- ต้องระบุให้ใช้ google.script.run (ไม่ใช่ fetch/axios)
- บอกโครงสร้าง Sheet, framework ที่ใช้, พฤติกรรมที่ต้องการ',
  8, false, 15
) ON CONFLICT (id) DO NOTHING;
-- Part 3: Lesson 9
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000009',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'แก้ปัญหาด้วย AI',
  'เขียนโค้ดแล้ว error เป็นเรื่องปกติ บทนี้จะสอนวิธีใช้ AI ช่วยแก้ปัญหาให้เร็วที่สุด


วิธีที่ 1: คัดลอก Error Message ส่งให้ AI

ขั้นตอน:
1. รันโค้ดแล้วเจอ error ใน Execution log
2. คัดลอก error message ทั้งก้อน
3. วางในแชท AI พร้อมบอกว่า "โค้ดนี้ error ช่วยแก้ให้"

[IMAGE: copy-error-from-execution-log.png]

ตัวอย่าง prompt:
"โค้ด Apps Script ของฉัน error แบบนี้:

TypeError: Cannot read properties of null (reading ''getRange'')
at getData (Code.gs:5)

นี่คือโค้ด:
function getData() {
  var ss = SpreadsheetApp.openById(''xxx'');
  var sheet = ss.getSheetByName(''Data'');
  var data = sheet.getRange(''A1:C10'').getValues();
  return data;
}

ช่วยแก้ให้หน่อย"

AI จะบอกว่า: sheet เป็น null เพราะหา Sheet ชื่อ Data ไม่เจอ ให้เช็คชื่อ Sheet ว่าตรงไหม


วิธีที่ 2: แคปรูปหน้าจอ error ส่งให้ AI

บางที error แสดงเป็นรูปภาพ หรือหน้าเว็บแสดงผลผิด → แคปรูปส่งได้เลย

[IMAGE: screenshot-error-example.png]

ตัวอย่าง prompt:
"หน้าเว็บ Apps Script ของฉันแสดงผลแบบรูปที่แนบ
ปัญหาคือ: ตารางไม่ responsive บนมือถือ ล้นออกนอกจอ
ช่วยแก้ให้หน่อย"


วิธีที่ 3: ส่งโค้ดทั้งไฟล์ ให้ AI ตรวจ

ถ้าไม่รู้ว่า error ตรงไหน ส่งโค้ดทั้งไฟล์ได้เลย:

"ช่วยตรวจโค้ด Apps Script นี้ให้หน่อย
มันทำงานไม่ถูกต้อง — กดบันทึกแล้วข้อมูลไม่ลง Sheet

Code.gs:
(วางโค้ดทั้งไฟล์)

index.html:
(วางโค้ดทั้งไฟล์)"


Error ที่เจอบ่อย & วิธีบอก AI

1. "Cannot read properties of null"
   หมายถึง: ตัวแปรเป็น null แล้วพยายามเรียก method
   มักเกิดจาก: ชื่อ Sheet ผิด, SHEET_ID ผิด
   บอก AI: "error Cannot read properties of null ที่บรรทัด X"

2. "You do not have permission"
   หมายถึง: ไม่มีสิทธิ์เข้าถึง
   มักเกิดจาก: ยังไม่ได้ authorize, Sheet ไม่ได้แชร์
   บอก AI: "error permission denied ทั้งที่ authorize แล้ว"

3. "Script function not found: doGet"
   หมายถึง: ตอน Deploy หา function doGet ไม่เจอ
   มักเกิดจาก: ชื่อ function พิมพ์ผิด, อยู่ผิดไฟล์
   บอก AI: "deploy Web App แล้ว error Script function not found"

4. "Exceeded maximum execution time"
   หมายถึง: โค้ดรันนานเกิน 6 นาที
   มักเกิดจาก: loop ไม่จบ, ดึงข้อมูลเยอะเกิน
   บอก AI: "โค้ดรันนานเกิน timeout ช่วย optimize ให้"


เคล็ดลับการส่งปัญหาให้ AI

1. บอก context ให้ครบ
   - ใช้ Apps Script แบบไหน (Web App / Container-bound)
   - เกิด error ตอนไหน (ตอนรัน / ตอน deploy / ตอนเปิดหน้าเว็บ)
   - ทำอะไรก่อนหน้านั้น

2. ส่งโค้ดที่เกี่ยวข้อง
   - ไม่ต้องส่งทุกไฟล์ถ้ารู้ว่า error ตรงไหน
   - แต่ถ้าไม่แน่ใจ ส่งทั้งหมดเลยดีกว่า

3. บอกสิ่งที่ลองแล้ว
   - "ลอง console.log ดูแล้ว ค่าเป็น undefined"
   - "ลองเปลี่ยนชื่อ Sheet แล้วยังไม่หาย"
   AI จะไม่เสียเวลาแนะนำสิ่งที่ลองไปแล้ว


สรุปบทนี้
- เจอ error → คัดลอก error message ส่ง AI พร้อมโค้ด
- หน้าเว็บผิด → แคปรูปส่ง AI
- บอก context ให้ครบ: ใช้อะไร, error ตอนไหน, ลองอะไรแล้ว
- error ที่พบบ่อย: null, permission, function not found, timeout',
  9, false, 15
) ON CONFLICT (id) DO NOTHING;
-- Part 4: Lesson 10
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000010',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'แนะนำ Antigravity',
  'จากนี้เราจะลงมือทำโปรเจคจริงกัน! โปรเจคที่จะทำคือ Antigravity


Antigravity คืออะไร?

[IMAGE: antigravity-demo-overview.png]

(รายละเอียดเฉพาะของ Antigravity — รอใส่เนื้อหาจริง)


ดู Demo ผลลัพธ์

ก่อนจะเริ่มเขียน มาดูกันก่อนว่าพอทำเสร็จแล้วจะได้อะไร:

[IMAGE: antigravity-demo-1.png]
[IMAGE: antigravity-demo-2.png]
[IMAGE: antigravity-demo-3.png]


โครงสร้างโปรเจค

ไฟล์ที่จะมี:
- Code.gs — โค้ดฝั่ง server (จัดการข้อมูล, doGet)
- index.html — หน้าเว็บหลัก
- (ไฟล์อื่นๆ ตามโปรเจค)

Sheet ที่ใช้:
(รายละเอียดโครงสร้าง Sheet — รอใส่เนื้อหาจริง)


สิ่งที่เรียนมาจะถูกใช้ทั้งหมด

ทุกอย่างที่เรียนมา 9 บทที่ผ่านมาจะถูกใช้ในโปรเจคนี้:
- openById + getSheetByName (บทที่ 2)
- จัดการ Date, Leading Zero (บทที่ 3)
- Deploy & ทดสอบด้วย /dev (บทที่ 4)
- Bootstrap + Google Fonts (บทที่ 5)
- Alpine.js ทำ SPA (บทที่ 6)
- google.script.run เชื่อม frontend-backend (บทที่ 7)
- ใช้ AI ช่วยเขียนและแก้ปัญหา (บทที่ 8-9)


วิธีทำมี 2 แบบ

บทถัดไปจะสอนทั้ง 2 วิธี:
1. Copy & Paste — ก็อปโค้ดไปวางใน Apps Script Editor ตรงๆ
2. ใช้ CLASP — เขียนบนเครื่อง แล้ว push ขึ้นไป

เลือกวิธีไหนก็ได้ ผลลัพธ์เหมือนกัน!


สรุปบทนี้
- Antigravity คือโปรเจคจริงที่จะลงมือทำ
- ใช้ความรู้ทุกบทที่เรียนมา
- มี 2 วิธีทำ: Copy & Paste หรือ CLASP',
  10, false, 10
) ON CONFLICT (id) DO NOTHING;
-- Part 4: Lesson 11
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000011',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Antigravity — วิธี Copy & Paste',
  'วิธีนี้เหมาะกับคนที่อยากได้ผลลัพธ์เร็ว ไม่ต้องติดตั้งอะไรเพิ่ม


เตรียมตัว

สิ่งที่ต้องมี:
1. Google Account
2. Google Sheets สำหรับเก็บข้อมูล
3. โค้ดที่เตรียมไว้ให้ (จะให้ในบทนี้)


ขั้นตอนที่ 1: สร้าง Google Sheets

1. เปิด Google Sheets สร้างไฟล์ใหม่
2. สร้าง Sheet ตามโครงสร้างที่กำหนด

(รายละเอียดโครงสร้าง Sheet — รอใส่เนื้อหาจริง)

3. คัดลอก SHEET_ID จาก URL ไว้

[IMAGE: copy-paste-create-sheet.png]


ขั้นตอนที่ 2: สร้าง Apps Script Project

1. ไปที่ Extensions > Apps Script
   หรือเปิด script.google.com > New Project

2. ลบโค้ดเดิมในไฟล์ Code.gs ออกให้หมด

[IMAGE: copy-paste-new-project.png]


ขั้นตอนที่ 3: Copy โค้ดไปวาง

ไฟล์ Code.gs:
(วางโค้ดที่เตรียมไว้ — รอใส่โค้ดจริง)

สร้างไฟล์ index.html:
1. กด + > HTML > ตั้งชื่อ index
2. ลบโค้ดเดิม แล้ววางโค้ดที่เตรียมไว้

(วางโค้ดที่เตรียมไว้ — รอใส่โค้ดจริง)

[IMAGE: copy-paste-code-gs.png]
[IMAGE: copy-paste-index-html.png]


ขั้นตอนที่ 4: แก้ Config

เปิดไฟล์ Code.gs แล้วแก้:
- SHEET_ID = ใส่ ID ของ Sheet ที่สร้างไว้
- ค่า config อื่นๆ ตามที่กำหนด

(รายละเอียด config — รอใส่เนื้อหาจริง)


ขั้นตอนที่ 5: ทดสอบ

1. ทดสอบ function ด้วย Run (▶)
   - เลือก function ที่อยากทดสอบ
   - ดูผลใน Execution log

2. ทดสอบหน้าเว็บด้วย Test deployments
   - กด Deploy > Test deployments
   - เปิด URL /dev ดู

[IMAGE: copy-paste-test-dev.png]


ขั้นตอนที่ 6: Deploy

พอทดสอบแล้วโอเค:
1. กด Deploy > New deployment
2. Type: Web app
3. Execute as: Me
4. Who has access: Anyone (หรือตามต้องการ)
5. กด Deploy

[IMAGE: copy-paste-deploy-done.png]

เสร็จแล้ว! แชร์ URL ให้คนอื่นใช้ได้เลย


ข้อจำกัดของวิธี Copy & Paste

- ไม่มี version control (ถ้าแก้พลาด ย้อนกลับยาก)
- แก้โค้ดได้แค่ใน browser
- ทำงานเป็นทีมลำบาก
- Editor ไม่มี autocomplete ดีๆ

ถ้าอยากได้ประสบการณ์ที่ดีกว่า → ดูบทถัดไปเรื่อง CLASP


สรุปบทนี้
- สร้าง Sheet → สร้าง Apps Script → Copy โค้ดวาง → แก้ config → ทดสอบ → Deploy
- ใช้ /dev ทดสอบก่อน Deploy เสมอ
- วิธีนี้เร็วแต่จำกัดเรื่อง version control',
  11, false, 20
) ON CONFLICT (id) DO NOTHING;
-- Part 4: Lesson 12
INSERT INTO lessons (id, course_id, title, description, sort_order, is_preview, duration_minutes)
VALUES (
  'b1000000-0000-0000-0000-000000000012',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Antigravity — วิธีใช้ CLASP',
  'CLASP ให้คุณเขียนโค้ดบนเครื่องตัวเอง ใช้ VS Code ได้ มี Git version control แล้ว push ขึ้น Apps Script


CLASP คืออะไร?

CLASP = Command Line Apps Script Projects
เป็นเครื่องมือของ Google ที่ให้จัดการ Apps Script จาก Terminal/Command Line

ข้อดี:
- ใช้ VS Code หรือ editor ที่ชอบได้
- มี autocomplete, syntax highlighting ดีกว่า
- ใช้ Git เก็บ version ได้
- ทำงานเป็นทีมง่าย
- push โค้ดขึ้น Apps Script ได้ทันที


ขั้นตอนที่ 1: ติดตั้ง

ต้องมี Node.js ก่อน (ถ้ายังไม่มี โหลดจาก nodejs.org)

เปิด Terminal แล้วรัน:
npm install -g @google/clasp

เช็คว่าติดตั้งสำเร็จ:
clasp --version

[IMAGE: clasp-install-terminal.png]


ขั้นตอนที่ 2: Login

clasp login

จะเปิดเบราว์เซอร์ให้ login Google Account แล้วกด Allow

[IMAGE: clasp-login-browser.png]


ขั้นตอนที่ 3: เปิด Apps Script API

ต้องเปิด API ก่อนถึงจะใช้ CLASP ได้:
1. ไปที่ script.google.com/home/usersettings
2. เปิด Google Apps Script API เป็น ON

[IMAGE: enable-apps-script-api.png]


ขั้นตอนที่ 4: Clone หรือ Create โปรเจค

วิธี A: สร้างโปรเจคใหม่
mkdir my-project
cd my-project
clasp create --title "Antigravity" --type webapp

วิธี B: Clone โปรเจคที่มีอยู่แล้ว
clasp clone SCRIPT_ID

เอา SCRIPT_ID จากไหน?
เปิด Apps Script Editor > Project Settings > Script ID

[IMAGE: find-script-id.png]


โครงสร้างไฟล์บนเครื่อง

หลัง clone/create จะได้:
my-project/
  .clasp.json     ← config ของ CLASP (SCRIPT_ID อยู่ในนี้)
  appsscript.json  ← config ของ Apps Script
  Code.js          ← โค้ด server (เขียนเป็น .js แต่ push ขึ้นไปเป็น .gs)

สร้างไฟล์ HTML ได้ตามปกติ:
my-project/
  .clasp.json
  appsscript.json
  Code.js
  index.html


ขั้นตอนที่ 5: เขียนโค้ดใน VS Code

เปิดโฟลเดอร์ใน VS Code:
code .

แก้ไขโค้ดตามต้องการ แล้วบันทึก

[IMAGE: clasp-vscode-editing.png]


ขั้นตอนที่ 6: Push โค้ดขึ้น Apps Script

clasp push

โค้ดบนเครื่องจะถูกอัพโหลดไปทับใน Apps Script Editor

ถ้าอยากให้ push อัตโนมัติทุกครั้งที่บันทึก:
clasp push --watch

[IMAGE: clasp-push-terminal.png]


ขั้นตอนที่ 7: ทดสอบ & Deploy

ทดสอบ:
- เปิด Apps Script Editor ดูว่าโค้ดขึ้นไปถูกต้อง
- ใช้ Test deployments (/dev) ทดสอบหน้าเว็บ

Deploy:
clasp deploy --description "v1.0"

หรือจะ Deploy จาก Apps Script Editor ก็ได้เหมือนเดิม


ใช้ Git ร่วมกับ CLASP

cd my-project
git init
git add .
git commit -m "first commit"

ตอนนี้มี version control แล้ว!
- แก้พลาด → git checkout เอาโค้ดเก่ากลับ
- อยากลองอะไรใหม่ → สร้าง branch
- ทำงานกับเพื่อน → push ขึ้น GitHub


คำสั่ง CLASP ที่ใช้บ่อย

clasp login          ← login Google Account
clasp create         ← สร้างโปรเจคใหม่
clasp clone ID       ← clone โปรเจคที่มีอยู่
clasp pull           ← ดึงโค้ดจาก Apps Script ลงเครื่อง
clasp push           ← push โค้ดจากเครื่องขึ้น Apps Script
clasp push --watch   ← push อัตโนมัติเมื่อบันทึก
clasp deploy         ← deploy version ใหม่
clasp open           ← เปิด Apps Script Editor ในเบราว์เซอร์
clasp logs           ← ดู log จาก Terminal


สรุปบทนี้
- CLASP ให้เขียน Apps Script บนเครื่องตัวเองด้วย VS Code
- ติดตั้งด้วย npm install -g @google/clasp
- clasp push อัพโหลดโค้ดขึ้น Apps Script
- ใช้ Git ร่วมกันได้ มี version control
- clasp deploy สร้าง version ใหม่จาก Terminal ได้เลย',
  12, false, 20
) ON CONFLICT (id) DO NOTHING;
